import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils.ts';
import events from '../../__mocks__/response/events.json';
import { useEventFormStore } from '../../hooks/useEventFormStore.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { useEventStore } from '../../hooks/useEventStore.ts';
import { server } from '../../setupTests.ts';
import { Event, EventForm } from '../../types.ts';
const INITIAL_EVENTS = events.events as Event[];

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  setupMockHandlerCreation(INITIAL_EVENTS);
});

afterEach(() => {
  // 🧹 각 테스트가 store를 공유하므로 초기 상태로 복구
  act(() => useEventFormStore.setState(useEventFormStore.getInitialState(), true));
  act(() => useEventStore.setState(useEventStore.getInitialState(), true));
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = await act(async () => renderHook(() => useEventOperations()));

  expect(result.current.events).toEqual(INITIAL_EVENTS);
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  const NEW_EVENT: EventForm = {
    title: '새로운 회의 👩🏻‍💻',
    date: '2024-10-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '새로운 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations());

  await act(async () => await result.current.saveEvent(NEW_EVENT));

  expect(result.current.events).toEqual([
    ...INITIAL_EVENTS,
    {
      ...NEW_EVENT,
      id: expect.any(String),
    },
  ]);
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  const { result } = renderHook(() => useEventOperations());
  // ⚙️ 수정 모드로 전환
  act(() => useEventFormStore.setState({ editingEvent: INITIAL_EVENTS[0] }));

  const modifiedEvent = { ...INITIAL_EVENTS[0], title: '길어진 미팅 😠', endTime: '12:00' };

  await act(async () => await result.current.saveEvent(modifiedEvent));

  expect(result.current.events).toEqual([modifiedEvent]);
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  const { result } = renderHook(() => useEventOperations());

  await act(async () => await result.current.deleteEvent(INITIAL_EVENTS[0].id));

  expect(result.current.events).toEqual(INITIAL_EVENTS.slice(1));
});

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', () => ({
  useToast: () => mockToast,
}));

describe('네트워크 에러 처리', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    await act(async () => {
      renderHook(() => useEventOperations());
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '이벤트 로딩 실패',
      })
    );
  });

  it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
    const newEvent: EventForm = {
      title: '새로운 회의 👩🏻‍💻',
      date: '2024-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '새로운 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    server.use(
      http.put('/api/events/:id', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useEventOperations());
    // ⚙️ 수정 모드로 전환
    act(() => useEventFormStore.setState({ editingEvent: INITIAL_EVENTS[0] }));

    await act(async () => await result.current.saveEvent(newEvent));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '일정 저장 실패',
      })
    );
  });

  it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
    server.use(
      http.delete('/api/events/:id', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const { result } = await act(async () => renderHook(() => useEventOperations()));

    await act(async () => await result.current.deleteEvent(INITIAL_EVENTS[0].id));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '일정 삭제 실패',
      })
    );
  });
});
