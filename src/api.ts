import axios from 'axios';
import { VehicleBrand, VehicleModel, VehicleYear } from './models/api-models';

const API_KEYS = {
  "joao": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxOTA3YzFlYS1hODIyLTRkNTEtYTI5MC02OWUyZThhZjYzZTgiLCJlbWFpbCI6ImpvYW9sZWFvZ2ZAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjA3MjkxfQ.7EWUdJhgFEGyL08xQ6-YRw8grIVfPqiDHMowbPlen6A",
  "rafa": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EwNTc4Mi02ZjNhLTRhOWYtOTNjYi0zZjliNGJjZTFmZjAiLCJlbWFpbCI6Im1vbnRlaXJvLmMucmFmYWVsbEBnbWFpbC5jb20iLCJpYXQiOjE3NDk4NDY4MzJ9.YZTPQws3TJPCO6JteAnvoa8ugWz-ukgk3GIWoTMbSvw",
  "muriloves": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZDQ0OWRjOS0wNzdhLTQ5NzktODY3Mi1iYWU0YzMzYmFjNTQiLCJlbWFpbCI6Im11cmlsb3phaW5hQGdtYWlsLmNvbSIsImlhdCI6MTc0OTg1OTY3NX0.cGb6PzzemWhJb9B05CjsEc_3jkhZlnF13snpkW6lh90",
  "bryan": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMGUxYmMzMy05MjQ0LTRiM2YtODc4OS0wZmEyNmZjMGU4NTUiLCJlbWFpbCI6ImJyeXNuLm1zQGdtYWlsLmNvbSIsImlhdCI6MTc0OTg1MzQyN30.l95nLifWsak2ZpmKzPYHwM75Sy33r7QTGATZ1WQBeh4",
  "eu2": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzU1NTU1MS1lMDdhLTRjOTQtOWNjNi0xOGZkOTY3Mjc0ZjIiLCJlbWFpbCI6ImpvYW8ubGVhb0BkZG14LmNvbS5iciIsImlhdCI6MTc0OTkwODExNX0.JOWHiY5Kg9JH0ZcBGSp-8zvwTVXIMYm6_9TCOXKCa60",
  "eu3": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZTBhZTFiMi1jNjNkLTQ1ZTYtODI3Yi0yMmQ0NDI1ZjdiMGUiLCJlbWFpbCI6ImxhdGV4ZWRpdG9yc21hY0BnbWFpbC5jb20iLCJpYXQiOjE3NDk5MDk0Nzh9.6Nd1z7gDJV8Am9VeksK155PJTX2zNeVzIaBUf0sMdp4",
  "murilo2": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NmI5NjcwNC1kODJkLTQwZmQtOGZkYi04MzRkMDViODgyNmYiLCJlbWFpbCI6Imd1c3Rhdm8udG90dGkxNEBnbWFpbC5jb20iLCJpYXQiOjE3NDk5MDkyNjB9.Wb48-6jUawLLfqEc4-ttRuHh45vrQYazv675cyW6atM",
  "bryan2": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNzU0ZGU2NS1hMWZiLTRkNjYtOWY2ZS1jYTg2YzRlMzdhZjAiLCJlbWFpbCI6Im1hdGhldXMubGltYUB1bmlmZWkuZWR1LmJyIiwiaWF0IjoxNzQ5OTExMzAzfQ.UbVo7Oj3BgB-DHnXX9Wi8TE6R-8rRWviTSMf3v7IRII",
  "bryan3": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNzA5ZmU2NC0wNWI0LTRmYzUtYjU4My1mMzBlYzk1YTA5NTAiLCJlbWFpbCI6ImdhYnJpZWxzaWx2YS5zdGtAZ21haWwuY29tIiwiaWF0IjoxNzQ5OTExNzIzfQ.JyJVNxjm12DhFQ79dPUwnm0JwWLdfQZbqT2GYFqkNJY",
  "bryan4": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZjVhNGE4OC1hNDE2LTQyNWQtYjkxNy1hZTczNTVjZTBjYTMiLCJlbWFpbCI6InRpYWdvdmlsZWxhMDE5QGdtYWlsLmNvbSIsImlhdCI6MTc0OTkxNDE3M30.gIAHa_y9YCffmo5LIne_XRT8to9p5mOa_Fejepfoy7o"
};

const axiosConfig = {
  headers: {
    "X-Subscription-Token": API_KEYS["joao"]
  }
};

export async function extrairMarcas(): Promise<VehicleBrand[]> {
  const url = 'https://fipe.parallelum.com.br/api/v2/cars/brands';
  const res = await axios.get(url, axiosConfig);
  return res.data;
}

export async function extrairModelos(brandCode: number): Promise<VehicleModel[]> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models`;
  const res = await axios.get(url, axiosConfig);
  return res.data;
}

export async function extrairAnos(brandCode: number, modelCode: number): Promise<VehicleYear[]> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models/${modelCode}/years`;
  const res = await axios.get(url, axiosConfig);
  return res.data;
}

export async function extrairDetalhe(brandCode: number, modelCode: number, yearCode: string): Promise<any> {
  const url = `https://fipe.parallelum.com.br/api/v2/cars/brands/${brandCode}/models/${modelCode}/years/${yearCode}`;
  const res = await axios.get(url, axiosConfig);
  return res.data;
}
