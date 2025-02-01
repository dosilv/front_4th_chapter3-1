import { randomUUID } from 'crypto';

import { http, HttpResponse } from 'msw';

import { Event, EventForm } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get<never, never, Event[]>('/api/events', () => {
    return HttpResponse.json(events as Event[]);
  }),

  http.post<never, EventForm, Event>('/api/events', async ({ request }) => {
    const event = (await request.json()) as EventForm;
    const newEvent = { ...event, id: randomUUID() };
    return HttpResponse.json(newEvent);
  }),

  http.put<{ id: string }, Event, Event>('/api/events/:id', async ({ request }) => {
    const event = (await request.json()) as Event;
    return HttpResponse.json(event);
  }),

  http.delete<{ id: string }, never, never>('/api/events/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
