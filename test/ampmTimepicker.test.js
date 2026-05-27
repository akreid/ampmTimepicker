import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// JSDOM 환경을 위한 ElementInternals 강제 모킹
HTMLElement.prototype.attachInternals = function() {
  this._mockInternals = {
    setFormValue: vi.fn(),
    setValidity: vi.fn((flags) => {
      this._mockValidity = !flags || Object.keys(flags).length === 0;
    }),
    checkValidity: () => this._mockValidity !== false,
    validationMessage: '',
    states: new Set()
  };
  if (!this.checkValidity) {
    this.checkValidity = () => this._mockInternals.checkValidity();
  }
  return this._mockInternals;
};

import '../ampmTimepicker.js'; // 컴포넌트 불러오기

describe('AmPmTimePicker 기능 테스트', () => {
  let picker;

  // 매 테스트 실행 전마다 깨끗한 DOM 상태를 위해 새로 생성하여 추가
  beforeEach(() => {
    picker = document.createElement('time-picker');
    document.body.appendChild(picker);
  });

  // 테스트 종료 후 DOM에서 제거
  afterEach(() => {
    picker.remove();
  });

  it('기본 24시간제 모드로 렌더링되며 값이 정상 설정되어야 한다.', () => {
    picker.value = '14:30';
    const input = picker.shadowRoot.querySelector('input');
    expect(input.value).toBe('14:30');
  });

  it('use-ampm 속성이 활성화되면 AM/PM 모드로 동작해야 한다.', () => {
    // 이미 beforeEach에서 append된 엘리먼트를 제거하고 속성을 먼저 주입 후 다시 mount
    picker.remove();
    picker = document.createElement('time-picker');
    picker.setAttribute('use-ampm', 'true');
    document.body.appendChild(picker);
    
    picker.value = '14:30';
    const input = picker.shadowRoot.querySelector('input');
    
    // 14:30이 PM 02:30으로 변환되는지 검증
    expect(input.value).toBe('PM 02:30');
  });

  it('start-time과 end-time을 벗어나는 값을 주입하면 자동으로 최소/최대값으로 보정(Clamp)되어야 한다.', () => {
    picker.setAttribute('start-time', '09:00');
    picker.setAttribute('end-time', '18:00');
    
    // 허용 범위(09:00) 밖의 값 (08:00) 주입 시 09:00으로 강제 보정됨
    picker.value = '08:00';
    expect(picker.value).toBe('09:00');
    
    // 최대 허용 범위(18:00) 밖의 값 주입 시 18:00으로 강제 보정됨
    picker.value = '19:00';
    expect(picker.value).toBe('18:00');
  });
});
