import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
//import hotel repository
import ticketRepository from '@/repositories/ticket-repository';

export async function findALL(userId: number) {
  const enrollment = await enrollmentRepository.findUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if(ticket.status !== "PAID" || !ticket.TicketType.includesHotel){
    throw unauthorizedError()
  }

 // return await hotelRepository.findManyHotels();
}

const hotelService = {
    findALL
}
