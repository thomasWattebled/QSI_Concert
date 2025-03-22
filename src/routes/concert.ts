import express, { Request, Response, NextFunction } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { concertTable } from '../db/schema'
import { db } from '../app'

const router = express.Router();

router.get('/concerts', async function(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.limit === "string") {
        const concerts = await db.select().from(concertTable).limit(Number.parseInt(req.params.limit));
        res.json(concerts);
    } else {
        const concerts = await db.select().from(concertTable);
        res.json(concerts);
    }
});

router.get('/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.concertId));
        if (concert.length > 0) {
            res.json(concert[0]);
        } else {
            res.status(404).json({
                error: 'NotFound',
                message: `Concert with ID '${req.params.concertId}' not found.`,
                details: { concertId: req.params.concertId },
            });
        }
    } catch (error: any) {
        console.log(error);
        if (error.code === "22P02") {
            res.status(400).json({
                error: 'BadRequest',
                message: 'The type of the id isn\'t valid',
            });
        }
    }
});

router.post('/increaseAvailableSeats/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.concertId));
        if (concert.length > 0) {
            const modifiedConcert = concert[0];
            if (modifiedConcert.availableSeats < modifiedConcert.totalSeats) {
                const resultConcert = await db.update(concertTable).set({availableSeats: (modifiedConcert.availableSeats + 1)}).where(eq(concertTable.id, req.params.concertId)).returning();
                res.json(resultConcert);
            } else {
                res.status(400).json({
                    error: 'BadRequest',
                    message: 'The concert is already empty.',
                });
            }
        } else {
            res.status(404).json({
                error: 'NotFound',
                message: `Concert with ID '${req.params.concertId}' not found.`,
                details: { concertId: req.params.concertId },
            });
        }
    } catch (error: any) {
        console.log(error);
        if (error.code === "22P02") {
            res.status(400).json({
                error: 'BadRequest',
                message: 'The type of the id isn\'t valid',
            });
        }
    }
});

router.post('/decreaseAvailableSeats/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.concertId));
        if (concert.length > 0) {
            const modifiedConcert = concert[0];
            if (modifiedConcert.availableSeats > 0) {
                const resultConcert = await db.update(concertTable).set({availableSeats: (modifiedConcert.availableSeats - 1)}).where(eq(concertTable.id, req.params.concertId)).returning();
                res.json(resultConcert);
            } else {
                res.status(400).json({
                    error: 'BadRequest',
                    message: 'The concert is already full.',
                });
            }
        } else {
            res.status(404).json({
                error: 'NotFound',
                message: `Concert with ID '${req.params.concertId}' not found.`,
                details: { concertId: req.params.concertId },
            });
        }
    } catch (error: any) {
        console.log(error);
        if (error.code === "22P02") {
            res.status(400).json({
                error: 'BadRequest',
                message: 'The type of the id isn\'t valid',
            });
        }
    }
});

router.post('/cancelConcert/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.concertId));
        if (concert.length > 0) {
            const modifiedConcert = concert[0];
            if (!modifiedConcert.canceled) {
                const resultConcert = await db.update(concertTable).set({canceled: true, canceledAt: sql`now()`}).where(eq(concertTable.id, req.params.concertId)).returning();
                res.json(resultConcert);
            } else {
                res.status(400).json({
                    error: 'BadRequest',
                    message: 'The concert is already canceled.',
                });
            }
        } else {
            res.status(404).json({
                error: 'NotFound',
                message: `Concert with ID '${req.params.concertId}' not found.`,
                details: { concertId: req.params.concertId },
            });
        }
    } catch (error: any) {
        console.log(error);
        if (error.code === "22P02") {
            res.status(400).json({
                error: 'BadRequest',
                message: 'The type of the id isn\'t valid',
            });
        }
    }
});

router.delete('/:concertId', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const concert = await db.select().from(concertTable).where(eq(concertTable.id, req.params.concertId));
        if (concert.length > 0) {
            await db.delete(concertTable).where(eq(concertTable.id, req.params.concertId));
            res.sendStatus(204);
        } else {
            res.status(404).json({
                error: 'NotFound',
                message: `Concert with ID '${req.params.concertId}' does not exist.`,
                details: { concertId: req.params.concertId },
            });
        }
    } catch (error: any) {
        console.log(error);
        if (error.code === "22P02") {
            res.status(400).json({
                error: 'BadRequest',
                message: 'The type of the id isn\'t valid',
            });
        }
    }
});

router.post('/add', async function(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.title === "string" && typeof req.query.place === "string" && typeof req.query.image === "string" && typeof req.query.concertDate === "string" && typeof req.query.totalSeats === "string") {
        const existingConcert = await db.select().from(concertTable).where(and(eq(concertTable.title, req.query.title), eq(concertTable.place, req.query.place), eq(concertTable.concertDate, new Date(req.query.concertDate))));
        if (existingConcert.length > 0) {
            res.status(409).json({
                error: 'Conflict',
                message: `This concert entity already exists.`,
                details: {
                    title: req.query.title,
                    place: req.query.place,
                    date: req.query.concertDate,
                },
            });
        } else {
            const concert: typeof concertTable.$inferInsert = {
                title: req.query.title,
                place: req.query.place,
                image: req.query.image,
                concertDate: new Date(req.query.concertDate),
                totalSeats: Number.parseInt(req.query.totalSeats),
                availableSeats: Number.parseInt(req.query.totalSeats),
                canceled: false,
                canceledAt: null,
            };

            const result = await db.insert(concertTable).values(concert).returning();

            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(500).json({
                    error: 'Database',
                    message: `A general error occurred on the server while interacting with the database.`,
                });
            }
            
        }
    } else {
        res.status(400).json({
            error: 'BadRequest',
            message: 'Invalid request parameters.',
        });
    }
});

module.exports = router;