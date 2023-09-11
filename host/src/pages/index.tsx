import Head from 'next/head'
import Link from "next/link";


export default function Home() {
    return (
        <>
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>Event Room Previewer</h1>
                            <ul>
                                <li><Link href={"/current-event"}>Current Event</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
