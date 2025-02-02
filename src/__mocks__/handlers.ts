import { http, HttpResponse } from 'msw';

import { Event, EventForm } from '../types';
import { getEvents, setupMockHandlerDeletion, setupMockHandlerUpdating } from './handlersUtils';
// FIXME: get에서 events를 사용하면서도 업데이트된 상태를 반환하도록 어떻게 수정할 수 있을까?
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
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
