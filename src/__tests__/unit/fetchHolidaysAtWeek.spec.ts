import { fetchHolidaysAtWeek } from '../../apis/fetchHolidaysAtWeek';

describe('fetchHolidaysAtWeek', () => {
  it('주어진 주의 공휴일만 반환한다', () => {
    expect(fetchHolidaysAtWeek(new Date('2024-01-01'))).toEqual({ '2024-01-01': '신정' });
  });

  it('공휴일이 없는 주에 대해 빈 객체를 반환한다', () => {
    expect(fetchHolidaysAtWeek(new Date('2024-07-01'))).toEqual({});
  });

  it('여러 공휴일이 있는 주에 대해 모든 공휴일을 반환한다', () => {
    expect(fetchHolidaysAtWeek(new Date('2024-09-15'))).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });

  // 경계값 테스트
  it('2024년 12월과 2025년 1월이 포함된 주에 대해 1월 1일 공휴일을 반환한다', () => {
    expect(fetchHolidaysAtWeek(new Date('2024-12-31'))).toEqual({
      '2025-01-01': '신정',
    });
  });
});
