import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, cleanup, renderHook } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { setupMockHandlerCreation } from '../__mocks__/handlersUtils';
import { events } from '../__mocks__/response/events.json' assert { type: 'json' };
import App from '../App';
import { useCalendarViewStore } from '../hooks/useCalendarViewStore';
import { useEventStore } from '../hooks/useEventStore';
import { server } from '../setupTests';
import { Event } from '../types';

const MOCK_DATE = '2025-02-03';

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  vi.setSystemTime(new Date(MOCK_DATE));

  // ⚙️ useCalendarViewStore에서 모킹한 시스템 시간을 사용하도록 설정
  const { result } = renderHook(() => useCalendarViewStore());
  act(() => result.current.setCurrentDate(new Date(MOCK_DATE)));

  setupMockHandlerCreation(events as Event[]);
  userEvent.setup();
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
});

afterEach(() => {
  vi.useRealTimers();

  // 🧹 각 테스트가 store를 공유하므로 초기 상태로 복구
  act(() => useCalendarViewStore.setState(useCalendarViewStore.getInitialState(), true));
  act(() => useEventStore.setState(useEventStore.getInitialState(), true));
});

afterAll(() => {
  server.close();
});

// 🧚🏻‍♀️ 공통적으로 필요한 input 요소 추출
const getFormElements = () => ({
  titleInput: screen.getByLabelText('제목'),
  dateInput: screen.getByLabelText('날짜'),
  startTimeInput: screen.getByLabelText('시작 시간'),
  endTimeInput: screen.getByLabelText('종료 시간'),
  descriptionInput: screen.getByLabelText('설명'),
  locationInput: screen.getByLabelText('위치'),
  categoryInput: screen.getByLabelText('카테고리'),
  notificationTimeInput: screen.getByLabelText('알림 설정'),
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    const TITLE = '즐거운 과제 시간 🔥';
    const DATE = '2025-02-03';
    const START_TIME = '20:00';
    const END_TIME = '23:00';
    const DESCRIPTION = '🔥💪🏻🌈✨';
    const LOCATION = '내 방';
    const CATEGORY = '개인';
    const NOTIFICATION_TIME = '1시간 전';

    const {
      titleInput,
      dateInput,
      startTimeInput,
      endTimeInput,
      descriptionInput,
      locationInput,
      categoryInput,
      notificationTimeInput,
    } = getFormElements();

    await userEvent.type(titleInput, TITLE);
    await userEvent.type(dateInput, DATE);
    await userEvent.type(startTimeInput, START_TIME);
    await userEvent.type(endTimeInput, END_TIME);
    await userEvent.type(descriptionInput, DESCRIPTION);
    await userEvent.type(locationInput, LOCATION);
    await userEvent.selectOptions(categoryInput, CATEGORY);
    await userEvent.selectOptions(notificationTimeInput, NOTIFICATION_TIME);

    const addBtn = screen.getByRole('button', { name: '일정 추가' });
    await userEvent.click(addBtn);

    const eventList = screen.getByTestId('event-list');

    expect(await within(eventList).findByText(TITLE)).toBeInTheDocument();
    expect(await within(eventList).findByText(DATE)).toBeInTheDocument();
    expect(await within(eventList).findByText(`${START_TIME} - ${END_TIME}`)).toBeInTheDocument();
    expect(await within(eventList).findByText(DESCRIPTION)).toBeInTheDocument();
    expect(await within(eventList).findByText(LOCATION)).toBeInTheDocument();
    expect(await within(eventList).findByText(`카테고리: ${CATEGORY}`)).toBeInTheDocument();
    expect(await within(eventList).findByText(`알림: ${NOTIFICATION_TIME}`)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    const EDITED_TITLE = '야근 😫';
    const EDITED_DATE = '2025-02-03';
    const EDITED_START_TIME = '20:00';
    const EDITED_END_TIME = '23:00';
    const EDITED_DESCRIPTION = '그렇게 되었다..';
    const EDITED_LOCATION = '회사';
    const EDITED_CATEGORY = '업무';
    const EDITED_NOTIFICATION_TIME = '10분 전';

    const {
      titleInput,
      dateInput,
      startTimeInput,
      endTimeInput,
      descriptionInput,
      locationInput,
      categoryInput,
      notificationTimeInput,
    } = getFormElements();

    const eventList = screen.getByTestId('event-list');
    // 💡 이벤트 데이터가 로드되어야 보이는 버튼이므로 findeByRole로 찾기
    const editModeBtn = await within(eventList).findByRole('button', { name: 'Edit event' });
    await userEvent.click(editModeBtn);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, EDITED_TITLE);

    await userEvent.clear(dateInput);
    await userEvent.keyboard(EDITED_DATE);

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, EDITED_START_TIME);

    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, EDITED_END_TIME);

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, EDITED_DESCRIPTION);

    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, EDITED_LOCATION);

    await userEvent.click(categoryInput);

    await userEvent.selectOptions(notificationTimeInput, EDITED_NOTIFICATION_TIME);

    const editBtn = screen.getByRole('button', { name: '일정 수정' });
    await userEvent.click(editBtn);

    expect(await within(eventList).findByText(EDITED_TITLE)).toBeInTheDocument();
    expect(await within(eventList).findByText(EDITED_DESCRIPTION)).toBeInTheDocument();
    expect(await within(eventList).findByText(EDITED_LOCATION)).toBeInTheDocument();
    expect(await within(eventList).findByText(`카테고리: ${EDITED_CATEGORY}`)).toBeInTheDocument();
    expect(
      await within(eventList).findByText(`알림: ${EDITED_NOTIFICATION_TIME}`)
    ).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    const eventList = screen.getByTestId('event-list');

    const deleteBtn = await within(eventList).findByRole('button', { name: 'Delete event' });
    await userEvent.click(deleteBtn);

    // 💡 존재하지 않는 요소이므로 에러를 반환하지 않도록 queryByText로 찾기
    expect(within(eventList).queryByText('기존 회의')).toBeNull();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    const weekViewBtn = screen.getByLabelText('view');
    await userEvent.selectOptions(weekViewBtn, 'week');

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('2025년 2월 1주')).toBeInTheDocument();
    expect(within(weekView).queryByTestId('event-item')).toBeNull();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const weekViewBtn = screen.getByLabelText('view');
    await userEvent.selectOptions(weekViewBtn, 'week');

    const prevBtn = screen.getByLabelText('Previous');
    await userEvent.click(prevBtn);

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('2025년 1월 5주')).toBeInTheDocument();
    expect(within(weekView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    const monthViewBtn = screen.getByLabelText('view');
    await userEvent.selectOptions(monthViewBtn, 'month');

    const nextBtn = screen.getByLabelText('Next');
    await userEvent.click(nextBtn);

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('2025년 3월')).toBeInTheDocument();
    expect(within(monthView).queryByTestId('event-item')).toBeNull();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    const monthViewBtn = screen.getByLabelText('view');
    await userEvent.selectOptions(monthViewBtn, 'month');

    expect(screen.getByText('2025년 2월')).toBeInTheDocument();

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const monthViewBtn = screen.getByLabelText('view');
    await userEvent.selectOptions(monthViewBtn, 'month');

    const prevBtn = screen.getByLabelText('Previous');
    await userEvent.click(prevBtn);

    expect(screen.getByText('2025년 1월')).toBeInTheDocument();

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('신정')).toBeInTheDocument();
  });
});

const MULTIPLE_EVENTS: Event[] = [
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
  {
    id: '2',
    title: '팀 점심 🍽️',
    date: '2025-02-04',
    startTime: '12:00',
    endTime: '14:00',
    description: '점심 회식',
    location: '비싼 곳~',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

describe('검색 기능', () => {
  beforeEach(() => {
    // 🔍 검색을 위한 데이터 세팅
    setupMockHandlerCreation(MULTIPLE_EVENTS);

    // ♻️ 새로운 데이터 fetch를 위한 렌더링 초기화
    cleanup();
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await userEvent.type(searchInput, '없지롱');

    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await userEvent.type(searchInput, '팀 회의');

    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await userEvent.type(searchInput, '없지롱');

    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();

    await userEvent.clear(searchInput);
    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).getByText('팀 점심 🍽️')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    const TITLE = '겹치는 일정 📆';
    const DATE = '2025-02-01';
    const START_TIME = '09:30';
    const END_TIME = '10:30';
    const DESCRIPTION = 'so busy';

    const { titleInput, dateInput, startTimeInput, endTimeInput, descriptionInput } =
      getFormElements();

    await userEvent.type(titleInput, TITLE);
    await userEvent.type(dateInput, DATE);
    await userEvent.type(startTimeInput, START_TIME);
    await userEvent.type(endTimeInput, END_TIME);
    await userEvent.type(descriptionInput, DESCRIPTION);

    const addBtn = screen.getByRole('button', { name: '일정 추가' });
    await userEvent.click(addBtn);

    const dialog = screen.getByRole('banner');
    expect(within(dialog).getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerCreation(MULTIPLE_EVENTS);

    cleanup();
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const EDITED_START_TIME = '09:00';

    const { startTimeInput } = getFormElements();

    const eventList = screen.getByTestId('event-list');
    const editModeBtns = await within(eventList).findAllByRole('button', { name: 'Edit event' });
    await userEvent.click(editModeBtns[1]);

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, EDITED_START_TIME);

    const editBtn = screen.getByRole('button', { name: '일정 수정' });
    await userEvent.click(editBtn);

    const dialog = screen.getByRole('banner');
    expect(within(dialog).getByText('일정 겹침 경고')).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.useRealTimers();
  vi.useFakeTimers();
  process.env.TZ = 'UTC';
  const MOCK_DATETIME = '2025-02-01T08:49';
  vi.setSystemTime(new Date(MOCK_DATETIME));

  // 💡 상태 업데이트를 기다리기 위해 act로 렌더 감싸기
  cleanup();
  await act(async () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
  });

  await act(async () => {
    vi.advanceTimersByTime(1000 * 60);
  });

  const notification = screen.getByTestId('notification');
  expect(
    within(notification).getByText('10분 후 기존 회의 일정이 시작됩니다.')
  ).toBeInTheDocument();
});
