import { http, HttpResponse } from 'msw';

import { Event, EventForm } from '../types';
import {
  getEvents,
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from './handlersUtils';
import { events } from './response/events.json' assert { type: 'json' };

// 초기값 설정
setupMockHandlerCreation(events as Event[]);

export const handlers = [
  http.get<never, never, { events: Event[] }>('/api/events', () => {
    return HttpResponse.json({ events: getEvents() });
  }),

  http.post<never, EventForm, Event>('/api/events', async ({ request }) => {
    const event = (await request.json()) as EventForm;
    const newEvent = { ...event, id: Date.now().toString() };

    setupMockHandlerUpdating(newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put<{ id: string }, Event, Event>('/api/events/:id', async ({ request, params }) => {
    const event = (await request.json()) as Event;

    setupMockHandlerUpdating(event, params.id);

    return HttpResponse.json(event);
  }),

  http.delete<{ id: string }, never, never>('/api/events/:id', ({ params }) => {
    setupMockHandlerDeletion(params.id);

    return new HttpResponse(null, { status: 204 });
  }),
];
