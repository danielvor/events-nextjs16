'use client';

import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string;}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success } = await createBooking({ eventId, slug, email });

        if(success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email })
        } else {
            console.error('Falha na criação da reserva')
            posthog.captureException('Falha na criação da reserva')
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Obrigado por se inscrever!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Endereço de E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Digite seu endereço de e-mail"
                        />
                    </div>

                    <button type="submit" className="button-submit">Enviar</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent