import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { parseHM } from '../utils.ts';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '간식 타임 🍰',
    date: '2025-02-01',
    startTime: '23:00',
    endTime: '24:00',
    description: '힘드니까 간식 먹기',
    location: '내 방',
    category: '기타',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications(mockEvents));

  expect(result.current.notifications).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', async () => {
  vi.useFakeTimers();
  const MOCK_DATETIME = '2025-02-01T22:58';
  vi.setSystemTime(new Date(MOCK_DATETIME));
  const { result } = renderHook(() => useNotifications(mockEvents));

  // 시간이 정확히 맞는지 검증
  expect(formatDate(new Date())).toBe('2025-02-01');
  expect(parseHM(new Date().getTime())).toBe('22:58');
  expect(result.current.notifications).toEqual([]);

  await act(async () => {
    vi.advanceTimersByTime(1000 * 60);
  });

  expect(parseHM(new Date().getTime())).toBe('22:59');
  expect(result.current.notifications).toEqual([
    {
      id: '1',
      message: '1분 후 간식 타임 🍰 일정이 시작됩니다.',
    },
  ]);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = renderHook(() => useNotifications(mockEvents));

  result.current.removeNotification(0);

  expect(result.current.notifications).toEqual([]);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const { result } = renderHook(() => useNotifications(mockEvents));
  expect(result.current.notifications.map(({ id }) => id)).toEqual(result.current.notifiedEvents);
});
