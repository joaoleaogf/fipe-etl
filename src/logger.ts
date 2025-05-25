import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private startTime: number;
  private totalRequisicoes: number = 0;
  private totalEstimadoRequisicoes: number = 0;
  private logFile: string;

  constructor() {
    this.startTime = Date.now();
    const logDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logFile = path.resolve(logDir, `etl-log-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);
  }

  setTotalEstimado(total: number) {
    this.totalEstimadoRequisicoes = total;
  }

  incrementRequisicao() {
    this.totalRequisicoes++;
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}\n`;
    console.log(fullMessage.trim());
    fs.appendFileSync(this.logFile, fullMessage);
  }

  logProgresso() {
    const tempoDecorrido = (Date.now() - this.startTime) / 1000;
    const mediaPorRequisicao = this.totalRequisicoes ? tempoDecorrido / this.totalRequisicoes : 0;
    const restantes = this.totalEstimadoRequisicoes - this.totalRequisicoes;
    const tempoRestante = mediaPorRequisicao * restantes;

    this.log(`Progresso: ${this.totalRequisicoes}/${this.totalEstimadoRequisicoes} requisições.`);
    this.log(`Tempo decorrido: ${tempoDecorrido.toFixed(2)}s, média: ${mediaPorRequisicao.toFixed(2)}s/req.`);
    this.log(`Estimativa: ~${tempoRestante.toFixed(2)}s restantes (${(tempoRestante/60).toFixed(2)} min).`);
  }
}
