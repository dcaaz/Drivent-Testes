import { prisma } from "@/config";

export async function findManyHotels() {
    return await prisma.hotel.findMany();   
}

const hotelRepository = {
    findManyHotels
}

export default hotelRepository;