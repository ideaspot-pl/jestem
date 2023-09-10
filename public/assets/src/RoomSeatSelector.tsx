import {Fragment, ReactElement} from "react";
import "./types";

const letters = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function RoomSeatSelector({room, selected, setSelected, readonly}: {
    room: RoomDTO,
    selected: SeatDTO|null,
    setSelected: (seat: SeatDTO|null) => void,
    readonly: boolean,
}): ReactElement {

    return (
        <div className="room-seat-selector" style={{gridTemplateColumns: `repeat(${room.columns + 1}, 1fr)`}}>
            { [...Array(room.rows).keys()].map(row0 => {
                const row = row0 + 1;
                return (
                    <Fragment key={row}>
                        <div className={'row-label'}>{letters[row]}</div>
                        { [...Array(room.columns).keys()].map(col0 => {
                            const col = col0 + 1;
                            const seat: SeatDTO = [row, col];
                            return (
                                <Seat
                                    key={seat.join('-')}
                                    room={room} seat={seat}
                                    selected={selected}
                                    setSelected={(seat: SeatDTO|null) => {
                                        if (!readonly) {
                                            setSelected(seat);
                                        }
                                    }}
                                />
                            );
                        })}
                    </Fragment>
                );
            })}
        </div>
    );
}

export function Seat({room, seat, selected, setSelected}: {
    room: RoomDTO,
    seat: SeatDTO,
    selected: SeatDTO|null,
    setSelected: (seat: SeatDTO|null) => void,
}): ReactElement {
    const includesSeat = (haystack: SeatDTO[], needle: SeatDTO) => {
        return haystack.some(seat => seat[0] === needle[0] && seat[1] === needle[1]);
    }

    const handleClick = () => {
        if (includesSeat(room.blocked_seats, seat)) {
            return;
        }
        if (JSON.stringify(selected) === JSON.stringify(seat)) {
            setSelected(null);
        } else {
            setSelected(seat);
        }
    }

    let classes = [];
    classes.push('seat');
    classes.push(`seat-${seat[0]}-${seat[1]}`);
    if (includesSeat(room.blocked_seats, seat)) {
        classes.push('blocked');
    } else if (includesSeat(room.taken_seats, seat)) {
        classes.push('taken');
    }
    if (JSON.stringify(selected) === JSON.stringify(seat)) {
        classes.push('selected');
    }

    return (
        <div className={classes.join(' ')} onClick={handleClick}>
            {seat[1]}
        </div>
    );
}
