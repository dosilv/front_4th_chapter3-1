import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toBeInstanceOf(Date);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('20240701', '14:30').toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-01', '1430').toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '1:430').toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const mockEvent: Event = {
      id: '1',
      title: '모각코 💻🔥',
      date: '2025-02-01',
      startTime: '22:00',
      endTime: '24:00',
      description: 'chapter3-1 과제',
      location: 'zep',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(convertEventToDateRange(mockEvent)).toEqual({
      start: new Date('2025-02-01T22:00'),
      end: new Date('2025-02-01T24:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const mockEvent: Event = {
      id: '1',
      title: '모각코 💻🔥',
      date: '20250201',
      startTime: '22:00',
      endTime: '24:00',
      description: 'chapter3-1 과제',
      location: 'zep',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(convertEventToDateRange(mockEvent).start.toString()).toBe('Invalid Date');
    expect(convertEventToDateRange(mockEvent).end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const mockEvent: Event = {
      id: '1',
      title: '모각코 💻🔥',
      date: '2025-02-01',
      startTime: '2200',
      endTime: '2400',
      description: 'chapter3-1 과제',
      location: 'zep',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(convertEventToDateRange(mockEvent).start.toString()).toBe('Invalid Date');
    expect(convertEventToDateRange(mockEvent).end.toString()).toBe('Invalid Date');
  });
});

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

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(mockEvents[1], mockEvents[2])).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(mockEvents[0], mockEvents[1])).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: EventForm = {
      title: '야근 😫',
      date: '2025-02-01',
      startTime: '22:00',
      endTime: '24:00',
      description: '야근...',
      location: '회사',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(findOverlappingEvents(newEvent, mockEvents)).toEqual([mockEvents[1], mockEvents[2]]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: EventForm = {
      title: '낮잠 타임 💤',
      date: '2025-02-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '몰래 자기',
      location: '회사',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(findOverlappingEvents(newEvent, mockEvents)).toEqual([]);
  });
});
