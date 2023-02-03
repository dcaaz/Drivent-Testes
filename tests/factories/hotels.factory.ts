import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
    return prisma.hotel.create({
        data: {
            name: faker.company.companyName() + "Hotel",
            image: faker.image.imageUrl()
        }
    })
}