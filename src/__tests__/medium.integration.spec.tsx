import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import { setupMockHandlerCreation } from '../__mocks__/handlersUtils';
import { events } from '../__mocks__/response/events.json' assert { type: 'json' };
import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';

const MOCK_DATE = '2025-02-03';

beforeAll(() => {
  vi.setSystemTime(new Date(MOCK_DATE));
  server.listen();
});

beforeEach(() => {
  setupMockHandlerCreation(events as Event[]);
  userEvent.setup();
});

afterAll(() => {
  server.close();
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeInput = screen.getByLabelText('알림 설정');
    const addBtn = screen.getByRole('button', { name: '일정 추가' });

    const TITLE = '즐거운 과제 시간 🔥';
    const DATE = '2025-02-03';
    const START_TIME = '20:00';
    const END_TIME = '23:00';
    const DESCRIPTION = '🔥💪🏻🌈✨';
    const LOCATION = '내 방';
    const CATEGORY = '개인';
    const NOTIFICATION_TIME = '1시간 전';

    await userEvent.click(titleInput);
    await userEvent.type(titleInput, TITLE);

    await userEvent.click(dateInput);
    await userEvent.keyboard(DATE);

    await userEvent.click(startTimeInput);
    await userEvent.type(startTimeInput, START_TIME);

    await userEvent.click(endTimeInput);
    await userEvent.type(endTimeInput, END_TIME);

    await userEvent.click(descriptionInput);
    await userEvent.type(descriptionInput, DESCRIPTION);

    await userEvent.click(locationInput);
    await userEvent.type(locationInput, LOCATION);

    await userEvent.click(categoryInput);
    await userEvent.selectOptions(categoryInput, CATEGORY);

    await userEvent.click(notificationTimeInput);
    await userEvent.selectOptions(notificationTimeInput, NOTIFICATION_TIME);

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
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeInput = screen.getByLabelText('알림 설정');

    const EDITED_TITLE = '야근 😫';
    const EDITED_DATE = '2025-02-03';
    const EDITED_START_TIME = '20:00';
    const EDITED_END_TIME = '23:00';
    const EDITED_DESCRIPTION = '그렇게 되었다..';
    const EDITED_LOCATION = '회사';
    const EDITED_CATEGORY = '업무';
    const EDITED_NOTIFICATION_TIME = '10분 전';

    const eventList = screen.getByTestId('event-list');

    // 💡 이벤트 데이터가 로드되어야 보이는 버튼이므로 findeByRole로 찾기
    const editModeBtn = await within(eventList).findByRole('button', { name: 'Edit event' });
    await userEvent.click(editModeBtn);

    const editBtn = screen.getByRole('button', { name: '일정 수정' });

    await userEvent.click(titleInput);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, EDITED_TITLE);

    await userEvent.click(dateInput);
    await userEvent.clear(dateInput);
    await userEvent.keyboard(EDITED_DATE);

    await userEvent.click(startTimeInput);
    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, EDITED_START_TIME);

    await userEvent.click(endTimeInput);
    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, EDITED_END_TIME);

    await userEvent.click(descriptionInput);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, EDITED_DESCRIPTION);

    await userEvent.click(locationInput);
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, EDITED_LOCATION);

    await userEvent.click(categoryInput);
    await userEvent.selectOptions(categoryInput, EDITED_CATEGORY);

    await userEvent.click(notificationTimeInput);
    await userEvent.selectOptions(notificationTimeInput, EDITED_NOTIFICATION_TIME);

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
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = screen.getByTestId('event-list');

    const deleteBtn = await within(eventList).findByRole('button', { name: 'Delete event' });
    await userEvent.click(deleteBtn);

    // 💡 존재하지 않는 요소이므로 에러를 반환하지 않도록 queryByText로 찾기
    expect(within(eventList).queryByText('기존 회의')).toBeNull();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
