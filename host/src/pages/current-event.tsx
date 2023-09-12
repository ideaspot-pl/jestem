import Head from 'next/head'
import Link from "next/link";
import useHostCurrentEvent from "@/hooks/useHostCurrentEvent";
import RoomDisplay, {AttendeeDisplay} from "@/components/RoomDisplay";


export default function CurrentEvent() {
    const {eventInfo, isLoading, error, mutate} = useHostCurrentEvent();

    if (error) {
        return <div>{error}</div>
    }

    if (isLoading || !eventInfo) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Head>
                <title>Current Event</title>
            </Head>

            <nav className="navbar sticky-top bg-body">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">{eventInfo.event.label}</span>
                    <span className="navbar-text">{eventInfo.room.label}: {eventInfo.event.start}</span>
                </div>
            </nav>

            <main className="container-fluid">
                <div className="row">
                    <div className="col text-center">
                        <RoomDisplay room={eventInfo.room} attendees={eventInfo.attendees} />
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex">
                        {eventInfo.attendees.remote.map(attendee => (
                            <AttendeeDisplay attendee={attendee} key={attendee.id} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
