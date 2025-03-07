import express, { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { concertTable } from '../db/schema'
import { db } from '../app'

const router = express.Router();

router.get('/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.id));
    if (concert.length > 0) {
        res.json(concert[0]);
    }
});

router.get('/concerts', async function(req: Request, res: Response, next: NextFunction) {
    const concerts = await db.select().from(concertTable).limit(Number.parseInt(req.params.limit));
    if (concerts.length > 0) {
        res.json(concerts);
    }
});

module.exports = router;