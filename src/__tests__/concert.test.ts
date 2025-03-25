import request from 'supertest';
import app from '../app';
import { concertTable } from '../db/schema';
import { testDb, createConcertTable } from './testDatabaseSetup';

describe('Concert API', () => {
    beforeAll(async () => {
      await createConcertTable();
    });
  
    beforeEach(async () => {
      await testDb.delete(concertTable).execute();

      await testDb.insert(concertTable).values([
        { title: 'Concert A', place: 'Place 1', concertDate: new Date(), totalSeats: 100, availableSeats: 90 },
        { title: 'Concert B', place: 'Place 2', concertDate: new Date(), totalSeats: 150, availableSeats: 120 },
        { title: 'Concert C', place: 'Place 3', concertDate: new Date(), totalSeats: 200, availableSeats: 180 },
        { title: 'Concert D', place: 'Place 4', concertDate: new Date(), totalSeats: 120, availableSeats: 100 },
      ]).execute();
    });
  
    afterAll(async () => {
        await testDb.delete(concertTable).execute();
    });
  
    it('should return all concerts when no limit query parameter is provided', async () => {
        const response = await request(app)
            .get('/concerts')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body.length).toBe(4);
    });

    it('should return a limited number of concerts when a valid limit query parameter is provided', async () => {
        const limit = 2;
        const response = await request(app)
            .get(`/concerts?limit=${limit}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body.length).toBe(limit);
    });
  });