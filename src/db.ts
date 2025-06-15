import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.PGHOST || '172.17.80.1',
  port: parseInt(process.env.PGPORT || '5434', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'fipe_etl',
});

export interface MarcaDB {
  codigo: number;
  nome: string;
}
export async function inserirMarca(marca: MarcaDB) {
  await pool.query(
    `INSERT INTO marca (codigoMa, nome) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [marca.codigo, marca.nome]
  );
}

export interface ModeloDB {
  codigo: number;
  nome: string;
  marcaCodigo: number;
}

export async function inserirModelo(modelo: ModeloDB) {
  await pool.query(
    `INSERT INTO modelo (codigoMo, nome, modeloMa)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [modelo.codigo, modelo.nome, modelo.marcaCodigo]
  );
}

export interface AnoDB {
  codigo: string;
  modeloCodigo: number;
  periodo: number;
}

export async function inserirAno(ano: AnoDB) {
  await pool.query(
    `INSERT INTO ano (codigoAn, codigoMo, periodo)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [ano.codigo, ano.modeloCodigo, ano.periodo]
  );
}

export interface VeiculoDB {
  codigo: number;
  modeloCodigo: number;
  combustivel: string;
  tipoVeiculo: number;
  preco: number;
  siglaCombustivel: string;
  mesReferencia: string;
}

export async function inserirVeiculo(veiculo: VeiculoDB) {
  await pool.query(
    `INSERT INTO veiculo (codigoVe, codigoMo, combustivel, tipoVeiculo, preco, siglaCombustivel, mesReferencia)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT DO NOTHING`,
    [
      veiculo.codigo,
      veiculo.modeloCodigo,
      veiculo.combustivel,
      veiculo.tipoVeiculo,
      veiculo.preco,
      veiculo.siglaCombustivel,
      veiculo.mesReferencia
    ]
  );
}

export async function inserirRejeitado(dado: any) {
  await pool.query(
    `INSERT INTO rejeitados (dados) VALUES ($1)`,
    [JSON.stringify(dado)]
  );
}
