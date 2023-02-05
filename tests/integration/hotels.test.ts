import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import supertest from 'supertest';
import httpStatus from 'http-status';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from '../factories';
import { createHotel, createHotelId } from '../factories/hotels.factory';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('get /hotels', () => {

  it('Should respond with status 401 if NO token', async () => {
    const result = await server.get('/hotels');
    expect(result.status).toBe(401)
  })

  it('Should respond with status 401 if INVALIDE token', async () => {
    const result = await server.get('/hotels').set("Authorization", "Bearer XXXX");
    expect(result.status).toBe(401)
  })

})

describe('When token is valid', () => {

  it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
    const token = await generateValidToken();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('Should respond with status 404 when user doesnt have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 401 when ticket status isn't paid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });


  it('should respond with status 200 with hotels data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);
  });

});

describe('/:hotelId', () => {
  it("should respond with status 404 when hotel doesn't exits", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 with specific hotel data and rooms', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotelWithRooms = await createHotelId();

    const response = await server.get('/hotels/' + hotelWithRooms.id).set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);

  })

})
