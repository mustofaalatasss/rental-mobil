import KatalogClient from './KatalogClient';
import { fetchCarsFromAPI } from '@/lib/data';

export const metadata = {
  title: 'Katalog Armada | Amar Rental Mobil',
  description: 'Pilih armada terbaik dari Amar Rental Mobil untuk perjalanan Anda di Jakarta dan sekitarnya.',
};

export default async function Katalog() {
  const initialCars = await fetchCarsFromAPI();
  
  return <KatalogClient initialCars={initialCars} />;
}
