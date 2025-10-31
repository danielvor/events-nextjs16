import React from 'react'
import {notFound} from "next/navigation";
import {IEvent} from "@/database";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetails = async ({ params }: { params: Promise<string> }) => {
    'use cache'
    cacheLife('hours');
    const slug = await params;

    let event;
    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!request.ok) {
            if (request.status === 404) {
                return notFound();
            }
            throw new Error(`Falha ao buscar evento: ${request.statusText}`);
        }

        const response = await request.json();
        event = response.event;

        if (!event) {
            return notFound();
        }
    } catch (error) {
        console.error('Erro ao buscar evento:', error);
        return notFound();
    }

    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

    if(!description) return notFound();

    const bookings = 10;

    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    return (
        <section id="event">
            <div className="header">
                <h1>Descrição do Evento</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                {/*    Lado Esquerdo - Conteúdo do Evento */}
                <div className="content">
                    <Image src={image} alt="Banner do Evento" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Visão Geral</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Detalhes do Evento</h2>

                        <EventDetailItem icon="/icons/calendar.svg" alt="calendário" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="relógio" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="localização" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="modalidade" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="público" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>Sobre o Organizador</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>

                {/*    Lado Direito - Formulário de Reserva */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Reserve Sua Vaga</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Junte-se a {bookings} pessoas que já reservaram sua vaga!
                            </p>
                        ): (
                            <p className="text-sm">Seja o primeiro a reservar sua vaga!</p>
                        )}

                        <BookEvent eventId={event._id} slug={event.slug} />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Eventos Similares</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    ))}
                </div>
            </div>
        </section>
    )
}
export default EventDetails