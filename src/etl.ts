import { Logger } from './logger';
import {
  extrairMarcas,
  extrairModelos,
  extrairAnos,
  extrairDetalhe
} from './api';
import {
  inserirMarca,
  inserirModelo,
  inserirAno,
  inserirVeiculo,
  inserirRejeitado
} from './db';
import { VehicleDetail } from './models/api-models';
import * as removeAccents from 'remove-accents';
import * as fs from 'fs';

type Progresso = {
  marcaAtual?: number;
  modeloAtual?: number;
  anoAtual?: string;
};

export class ETLProcessor {
  private logger = new Logger();
  private progressoPath = 'progresso.json';
  private progresso: Progresso = {};
  private tempoEntreRequisicoesMs = 150;

  async run() {
    try {
      this.logger.log('Iniciando ETL completo...');
      this.carregarProgresso();
      await this.processarMarcas();
      this.logger.log('✅ ETL completo.');
    } catch (error) {
      this.logErroFatal('Erro crítico no ETL', error);
      throw error;
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private carregarProgresso() {
    if (fs.existsSync(this.progressoPath)) {
      const conteudo = fs.readFileSync(this.progressoPath, 'utf8');
      this.progresso = JSON.parse(conteudo);
      this.logger.log(`🔁 Progresso carregado: ${JSON.stringify(this.progresso)}`);
    }
  }

  private salvarProgresso() {
    fs.writeFileSync(this.progressoPath, JSON.stringify(this.progresso, null, 2));
  }

  private async processarMarcas() {
    const rawMarcas = await extrairMarcas();
    this.logger.log(`Total bruto de marcas: ${rawMarcas.length}`);

    const marcas = rawMarcas
      .map((m: any) => ({ codigo: parseInt(m.code, 10), nome: m.name }))
      .filter((m) => typeof m.codigo === 'number' && !!m.nome?.trim())
      .sort((a, b) => a.codigo - b.codigo);

    this.logger.log(`Total de marcas válidas: ${marcas.length}`);

    for (const marca of marcas) {
      if (this.progresso.marcaAtual && marca.codigo < this.progresso.marcaAtual) continue;

      if (!this.progresso.marcaAtual || marca.codigo !== this.progresso.marcaAtual || !this.progresso.modeloAtual) {
        this.progresso.marcaAtual = marca.codigo;
        this.progresso.modeloAtual = undefined;
        this.progresso.anoAtual = undefined;
        this.salvarProgresso();
      }

      this.logger.log(`📌 Processando marca: ${marca.codigo} - ${marca.nome}`);
      await inserirMarca({ codigo: marca.codigo, nome: marca.nome });
      this.logger.incrementRequisicao();
      this.logger.logProgresso();
      await this.delay(this.tempoEntreRequisicoesMs);
      await this.processarModelos(marca.codigo);
    }
  }

  private async processarModelos(codigoMarca: number) {
    const modelosRaw = await extrairModelos(codigoMarca);
    this.logger.setTotalEstimado(this.logger['totalEstimadoRequisicoes'] + modelosRaw.length);

    const modelos = modelosRaw
      .map((m: any) => ({ codigo: parseInt(m.code, 10), nome: m.name }))
      .filter((m) => typeof m.codigo === 'number' && !!m.nome?.trim())
      .sort((a, b) => a.codigo - b.codigo);

    for (const modelo of modelos) {
      if (this.progresso.modeloAtual && modelo.codigo < this.progresso.modeloAtual) continue;

      if (!this.progresso.modeloAtual || modelo.codigo !== this.progresso.modeloAtual || !this.progresso.anoAtual) {
        this.progresso.modeloAtual = modelo.codigo;
        this.progresso.anoAtual = undefined;
        this.salvarProgresso();
      }

      this.logger.log(`🔍 Processando modelo: ${modelo.codigo} - ${modelo.nome}`);
      await inserirModelo({ codigo: modelo.codigo, nome: modelo.nome, marcaCodigo: codigoMarca });
      this.logger.incrementRequisicao();
      this.logger.logProgresso();
      await this.delay(this.tempoEntreRequisicoesMs);
      await this.processarAnos(codigoMarca, modelo.codigo);
    }
  }

  private async processarAnos(codigoMarca: number, codigoModelo: number) {
    const anosRaw = await extrairAnos(codigoMarca, codigoModelo);
    this.logger.setTotalEstimado(this.logger['totalEstimadoRequisicoes'] + anosRaw.length);

    const anos = anosRaw
      .map((a: any) => ({ codigo: a.code, nome: a.name }))
      .filter((a) => typeof a.codigo === 'string' && !!a.nome?.trim())
      .sort((a, b) => a.codigo.localeCompare(b.codigo));

    for (const ano of anos) {
      if (this.progresso.anoAtual && ano.codigo < this.progresso.anoAtual) continue;

      this.progresso.anoAtual = ano.codigo;
      this.salvarProgresso();

      this.logger.log(`🕓 Processando ano: ${ano.codigo} (${ano.nome})`);
      await inserirAno({ codigo: ano.codigo, modeloCodigo: codigoModelo, periodo: parseInt(ano.codigo.split('-')[0], 10) });
      this.logger.incrementRequisicao();
      this.logger.logProgresso();
      await this.delay(this.tempoEntreRequisicoesMs);
      await this.processarDetalhe(codigoMarca, codigoModelo, ano.codigo);
    }
  }

  private async processarDetalhe(codigoMarca: number, codigoModelo: number, codigoAno: string) {
    const detalheRaw = await extrairDetalhe(codigoMarca, codigoModelo, codigoAno);
    this.logger.log(`📦 Detalhe extraído: ${JSON.stringify(detalheRaw)}`);

    const detalhe: VehicleDetail = {
      price: detalheRaw.price,
      brand: detalheRaw.brand,
      model: detalheRaw.model,
      modelYear: detalheRaw.modelYear,
      fuel: detalheRaw.fuel,
      codeFipe: detalheRaw.codeFipe,
      referenceMonth: detalheRaw.referenceMonth,
      vehicleType: detalheRaw.vehicleType,
      fuelAcronym: detalheRaw.fuelAcronym
    };

    const dadoLimpo = this.limparDetalhe(detalhe);

    if (this.temCamposInvalidos(dadoLimpo)) {
      await this.registrarRejeitado('Campos faltantes ou inválidos', dadoLimpo);
      return;
    }

    if (
      dadoLimpo.codigoFipe &&
      dadoLimpo.valor > 0 &&
      dadoLimpo.tipoVeiculo !== null &&
      [1, 2, 3].includes(dadoLimpo.tipoVeiculo) &&
      /^\d{4}-\d{2}$/.test(dadoLimpo.mesReferencia)
    ) {
      await inserirVeiculo({
        codigo: Date.now(),
        modeloCodigo: codigoModelo,
        combustivel: dadoLimpo.combustivel,
        tipoVeiculo: dadoLimpo.tipoVeiculo,
        preco: dadoLimpo.valor,
        siglaCombustivel: dadoLimpo.siglaCombustivel,
        mesReferencia: dadoLimpo.mesReferencia
      });
    } else {
      await this.registrarRejeitado('Dados inconsistentes', dadoLimpo);
    }

    this.logger.incrementRequisicao();
    this.logger.logProgresso();
    await this.delay(this.tempoEntreRequisicoesMs);
  }

  private limparDetalhe(dado: VehicleDetail) {
    const marca = removeAccents(dado.brand.trim());
    const modelo = removeAccents(dado.model.trim());
    const combustivel = removeAccents(dado.fuel.trim());
    const siglaCombustivel = removeAccents(dado.fuelAcronym.trim());

    const valorNumerico = parseFloat(
      dado.price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    );

    const tipoValido = [1, 2, 3].includes(dado.vehicleType) ? dado.vehicleType : null;

    const partesMes = dado.referenceMonth.split(/ de |\/| /);
    const ano = partesMes[1];
    const mes = this.mesParaNumero(partesMes[0]);
    const mesReferenciaFormatada = `${ano}-${String(mes).padStart(2, '0')}`;

    const codigoFipeValido = /^\d{6}-\d$/.test(dado.codeFipe) ? dado.codeFipe : null;

    return {
      marca,
      modelo,
      anoModelo: dado.modelYear,
      combustivel,
      siglaCombustivel,
      codigoFipe: codigoFipeValido,
      valor: valorNumerico,
      tipoVeiculo: tipoValido,
      mesReferencia: mesReferenciaFormatada
    };
  }

  private mesParaNumero(mes: string): number {
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const index = meses.findIndex(m => m.toLowerCase() === mes.toLowerCase());
    return index >= 0 ? index + 1 : 0;
  }

  private temCamposInvalidos(dado: Record<string, any>): boolean {
    return Object.entries(dado).some(([_, v]) => v === null || v === undefined || v === '');
  }

  private async registrarRejeitado(mensagem: string, dado: any) {
    this.logErro(mensagem, dado);
    await inserirRejeitado(dado);
    this.logger.incrementRequisicao();
    this.logger.logProgresso();
  }

  private logErro(mensagem: string, dado: any) {
    const logMsg = `${new Date().toISOString()} - ${mensagem} - Dado: ${JSON.stringify(dado)}\n`;
    fs.appendFileSync('erros_etl.log', logMsg);
  }

  private logErroFatal(mensagem: string, erro: any) {
    const msg = `${new Date().toISOString()} - ${mensagem}\nErro: ${erro.message || erro}\n\n`;
    fs.appendFileSync('erros_etl.log', msg);
    this.logger.log(`FATAL: ${mensagem}`);
  }
}
