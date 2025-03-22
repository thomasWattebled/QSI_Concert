export type activeConcert = {
    id: string,
    title: string,
    place: string,
    concert_date: Date,
    total_seats: number,
    available_seats: number,
    canceled: false,
    created_at: Date
}

export type canceledConcert = {
    id: string,
    title: string,
    place: string,
    concert_date: Date,
    total_seats: number,
    available_seats: number,
    canceled: true,
    canceled_at: Date,
    created_at: Date
}

export const cancelConcert = (concert : activeConcert) : canceledConcert => {
    return {
        id : concert.id,
        title: concert.title,
        place: concert.place,
        concert_date: concert.concert_date,
        total_seats: concert.total_seats,
        available_seats: concert.available_seats,
        canceled: true,
        canceled_at: new Date(Date.now()),
        created_at: concert.created_at
    }
}