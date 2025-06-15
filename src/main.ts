import { ETLProcessor } from './etl';
const { Client } = require('pg');

const etl = new ETLProcessor();

etl.run()
  .then(() => {
    console.log('✅ ETL finalizado com sucesso.');
    process.exit(0); // encerra o processo corretamente
  })
  .catch((err) => {
    console.error('❌ Falha na execução do ETL:', err);
    process.exit(1); // encerra com erro
  });


// const client = new Client({
//   host: process.env.PGHOST || '172.17.80.1',
//   port: parseInt(process.env.PGPORT || '5434', 10),
//   user: process.env.PGUSER || 'postgres',
//   password: process.env.PGPASSWORD || 'postgres',
//   database: process.env.PGDATABASE || 'fipe_etl',
// });

// client.connect()
//   .then(() => {
//     console.log('✅ Conectado com sucesso!');
//     return client.end();
//   })
//   .catch((err:any) => {
//     console.error('❌ Falha ao conectar:', err);
//   });