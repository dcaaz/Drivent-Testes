import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from '../factories';
import { createHotel } from '../factories/hotels.factory';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('get /hotels', () => {
    it('Should respond with status 401 if no token', async () => {
        const result = await server.get('/hotels');
        expect(result.status).toBe(401)
    } )
})