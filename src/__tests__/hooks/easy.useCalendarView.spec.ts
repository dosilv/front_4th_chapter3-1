import { act, renderHook } from '@testing-library/react';

import { useCalendarViewStore } from '../../hooks/useCalendarViewStore.ts';
import { assertDate } from '../utils.ts';

describe('초기 상태', () => {
  const MOCK_DATE = '2024-10-01';

  beforeEach(() => {
    vi.setSystemTime(new Date(MOCK_DATE));

    // ⚙️ useCalendarViewStore에서 모킹한 시스템 시간을 사용하도록 설정 (🤔 왜 setSytemTime만으로는 적용이 안 될까?)
    const { result } = renderHook(() => useCalendarViewStore());
    act(() => result.current.setCurrentDate(new Date(MOCK_DATE)));
  });

  afterEach(() => {
    vi.useRealTimers();

    // 🧹 각 테스트가 store를 공유하므로 초기 상태로 복구
    act(() => useCalendarViewStore.setState(useCalendarViewStore.getInitialState(), true));
  });

  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarViewStore());

    expect(result.current.view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarViewStore());

    assertDate(result.current.currentDate, new Date());
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', async () => {
    const { result } = renderHook(() => useCalendarViewStore());

    expect(result.current.holidays).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });
});

it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
  const { result } = renderHook(() => useCalendarViewStore());

  act(() => {
    result.current.setView('week');
  });

  expect(result.current.view).toBe('week');
});

describe('navigate 테스트', () => {
  const MOCK_DATE = '2024-10-01';

  beforeEach(() => {
    vi.setSystemTime(new Date(MOCK_DATE));
    const { result } = renderHook(() => useCalendarViewStore());
    act(() => result.current.setCurrentDate(new Date(MOCK_DATE)));
  });

  afterEach(() => {
    vi.useRealTimers();
    act(() => useCalendarViewStore.setState(useCalendarViewStore.getInitialState(), true));
  });

  it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarViewStore());

    act(() => {
      result.current.setView('week');
    });
    act(() => {
      result.current.navigate('next');
    });

    assertDate(result.current.currentDate, new Date('2024-10-08'));
  });

  it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarViewStore());

    act(() => {
      result.current.setView('week');
    });
    act(() => result.current.navigate('prev'));

    assertDate(result.current.currentDate, new Date('2024-09-24'));
  });

  it("월간 뷰에서 다음으로 navigate시 한 달 전 '2024-11-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarViewStore());

    act(() => result.current.navigate('next'));

    assertDate(result.current.currentDate, new Date('2024-11-01'));
  });

  it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarViewStore());

    act(() => result.current.navigate('prev'));

    assertDate(result.current.currentDate, new Date('2024-09-01'));
  });
});

it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
  const { result } = renderHook(() => useCalendarViewStore());

  act(() => {
    result.current.setCurrentDate(new Date('2024-01-01'));
  });

  expect(result.current.holidays).toEqual({
    '2024-01-01': '신정',
  });
});
