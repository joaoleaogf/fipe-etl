# FIPE ETL

**ETL completo** para extração, transformação e carga de dados da Tabela FIPE.  
Projeto construído em **Node.js** + **TypeScript**, com estrutura modularizada e suporte para execução em **Docker**.

---

## 📦 Estrutura do Projeto

/src
├── api.ts # Funções de extração de dados da API FIPE
├── db.ts # Simulação de inserção, salvando em arquivos
├── etl.ts # Orquestração completa do ETL
├── estimativa.ts # Cálculo automático de quantidade de requisições
├── logger.ts # Logger com estimativa de tempo e progresso
└── models/
└── api-models.ts # Modelos de dados FIPE

/output # Arquivos JSON gerados pelo ETL

yaml
Copy
Edit

---

## 🚀 Funcionalidades

✅ Extração completa dos dados da FIPE:  
- Referências  
- Marcas  
- Modelos  
- Anos  
- Detalhes  

✅ Cálculo automático de:  
- Total estimado de requisições  
- Estimativa de tempo restante  

✅ Logs com:  
- Progresso de execução  
- Tempo decorrido e estimado  
- Salvos automaticamente em `/output`

✅ Simulação de carga:  
- Dados salvos em arquivos `.json` para consulta e testes.  

✅ Pronto para execução via **Docker** e integração com **GitHub**.

---

## 🛠️ Tecnologias

- Node.js
- TypeScript
- Axios
- remove-accents
- PostgreSQL (simulado via arquivos)
- Docker / Docker Compose

---

## 🐳 Execução com Docker

```bash
docker-compose build
docker-compose up
```
➡️ Arquivos gerados em: ./output

📊 Logs de execução
Logs salvos automaticamente em:

```bash
/output/etl-log-<timestamp>.txt
```
Inclui:

Total de requisições feitas

Tempo médio por requisição

Estimativa de tempo restante

📁 Dados gerados

/output/referencia.json

/output/marca.json

/output/modelo.json

/output/ano.json

/output/veiculo.json

/output/detalhe_veiculo.json

⚙️ Como rodar localmente
```bash
npm install
npx tsc
node dist/etl.js
✅ Como iniciar o ETL
bash
Copy
Edit
node dist/etl.js
```
Ou via Docker:

```bash
docker-compose up
```
📝 Licença
MIT

