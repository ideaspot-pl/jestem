import {Fragment, ReactElement} from "react";
import styles from "./RoomDisplay.module.scss";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function RoomDisplay({room, attendees}: {
    room: RoomDTO,
    attendees: HostEventAttendeesDTO,
}): ReactElement {
    const letters = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rows: number[] = [];
    for (let i = room.rows; i > 0; i--) {
        rows.push(i);
    }
    let columns: number[] = [];
    for (let i = room.columns; i > 0; i--) {
        columns.push(i);
    }

    console.log(attendees);
    return (
        <div className={styles.roomDisplay} style={{gridTemplateColumns: `auto repeat(${room.columns}, 1fr)`}}>
            <div className={'row-label'}></div>
            { columns.map(col => {
                return (
                    <div key={col} className={'column-label'}>{col}</div>
                );
            })}

            { rows.map(row => {
                return (
                    <Fragment key={row}>
                        <div className={'row-label'}>{letters[row]}</div>
                        { columns.map(col => {
                            const seat: SeatDTO = [row, col];
                            return (
                                <SeatDisplay key={`${row}-${col}`} room={room} seat={seat} attendees={attendees.local} />
                            );
                        })}
                    </Fragment>
                );
            })}

            <div className={'row-label'}></div>
            { columns.map(col => {
                return (
                    <div key={col} className={'column-label'}>{col}</div>
                );
            })}
        </div>
    );
}

export function SeatDisplay({room, seat, attendees}: {
    room: RoomDTO,
    seat: SeatDTO,
    attendees: LocalAttendeesDTO,
}): ReactElement {
    const includesSeat = (haystack: SeatDTO[], needle: SeatDTO) => {
        return haystack.some(seat => seat[0] === needle[0] && seat[1] === needle[1]);
    }

    const seatAttendees = attendees[seat[0]] && attendees[seat[0]][seat[1]] ? attendees[seat[0]][seat[1]] : [];

    let classes = [styles.seat];
    if (includesSeat(room.blocked_seats, seat)) {
        classes.push(styles.blocked);
    }

    return (
        <div className={classes.join(' ')}>
            { seatAttendees.map((attendee: AttendeeDTO) => {
                const src = `/photos/${attendee.code.trim()}.jpg`;
                return (
                    <div key={attendee.id} className={styles.attendee}>
                        <ImageWithFallback src={src} alt={`${attendee.code}`} width={104} height={138} />
                        <div className={styles.info}>
                            <div className={styles.firstname}>{attendee.firstname}</div>
                            <div className={styles.lastname}>{attendee.lastname}</div>
                            <div className={styles.code}>{attendee.code}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
