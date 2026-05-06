# `ampmTimepicker.js` 사용 가이드

[🇺🇸 English Version](./README.md)

[![npm version](https://img.shields.io/npm/v/@akreid/ampm-timepicker.svg?style=flat-square)](https://www.npmjs.com/package/@akreid/ampm-timepicker)
[![npm downloads](https://img.shields.io/npm/dm/@akreid/ampm-timepicker.svg?style=flat-square)](https://www.npmjs.com/package/@akreid/ampm-timepicker)

`<time-picker>`는 **의존성 없는 순수 자바스크립트(Vanilla JS)**로 구현된 네이티브 커스텀 웹 컴포넌트 타임피커입니다. 리액트나 뷰 같은 **별도의 프레임워크 없이도** 어디서든 독립적으로 작동하며, 12시간/24시간 형식 지원 및 직관적인 키보드 접근성(방향키 및 탭 이동)을 제공합니다.

## 🚀 설치 및 적용

### 1. ES Module 사용 (권장)

프로젝트에서 ES 모듈을 지원하는 경우, npm을 통해 설치하고 import하여 사용하는 것이 가장 좋습니다.

```bash
# 라이브러리 설치
npm install @akreid/ampm-timepicker
# 또는 yarn 사용 시
yarn add @akreid/ampm-timepicker
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>AmPmTimePicker</title>
  <!-- 최상위 컴포넌트만 임포트 (필요 시: :use-ampm, :interval 등 속성을 사용하여 모드 커스텀 가능) -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@akreid/ampm-timepicker@1.1.2/ampmTimepicker.js"></script>
</head>
<body>
  <!-- 사용 예시 -->
  <time-picker use-ampm="true" interval="15"></time-picker>
</body>
</html>
```

### 2. CDN 사용 (Quick Start)

HTML 파일에 `<script>` 태그를 추가하여 바로 사용할 수 있습니다. CDN을 사용할 때는 버전 번호가 포함된 파일 경로를 사용하는 것이 좋습니다.

```html
<!-- 스크립트 추가 (버전: 1.1.2) -->
<script src="https://cdn.jsdelivr.net/npm/@akreid/ampm-timepicker@1.1.2/ampmTimepicker.js"></script>

<!-- 기본 사용 -->
<time-picker></time-picker>
```

## ⚙️ 속성 (Attributes)

컴포넌트 태그에 속성(Attribute)을 추가하여 피커의 동작 및 표시 형식을 제어할 수 있습니다.

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `use-ampm` | `boolean` | `false` | `true`로 설정 시 AM/PM 12시간제로 동작합니다. (미설정 시 24시간제) |
| `interval` | `number` | `1` | 분 단위 선택 간격을 설정합니다. (예: `5`, `10`, `15`) |
| `start-time` | `string` | `00:00` | 선택 가능한 최소 시간 (형식: `HH:mm`, 24시간제 기준) |
| `end-time` | `string` | `23:59` | 선택 가능한 최대 시간 (형식: `HH:mm`, 24시간제 기준) |
| `margin-right`| `string` | `0px` | 우측 여백을 설정합니다. (예: `10px`) |
| `hour-label` | `string` | `null` | 드롭다운의 시간(Hour) 컬럼 상단에 표시될 라벨 |
| `min-label` | `string` | `null` | 드롭다운의 분(Minute) 컬럼 상단에 표시될 라벨 |
| `ampm-label` | `string` | `null` | 드롭다운의 AM/PM 컬럼 상단에 표시될 라벨 |
| `disabled` | `boolean`| `false` | `true`로 설정 시 컴포넌트가 비활성화되고 조작할 수 없습니다. |
| `readonly` | `boolean`| `false` | `true`로 설정 시 값을 변경할 수 없는 읽기 전용 상태가 됩니다. |
| `required` | `boolean`| `false` | `true`로 설정 시 폼 전송 전에 반드시 값이 입력되어야 합니다. |
| `name` | `string` | `null` | 폼 전송 시 데이터 식별에 사용될 요소의 이름 |
| `value` | `string` | `null` | 초기 설정 시간 값 (형식: `HH:mm`) |

### HTML 작성 예시
```html
<time-picker 
  use-ampm="true" 
  interval="10" 
  start-time="09:00" 
  end-time="18:30" 
  hour-label="시" 
  min-label="분" 
  ampm-label="오전/오후"
  margin-right="8px">
</time-picker>
```

## 🎨 CSS 변수 (Custom Properties)

컴포넌트 내부(Shadow DOM)의 외형은 CSS 변수를 통해 외부에서 커스터마이징 가능합니다.

| 변수명 | 기본값 | 설명 |
|---|---|---|
| `--width` | `165px` | 폼의 전체 너비 |
| `--height` | `42px` | 폼의 전체 높이 |
| `--border-radius`| `8px` | 전체 모서리 둥글기 반경 |
| `--bg-color` | `#fff` | 컴포넌트 배경색 |
| `--font-color` | `#333` | 텍스트 색상 |
| `--primary-color`| `#007bff` | 포커스 시 외곽선 및 활성화된 목록 색상 |
| `--border-color` | `#ddd` | 테두리 선 색상 |
| `--bg-hover` | `#f1f7ff` | 목록 아이템 호버 및 활성화 시 배경색 |
| `--invalid-color` | `#dc3545` | 필수 값 누락 등 폼 검증 실패(invalid) 시 테두리 및 포커스 색상 |
| `--toggle-border-left` | `1px solid var(--border-color)` | 토글 버튼의 왼쪽 테두리 선 |
| `--toggle-icon-url` | `none` | 우측 토글 버튼 아이콘 이미지 (`url('...')` 형식) |
| `--toggle-icon-size`| `16px` | 토글 아이콘 크기 |

### CSS 적용 예시
```css
/* 스타일 시트에서 전역 또는 특정 클래스에 정의 */
time-picker {
  --primary-color: #ff5722;
  --bg-color: #f9f9f9;
  --border-radius: 4px;
  --toggle-icon-url: url('../images/icon_clock.svg');
}
```

## 💻 JavaScript API

### 1. 속성 및 값 (Properties)
`value` 프로퍼티를 통해 선택된 시간을 가져오거나 동적으로 변경할 수 있습니다. 
> 💡 **참고**: 값의 입출력 형식은 항상 24시간제 `HH:mm` 문자열입니다.

```javascript
const picker = document.querySelector('time-picker');

// 값 설정하기
picker.value = '14:30'; 

// 설정된 값 가져오기
console.log(picker.value); // "14:30"
```

### 2. 이벤트 (Events)
시간이 변경될 때마다 `change` 이벤트가 발생합니다. `e.detail.value`에서 선택된 값을 확인할 수 있습니다.

```javascript
const picker = document.querySelector('time-picker');

picker.addEventListener('change', (e) => {
  const selectedTime = e.detail.value;
  console.log('선택된 시간:', selectedTime); // 예: "09:00"
});
```

### 3. Form 연동 (Form Integration)
`ElementInternals` API를 지원하여, 네이티브 `<input>` 요소처럼 `<form>` 태그 내에서 사용할 수 있습니다.

```html
<form id="scheduleForm">
  <time-picker name="setTime"></time-picker>
  <time-picker name="startTime" start-time="08:30" value="09:00" interval="10"></time-picker>
</form>

<script>
  const scheduleForm = document.getElementById('scheduleForm');
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // FormData API를 사용하여 간편하게 값을 추출할 수 있습니다.
    const formData = new FormData(scheduleForm);
    const setTime = formData.get('setTime');
    const startTime = formData.get('startTime');
    
    alert(`선택 시간 : ${setTime}\n\n 출근 시간: ${startTime}`);

    // (참고) fetch나 axios로 서버에 전송할 때:
    // axios.post('/api/save', Object.fromEntries(formData));
  });
</script>
```

## ⌨️ 접근성 및 편의 기능 (UX)
이 컴포넌트는 마우스 뿐만 아니라, 키보드만으로도 모든 조작이 가능하도록 설계되었습니다.

- **스마트 타이핑 입력**: 입력 칸에 숫자를 타이핑하면 지정된 포맷으로 자동 보정됩니다.
- **방향키 이동 (Input)**: 입력 포커스 상태에서 `↑`(위 화살표) / `↓`(아래 화살표) 키를 눌러 시간을 `interval` 단위로 증감할 수 있습니다.
- **드롭다운 네비게이션**: 
  - 드롭다운이 열린 상태에서 `←` / `→` 키를 통해 AM/PM, 시간, 분 컬럼 간 포커스를 전환할 수 있습니다.
  - 각 컬럼 내에서 `↑` / `↓` 키로 값을 탐색합니다.
- **Tab 포커스 이동 제어**: 드롭다운 내에서 `Tab` 키를 누르면 다음 요소로 자연스럽게 이동하며, 브라우저 주소창으로 튕기는 현상(Shadow DOM 포커스 트랩 이슈)을 방지하는 로직이 적용되어 있습니다.
- **화면 스크롤 연동**: 드롭다운이 열려 있을 때 브라우저 화면을 스크롤하면 자동으로 닫히며 현재 값이 확정(Commit)됩니다.

## 📝 변경 이력 (Changelog)
각 릴리즈별 자세한 변경 사항은 [CHANGELOG.md](./CHANGELOG.md) 파일에서 확인하실 수 있습니다.
