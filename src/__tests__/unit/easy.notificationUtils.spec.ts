import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '명상 타임 🧘🏻‍♀️',
    date: '2025-02-01',
    startTime: '21:50',
    endTime: '22:00',
    description: '과제 전 마음의 준비',
    location: '내 방',
    category: '기타',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '모각코 💻🔥',
    date: '2025-02-01',
    startTime: '22:00',
    endTime: '24:00',
    description: 'chapter3-1 과제',
    location: 'zep',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '3',
    title: '야근 😫',
    date: '2025-02-01',
    startTime: '22:00',
    endTime: '24:00',
    description: '야근...',
    location: '회사',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '4',
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

const MOCK_DATE = '2025-02-01T21:59:59';

beforeAll(() => {
  process.env.TZ = 'UTC';
  vi.setSystemTime(new Date(MOCK_DATE));
});

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    expect(getUpcomingEvents(mockEvents, new Date(), [])).toEqual([mockEvents[1], mockEvents[2]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    expect(getUpcomingEvents(mockEvents, new Date(), ['3'])).toEqual([mockEvents[1]]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    expect(getUpcomingEvents(mockEvents, new Date(), [])).not.include([mockEvents[3]]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    expect(getUpcomingEvents(mockEvents, new Date(), [])).not.include([mockEvents[0]]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    expect(createNotificationMessage(mockEvents[1])).toBe('1분 후 모각코 💻🔥 일정이 시작됩니다.');
  });
});
