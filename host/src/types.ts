type HostEventInfoDTO = {
    event: EventDTO,
    room: RoomDTO,
    attendees: HostEventAttendeesDTO,
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

type HostEventAttendeesDTO = {
    remote: AttendeeDTO[],
    local: {
        [key: string]: {
            [key: string]: AttendeeDTO,
        }
    }
}

type AttendeeDTO = {
    id: number,
    firstname: string,
    lastname: string,
    code: string
}
