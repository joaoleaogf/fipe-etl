import os
import re
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

LOG_DIR = "../output"
LOG_PATTERN = re.compile(r"etl-log-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.txt")

def listar_logs(diretorio):
    return [
        os.path.join(diretorio, f)
        for f in os.listdir(diretorio)
        if LOG_PATTERN.match(f)
    ]

def parse_log_file(filepath):
    marcas, modelos, anos, timestamps = [], [], [], []

    with open(filepath, encoding='utf-8') as f:
        for line in f:
            ts_match = re.match(r"\[(.*?)\]", line)
            if ts_match:
                ts_str = ts_match[1].replace("Z", "")
                try:
                    timestamps.append(datetime.fromisoformat(ts_str))
                except ValueError:
                    continue

            if "📌 Processando marca:" in line:
                marcas.append(line)
            elif "🔍 Processando modelo:" in line:
                modelos.append(line)
            elif "🕓 Processando ano:" in line:
                anos.append(line)

    return {
        'marcas': len(marcas),
        'modelos': len(modelos),
        'anos': len(anos),
        'timestamps': timestamps
    }

def parse_erros_file(filepath):
    if not os.path.exists(filepath):
        return pd.Series()

    with open(filepath, encoding='utf-8') as f:
        lines = f.readlines()

    tipos_erro = []
    for line in lines:
        match = re.search(r'- (Dados inconsistentes|Campos faltantes ou inválidos) -', line)
        if match:
            tipos_erro.append(match.group(1))

    return pd.Series(tipos_erro).value_counts()

def plot_metrics(resumo, erros_por_tipo):
    totais = {
        'Marcas': sum(r['marcas'] for r in resumo),
        'Modelos': sum(r['modelos'] for r in resumo),
        'Anos': sum(r['anos'] for r in resumo),
    }

    print(f"TOTAIS: {totais}")

    plt.figure()
    plt.bar(totais.keys(), totais.values())
    plt.title('Totais processados')
    plt.ylabel('Quantidade')
    plt.show()

    if not erros_por_tipo.empty:
        plt.figure()
        erros_por_tipo.plot(kind='bar')
        plt.title('Erros por tipo')
        plt.ylabel('Ocorrências')
        plt.show()

    todos_ts = [ts for r in resumo for ts in r['timestamps']]
    if todos_ts:
        ts_df = pd.Series(1, index=pd.to_datetime(todos_ts)).resample('H').sum()
        ts_df.plot(title='Processamento por hora', kind='line')
        plt.ylabel('Eventos de log')
        plt.xlabel('Hora')
        plt.show()

def plot_requisicoes_por_tipo(resumo):
    total_marcas = sum(r['marcas'] for r in resumo)
    total_modelos = sum(r['modelos'] for r in resumo)
    total_anos = sum(r['anos'] for r in resumo)
    total_detalhes = total_anos  # assumindo 1 detalhe por ano

    plt.figure()
    plt.pie(
        [total_marcas, total_modelos, total_anos, total_detalhes],
        labels=['Marcas', 'Modelos', 'Anos', 'Detalhes'],
        autopct='%1.1f%%',
        startangle=140
    )
    plt.title('Distribuição de Requisições por Tipo')
    plt.show()

def plot_histograma_tempo(timestamps):
    if not timestamps:
        return

    ts_series = pd.Series(1, index=pd.to_datetime(timestamps))
    ts_minuto = ts_series.resample('5T').sum()  # Agregando a cada 5 minutos

    plt.figure(figsize=(12, 5))
    ts_minuto.plot(kind='line', marker='o')
    plt.title('Requisições a cada 5 minutos')
    plt.ylabel('Total')
    plt.xlabel('Tempo')

    # Reduz número de rótulos do eixo X
    ax = plt.gca()
    step = max(1, len(ts_minuto) // 10)
    ax.set_xticks(ax.get_xticks()[::step])
    plt.xticks(rotation=45, ha='right')

    plt.tight_layout()
    plt.show()

def plot_duracao_por_arquivo(resumo, arquivos):
    duracoes = []
    nomes = []

    for r, path in zip(resumo, arquivos):
        ts = r['timestamps']
        if len(ts) >= 2:
            duracao = (max(ts) - min(ts)).total_seconds() / 60  # em minutos
            duracoes.append(duracao)
            nomes.append(os.path.basename(path))

    if duracoes:
        plt.figure()
        plt.bar(nomes, duracoes)
        plt.xticks(rotation=45, ha='right')
        plt.ylabel('Duração (minutos)')
        plt.title('Duração Total por Execução')
        plt.tight_layout()
        plt.show()

if __name__ == "__main__":
    arquivos_log = listar_logs(LOG_DIR)
    print(f"📄 {len(arquivos_log)} arquivos encontrados.")

    resumo_logs = [parse_log_file(f) for f in arquivos_log]
    erros = parse_erros_file("erros_etl.log")

    plot_metrics(resumo_logs, erros)
    plot_requisicoes_por_tipo(resumo_logs)
    todos_ts = [ts for r in resumo_logs for ts in r['timestamps']]
    plot_histograma_tempo(todos_ts)
    plot_duracao_por_arquivo(resumo_logs, arquivos_log)
