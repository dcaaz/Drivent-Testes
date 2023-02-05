import { prisma } from "@/config";

export async function findManyHotels() {
  return await prisma.hotel.findMany();
}

export async function findUniqueHotel(id: number) {
  return await prisma.hotel.findUnique({
    where: {
      id
    },
    include: {
      Rooms: true
    },
  });
}

const hotelRepository = {
  findManyHotels,
  findUniqueHotel
};

export default hotelRepository;
