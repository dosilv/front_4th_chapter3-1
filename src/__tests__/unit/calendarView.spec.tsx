import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, cleanup, act, renderHook } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import CalendarView from '../../components/CalendarView';
import { useCalendarViewStore } from '../../hooks/useCalendarViewStore';
import { useEventStore } from '../../hooks/useEventStore';
import { useSearch } from '../../hooks/useSearch';
import { Event } from '../../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '팀 회의',
    date: '2025-02-04',
    startTime: '09:00',
    endTime: '10:00',
    description: '팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('CalendarView 컴포넌트 테스트', () => {
  beforeEach(async () => {
    vi.setSystemTime(new Date('2025-02-03'));

    // ⚠️ useSearch는 App.tsx에서 호출하므로 CalenderView 테스트 시 따로 호출해야 함...🤯
    renderHook(() => useSearch(mockEvents, new Date(), 'month'));

    act(() =>
      render(
        <ChakraProvider>
          <CalendarView />
        </ChakraProvider>
      )
    );
  });

  afterEach(async () => {
    vi.useRealTimers();
    await act(async () => {
      useCalendarViewStore.setState(useCalendarViewStore.getInitialState(), true);
    });
  });

  it('디폴트로 월별 뷰가 표시된다', () => {
    expect(screen.getByTestId('month-view')).toBeInTheDocument();
  });

  it('주별 뷰를 선택하면 주별 캘린더가 표시된다', async () => {
    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    expect(screen.getByTestId('week-view')).toBeInTheDocument();
  });

  it('주별 뷰에서 이전 버튼을 클릭하면 이전 주로 이동한다', async () => {
    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const prevButton = screen.getByLabelText('Previous');
    await userEvent.click(prevButton);

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('2025년 1월 5주')).toBeInTheDocument();
  });

  it('월별 뷰에서 이전 버튼을 클릭하면 이전 월로 이동한다', async () => {
    const prevButton = screen.getByLabelText('Previous');
    await userEvent.click(prevButton);

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('2025년 1월')).toBeInTheDocument();
  });

  it('월별 뷰에서 다음 버튼을 클릭하면 다음 월로 이동한다', async () => {
    const nextButton = screen.getByLabelText('Next');
    await userEvent.click(nextButton);

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('2025년 3월')).toBeInTheDocument();
  });

  it('주별 뷰에서 다음 버튼을 클릭하면 다음 주로 이동한다', async () => {
    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const nextButton = screen.getByLabelText('Next');
    await userEvent.click(nextButton);

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('2025년 2월 2주')).toBeInTheDocument();
  });

  it('일정이 있는 날짜에 일정이 표시된다', () => {
    expect(screen.getByText('팀 회의')).toBeInTheDocument();
  });

  it('알림이 오지 않은 일정은 아이콘이 표시되지 않는다', () => {
    const bellIcon = screen.queryByTestId('bell-icon');
    expect(bellIcon).toBeNull();
  });

  it('알림이 온 일정은 아이콘이 표시된다', async () => {
    const mockNotifiedEvents: string[] = ['1'];

    const { result } = renderHook(() => useEventStore());
    await act(async () => result.current.setNotifiedEvents(mockNotifiedEvents));

    cleanup();
    render(
      <ChakraProvider>
        <CalendarView />
      </ChakraProvider>
    );

    console.log(screen.debug());

    const bellIcon = screen.queryByTestId('bell-icon');
    expect(bellIcon).toBeInTheDocument();
  });
});
