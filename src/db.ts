// import { Pool } from 'pg';
// import { VehicleBrand, VehicleModel, VehicleYear, Reference } from './models/api-models';

// export const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'fipe',
//   password: 'postgres',
//   port: 5432,
// });

// export async function inserirReferencia(ref: Reference) {
//   await pool.query(`INSERT INTO referencia (codigo, mes) VALUES ($1, $2) ON CONFLICT DO NOTHING;`, [ref.codigo, ref.mes]);
// }

// export async function inserirMarca(marca: VehicleBrand) {
//   await pool.query(`INSERT INTO marca (codigoMa, nome) VALUES ($1, $2) ON CONFLICT DO NOTHING;`, [marca.codigo, marca.nome]);
// }

// export async function inserirModelo(modelo: VehicleModel, modeloMa: number) {
//   await pool.query(`INSERT INTO modelo (codigoMo, modeloMa, nome, codigoFipe) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;`, [modelo.codigo, modeloMa, modelo.nome, modelo.codigo.toString()]);
// }

// export async function inserirAno(ano: VehicleYear, codigoMo: number) {
//   await pool.query(`INSERT INTO ano (codigoAn, codigoMo, periodo) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`, [ano.codigo, codigoMo, parseInt(ano.codigo)]);
// }

// export async function inserirVeiculo(codigoMo: number, combustivel: string, tipoVeiculo: number, preco: number) {
//   await pool.query(`INSERT INTO veiculo (codigoMo, combustivel, tipoVeiculo, preco) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;`, [codigoMo, combustivel, tipoVeiculo, preco]);
// }

// export async function inserirDetalheVeiculo(dado: any) {
//   await pool.query(`INSERT INTO detalhe_veiculo (marca, modelo, anoModelo, combustivel, siglaCombustivel, codigoFipe, valor, tipoVeiculo, mesReferencia) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING;`, [dado.marca, dado.modelo, dado.anoModelo, dado.combustivel, dado.siglaCombustivel, dado.codigoFipe, dado.valor, dado.tipoVeiculo, dado.mesReferencia]);
// }

// Estrutura sugerida da tabela `fipe_rejeitados`: 
// (marca TEXT, modelo TEXT, anoModelo INT, combustivel TEXT, siglaCombustivel TEXT, codigoFipe TEXT, valor NUMERIC, tipoVeiculo INT, mesReferencia TEXT, motivo TEXT)
 
// export async function inserirRejeitado(dado: any, motivo: string = 'dados inconsistentes') {
//   await pool.query(
//     `INSERT INTO fipe_rejeitados (marca, modelo, anoModelo, combustivel, siglaCombustivel, codigoFipe, valor, tipoVeiculo, mesReferencia, motivo)
//      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
//     [dado.marca, dado.modelo, dado.anoModelo, dado.combustivel, dado.siglaCombustivel, dado.codigoFipe, dado.valor, dado.tipoVeiculo, dado.mesReferencia, motivo]
//   );
// }


import * as fs from 'fs';
import * as path from 'path';

const outputDir = path.resolve(__dirname, '../output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function salvarEmArquivo(nome: string, dado: any) {
  const file = path.resolve(outputDir, `${nome}.json`);
  let conteudo = [];

  if (fs.existsSync(file)) {
    const atual = fs.readFileSync(file, 'utf-8');
    conteudo = JSON.parse(atual);
  }

  conteudo.push(dado);
  fs.writeFileSync(file, JSON.stringify(conteudo, null, 2), 'utf-8');
}

export const inserirReferencia = (ref: any) => salvarEmArquivo('referencia', ref);
export const inserirMarca = (marca: any) => salvarEmArquivo('marca', marca);
export const inserirModelo = (modelo: any) => salvarEmArquivo('modelo', modelo);
export const inserirAno = (ano: any) => salvarEmArquivo('ano', ano);
export const inserirVeiculo = (veiculo: any) => salvarEmArquivo('veiculo', veiculo);
export const inserirDetalheVeiculo = (detalhe: any) => salvarEmArquivo('detalhe_veiculo', detalhe);

// ✅ NOVA FUNÇÃO: inserir dados rejeitados
export const inserirRejeitado = (dado: any) => salvarEmArquivo('fipe_rejeitados', dado);
