import { Logger } from './logger';
import { extrairReferencias, extrairMarcas, extrairModelos, extrairAnos, extrairDetalhe } from './api';
import { inserirReferencia, inserirMarca, inserirModelo, inserirAno, inserirVeiculo, inserirDetalheVeiculo } from './db';
import { VehicleDetail } from './models/api-models';
import removeAccents from 'remove-accents';

const logger = new Logger();


export async function estimarTotalRequisicoes(logger: Logger): Promise<number> {
  let total = 1 + 1;  // 1 (referências) + 1 (marcas)
  logger.log('Estimando total de requisições...');

  const marcas = await extrairMarcas();
  logger.log(`Total de marcas encontradas: ${marcas.length}`);
  total += marcas.length;  // Para modelos de cada marca

  let totalModelos = 0;
  let totalAnos = 0;

  for (const marca of marcas) {
    const modelos = await extrairModelos(marca.codigo);
    totalModelos += modelos.length;
    total += modelos.length;  // Para anos de cada modelo

    for (const modelo of modelos) {
      const anos = await extrairAnos(marca.codigo, modelo.codigo);
      totalAnos += anos.length;
      total += anos.length;  // Para detalhes de cada ano
    }
  }

  logger.log(`Total de modelos encontrados: ${totalModelos}`);
  logger.log(`Total de anos encontrados: ${totalAnos}`);
  logger.log(`Total estimado de requisições: ${total}`);

  return total;
}

function mesParaNumero(mes: string): number {
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const index = meses.findIndex(m => m.toLowerCase() === mes.toLowerCase());
  return index >= 0 ? index + 1 : 0;
}

function limparDetalhe(dado: VehicleDetail): any {
  const marca = removeAccents(dado.marca.trim());
  const modelo = removeAccents(dado.modelo.trim());
  const combustivel = removeAccents(dado.combustivel.trim());
  const siglaCombustivel = removeAccents(dado.siglaCombustivel.trim());

  const valorNumerico = parseFloat(dado.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  const tipoValido = [1, 2, 3].includes(dado.tipoVeiculo) ? dado.tipoVeiculo : null;

  const partesMes = dado.mesReferencia.split(/ de |\/| /);
  const mesReferenciaFormatada = `${partesMes[1]}-${String(mesParaNumero(partesMes[0])).padStart(2, '0')}`;

  return { marca, modelo, anoModelo: dado.anoModelo, combustivel, siglaCombustivel, codigoFipe: dado.codigoFipe, valor: valorNumerico, tipoVeiculo: tipoValido, mesReferencia: mesReferenciaFormatada };
}

async function executarETLCompleto() {
  logger.log('Iniciando ETL completo (modo arquivo).');

  const referencias = await extrairReferencias();
  logger.setTotalEstimado(referencias.length);
  
  for (const ref of referencias) {
    await inserirReferencia(ref);
    logger.incrementRequisicao();
    logger.logProgresso();
  }

  const marcas = await extrairMarcas();
  logger.setTotalEstimado(logger['totalEstimadoRequisicoes'] + marcas.length);

  for (const marca of marcas) {
    await inserirMarca(marca);
    logger.incrementRequisicao();
    logger.logProgresso();

    const modelos = await extrairModelos(marca.codigo);
    logger.setTotalEstimado(logger['totalEstimadoRequisicoes'] + modelos.length);

    for (const modelo of modelos) {
      await inserirModelo({ ...modelo, modeloMa: marca.codigo });
      logger.incrementRequisicao();
      logger.logProgresso();

      const anos = await extrairAnos(marca.codigo, modelo.codigo);
      logger.setTotalEstimado(logger['totalEstimadoRequisicoes'] + anos.length);

      for (const ano of anos) {
        await inserirAno({ ...ano, codigoMo: modelo.codigo });
        logger.incrementRequisicao();
        logger.logProgresso();

        const detalheRaw = await extrairDetalhe(marca.codigo, modelo.codigo, ano.codigo);
        const detalhe: VehicleDetail = {
          valor: detalheRaw.price,
          marca: detalheRaw.brand,
          modelo: detalheRaw.model,
          anoModelo: detalheRaw.modelYear,
          combustivel: detalheRaw.fuel,
          codigoFipe: detalheRaw.codeFipe,
          mesReferencia: detalheRaw.referenceMonth,
          tipoVeiculo: detalheRaw.vehicleType,
          siglaCombustivel: detalheRaw.fuelAcronym
        };

        const dadoLimpo = limparDetalhe(detalhe);
        await inserirVeiculo({ codigoMo: modelo.codigo, combustivel: dadoLimpo.combustivel, tipoVeiculo: dadoLimpo.tipoVeiculo, preco: dadoLimpo.valor });
        await inserirDetalheVeiculo(dadoLimpo);

        logger.incrementRequisicao();
        logger.logProgresso();
      }
    }
  }

  logger.log('ETL completo (modo arquivo).');
}



async function main() {
  const totalEstimado = await estimarTotalRequisicoes(logger);
  logger.setTotalEstimado(totalEstimado);

  // executarETLCompleto().catch(e => logger.log(`Erro no ETL: ${e}`));
}