export interface Car {
  id: string | number;
  name: string;
  brand?: string;
  type: string; // e.g., SUV, MPV, Sedan
  description: string;
  seats: number;
  transmission: string;
  price: number;
  status: 'Tersedia' | 'Disewa';
  imageUrl: string;
  tags: string[];
  baggage: number;
  fuel: string;
  stock?: number;
}

export const carsData: Car[] = [
  {
    id: "fortuner-gr",
    name: "Toyota Fortuner GR",
    type: "SUV",
    description: "SUV tangguh dengan fitur Gazoo Racing untuk performa maksimal di berbagai medan.",
    seats: 7,
    transmission: "Automatic",
    price: 1250000,
    status: "Tersedia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnp4o8mgCCRuhfzhG3jBZECer5QP6rsjtTa5ZNqLN2m1tM06EQBFdP2NPyBR_46DzioE24_-jcmVdSZNFbQdTP0SugFIr3hLxiXT4diAGYGV3uMrHCn5_CGNP_y1KHfB94kGLkYgkhwqnWowz8GZ2eaUaY9nzYGMp78Y1FtVyhN8hokq16S0_NldNoxsPMUpOSiU--P_ACEC-5e9_NlEK46GFx46p4b-6ocd4iIAgqelmEMQ6BHcJwWngnIuSXQHCe9VqZaD_zjpG8",
    tags: ["Diesel", "Sport", "SUV"],
    baggage: 4,
    fuel: "Diesel"
  },
  {
    id: "alphard",
    name: "Toyota Alphard",
    type: "MPV",
    description: "Nikmati kemewahan ruang kabin kelas eksekutif dengan kursi captain seat yang dirancang untuk kenyamanan VVIP.",
    seats: 7,
    transmission: "Automatic",
    price: 2800000,
    status: "Disewa",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWg8240Z6AIQ8KUiYAyYOvz19ex5G2iQB7a5znvaQpUI3_koHcq0BI0ndEb4JDgnBwieOQhKwzSJtyPxbMUZRm5vI6Mwr5GTSkCN13blAltocyr589x2XOuQLbrz_zSvkLIGbNcEn9lu0lCzOyg3cn_Bj_UTImNNMTqX4xcE-7sDlTBL6Op4waECim2uXNHrD6FG2fS-UoarAPHsq_iDQKbyOfEghkUetL81unfA9B8s_8K7UeIilLVOKabSi-Lx1nWqo0bQKP0Mc5",
    tags: ["Premium", "Executive", "Comfort"],
    baggage: 4,
    fuel: "Bensin"
  },
  {
    id: "pajero-sport",
    name: "Pajero Sport",
    type: "SUV",
    description: "Desain gagah dengan mesin bertenaga untuk menemani perjalanan jauh dengan nyaman.",
    seats: 7,
    transmission: "Manual/Matic",
    price: 1100000,
    status: "Tersedia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuABufUpV2kJKLSMMcQV0VvExWDCqkV80FFy0ledqkcL0hnhuduGAtkC6bX_h7NoOi1j0ARH5-RAt6IekcWgMcko7eGFXf_Xnt7ZgzJ2UXe0WEQ8WOjlURfhssMYXb4WGTQVt1aFWWy9dxTTCo_XUqFg4K-jgvWvTlSH39qF-7RHsec6iIIalVXSYgFDDpuC6mixugts5tecmPnCNAGNWBXDwSlgXDzAtWI1IOpogU-h-GIsTz_bRXrdwL2hfxC7WodIW6V1k01p5pR7",
    tags: ["Diesel", "Family", "Offroad"],
    baggage: 4,
    fuel: "Diesel"
  },
  {
    id: "civic-rs",
    name: "Honda Civic RS",
    type: "Sedan",
    description: "Sedan sporty dengan handling tajam dan fitur keselamatan Honda Sensing.",
    seats: 5,
    transmission: "Automatic",
    price: 1500000,
    status: "Tersedia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAynb2q1Y4bQpMeuFbkoNCDWQ3ZGC9EkDmVSdXosleEgwOpCeVAvjzt6V5ONKe6mz6eA8rD72RenGdHUFXU6DKP2clz3V7YCzw72k0aIgxc-kTu6LIubNy9HGEWnF_bE1lwiakfQx4rkB0AANjmsm67A1FxCuU0TULXV5oikgH9265KfvLegyeYFryX3aXCR1dfb_5fiYILvTM9ur8KMHozkFSFhSUIMf5-oqw1QioHCpLvBJmIx9QAT6sIHuShWemJJW6JvuWnRoIC",
    tags: ["Turbo", "Sport Sedan", "Comfort"],
    baggage: 2,
    fuel: "Bensin"
  },
  {
    id: "bmw-5-series",
    name: "BMW 5 Series",
    type: "Sedan",
    description: "Kombinasi sempurna antara performa mesin Jerman dan kenyamanan kabin super mewah.",
    seats: 5,
    transmission: "Automatic",
    price: 4500000,
    status: "Tersedia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaGtVJWUyZ1wbgiavnPHeV5t2m-KFgFkXOBy0HFPcWC8ycYKxAA9ivNT1xqPCN-Hiham_AGks20GQjx_eXGer35IoEnKrEmhqazRv6CMIetlnOCes_yFLPMLBw9D5Th-N0lnPh2pFUS-sUym3WNsVwpFb4DiPSWYv9EYkwOdwHeC9z0vDTcHEM7cZ-0TiATJswfpZ52geiRmK6bQBKkszdzhd0EdDHfMNCrizlJAA4Z3_0jMJONxFNYQcerhAoNtmwiVW7kUVheK1E",
    tags: ["Luxury", "Business", "Premium"],
    baggage: 3,
    fuel: "Bensin"
  },
  {
    id: "innova-zenix",
    name: "Innova Zenix Hybrid",
    type: "MPV",
    description: "MPV legendaris kini hadir dengan teknologi hybrid untuk efisiensi bahan bakar maksimal.",
    seats: 7,
    transmission: "Automatic",
    price: 950000,
    status: "Tersedia",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMmx-wjPeZuLb5e0-n5VdvlBFhQlDe9ehWO4rrWeMaKTiUvw343O_XFs7AXZxzuoLN8UELOIPcEs2RVJ_cWKBzdlgGhYmoo27QdcBaNhclklFKdd7X7eXluqqvCbH2-eZ9cWrzzc89bvD_tcqM5ttHkH4iFKz4uYCSDY0NVA397sMbFGHppGOSW0Np1Edf89L1Nb3y9h8_5zIXU8iDXOnDaZj_vgqTsKtfaryCqn5xCDs46G5Ad5COURq9bT3QnSRG6dzOTLJnj0Jn",
    tags: ["Hybrid", "Family MPV", "Eco-friendly"],
    baggage: 3,
    fuel: "Hybrid"
  }
];

export async function fetchCarsFromAPI(): Promise<Car[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${apiUrl}/api/cars`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from API');
    const data = await res.json();
    return data.map((car: any) => ({
      id: car.id,
      name: car.name,
      brand: car.brand || 'Lainnya',
      type: car.type,
      description: `Sewa mobil ${car.name} terbaik dengan pelayanan prima.`,
      seats: car.seats,
      transmission: car.transmission,
      price: car.price,
      status: (car.is_available === 1 || car.is_available === true) ? 'Tersedia' : 'Disewa',
      imageUrl: car.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDaGtVJWUyZ1wbgiavnPHeV5t2m-KFgFkXOBy0HFPcWC8ycYKxAA9ivNT1xqPCN-Hiham_AGks20GQjx_eXGer35IoEnKrEmhqazRv6CMIetlnOCes_yFLPMLBw9D5Th-N0lnPh2pFUS-sUym3WNsVwpFb4DiPSWYv9EYkwOdwHeC9z0vDTcHEM7cZ-0TiATJswfpZ52geiRmK6bQBKkszdzhd0EdDHfMNCrizlJAA4Z3_0jMJONxFNYQcerhAoNtmwiVW7kUVheK1E",
      tags: ['Premium', car.type],
      baggage: car.baggage,
      fuel: 'Bensin',
      stock: car.stock !== undefined ? car.stock : 10
    }));
  } catch (error) {
    console.error("Fetch cars error:", error);
    return [];
  }
}

export async function fetchCarByIdFromAPI(id: string | number): Promise<Car | undefined> {
  const cars = await fetchCarsFromAPI();
  return cars.find(c => c.id.toString() === id.toString());
}
