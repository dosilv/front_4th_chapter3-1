import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  const MOCK_TIME_1100 = '11:00';
  const MOCK_TIME_1200 = '12:00';
  const MOCK_TIME_EMPTY = '';

  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_1200, MOCK_TIME_1100).startTimeError).toBe(
      '시작 시간은 종료 시간보다 빨라야 합니다.'
    );
    expect(getTimeErrorMessage(MOCK_TIME_1200, MOCK_TIME_1100).endTimeError).toBe(
      '종료 시간은 시작 시간보다 늦어야 합니다.'
    );
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_1100).startTimeError).toBe(
      '시작 시간은 종료 시간보다 빨라야 합니다.'
    );
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_1100).endTimeError).toBe(
      '종료 시간은 시작 시간보다 늦어야 합니다.'
    );
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_1200).startTimeError).toBeNull();
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_1200).endTimeError).toBeNull();
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_EMPTY, MOCK_TIME_1200).startTimeError).toBeNull();
    expect(getTimeErrorMessage(MOCK_TIME_EMPTY, MOCK_TIME_1200).endTimeError).toBeNull();
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_EMPTY).startTimeError).toBeNull();
    expect(getTimeErrorMessage(MOCK_TIME_1100, MOCK_TIME_EMPTY).endTimeError).toBeNull();
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    expect(getTimeErrorMessage(MOCK_TIME_EMPTY, MOCK_TIME_EMPTY).startTimeError).toBeNull();
    expect(getTimeErrorMessage(MOCK_TIME_EMPTY, MOCK_TIME_EMPTY).endTimeError).toBeNull();
  });
});
