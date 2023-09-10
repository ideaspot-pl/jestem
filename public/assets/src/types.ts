type EventInfoDTO = {
    event: EventDTO,
    room: RoomDTO,
}

type EventDTO = {
    id: number,
    code: string,
    label: string,
    start: string,
}

type RoomDTO = {
    code: string,
    label: string,
    rows: number,
    columns: number,
    blocked_seats: SeatDTO[],
    taken_seats: SeatDTO[],
}

type SeatDTO = [number, number];
