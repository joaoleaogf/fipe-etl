import axios from 'axios';
import { Reference, VehicleBrand, VehicleModel, VehicleYear } from './models/api-models';

export async function extrairReferencias(): Promise<Reference[]> {
  const url = 'https://fipe.parallelum.com.br/api/v2/references';
  const res = await axios.get(url);
  return res.data;
}

export async function extrairMarcas(): Promise<VehicleBrand[]> {
  const url = 'https://fipe.parallelum.com.br/api/v2/cars/brands';
  const res = await axios.get(url);
  return res.data;
}

export async function extrairModelos(brandCode: number): Promise<VehicleModel[]> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models`;
  const res = await axios.get(url);
  return res.data.modelos;
}

export async function extrairAnos(brandCode: number, modelCode: number): Promise<VehicleYear[]> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models/${modelCode}/years`;
  const res = await axios.get(url);
  return res.data;
}

export async function extrairDetalhe(brandCode: number, modelCode: number, yearCode: string): Promise<any> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models/${modelCode}/years/${yearCode}`;
  const res = await axios.get(url);
  return res.data;
}
