// // Enum de tipos de veículos
// export type VehicleType = 'cars' | 'motorcycles' | 'trucks';

// // Autenticação
// export interface AuthHeaders {
//   'X-Subscription-Token': string;
// }

// // Referência da FIPE
// export interface Reference {
//   codigo: number;     // Código da referência, ex: 278
//   mes: string;       // Mês e ano, ex: "maio/2025"
// }

// // Marca de Veículo
// export interface VehicleBrand {
//   codigo: number;     // Código da marca, ex: 59
//   nome: string;       // Nome da marca, ex: "Chevrolet"
// }

// // Modelo de Veículo
// export interface VehicleModel {
//   codigo: number;     // Código do modelo, ex: 5940
//   nome: string;       // Nome do modelo, ex: "Onix 1.0"
// }

// // Ano de Modelo
// export interface VehicleYear {
//   codigo: string;     // Código do ano, ex: "2014-3"
//   nome: string;       // Descrição do ano, ex: "2014 Gasolina"
// }

// // Detalhes do Veículo
// export interface VehicleDetail {
//   valor: string;              // Valor em reais, ex: "R$ 50.000,00"
//   marca: string;              // Marca do veículo
//   modelo: string;             // Modelo do veículo
//   anoModelo: number;          // Ano do modelo
//   combustivel: string;       // Tipo de combustível, ex: "Gasolina"
//   codigoFipe: string;        // Código FIPE, ex: "004278-1"
//   mesReferencia: string;     // Mês de referência, ex: "maio/2025"
//   tipoVeiculo: number;       // Tipo do veículo: 1 - Carro, 2 - Moto, etc.
//   siglaCombustivel: string;  // Sigla do combustível, ex: "G"
// }


// Enum de tipos de veículos
export type VehicleType = 'cars' | 'motorcycles' | 'trucks';

// Autenticação
export interface AuthHeaders {
  'X-Subscription-Token': string;
}

// Referência da FIPE
export interface Reference {
  code: string;     // Código da referência, ex: "278"
  name: string;     // Mês e ano, ex: "maio/2025"
}

// Marca de Veículo
export interface VehicleBrand {
  code: string;     // Código da marca, ex: "59"
  name: string;     // Nome da marca, ex: "Chevrolet"
}

// Modelo de Veículo
export interface VehicleModel {
  code: string;     // Código do modelo, ex: "5940"
  name: string;     // Nome do modelo, ex: "Onix 1.0"
}

// Ano de Modelo
export interface VehicleYear {
  code: string;     // Código do ano, ex: "2014-3"
  name: string;     // Descrição do ano, ex: "2014 Gasolina"
}

// Detalhes do Veículo
export interface VehicleDetail {
  price: string;              // Valor em reais, ex: "R$ 50.000,00"
  brand: string;              // Marca do veículo
  model: string;              // Modelo do veículo
  modelYear: number;          // Ano do modelo
  fuel: string;               // Tipo de combustível, ex: "Gasolina"
  codeFipe: string;           // Código FIPE, ex: "004278-1"
  referenceMonth: string;     // Mês de referência, ex: "maio/2025"
  vehicleType: number;        // Tipo do veículo: 1 - Carro, 2 - Moto, etc.
  fuelAcronym: string;        // Sigla do combustível, ex: "G"
}
