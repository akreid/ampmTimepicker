> **Note**: This document has been translated using AI.

# `ampmTimepicker.js` Usage Guide

[🇰🇷 한국어 버전](./README_KR.md)

[![npm version](https://img.shields.io/npm/v/@akreid/ampm-timepicker.svg?style=flat-square)](https://www.npmjs.com/package/@akreid/ampm-timepicker)
[![npm downloads](https://img.shields.io/npm/dm/@akreid/ampm-timepicker.svg?style=flat-square)](https://www.npmjs.com/package/@akreid/ampm-timepicker)

> ⚠️ **v1.2.0 Update Notice (Styling Changes)**<br>
> Starting from this update, the component now inherits fonts and colors from its parent element and supports automatic dark mode. As a result, its appearance might look slightly different when updating from older versions. However, it will now blend much more naturally with your default website styles without requiring manual CSS tweaks.

`<time-picker>` is a **zero-dependency, vanilla JavaScript** timepicker implemented as a native Custom Web Component. It works seamlessly in any environment **without frameworks like React or Vue.** It supports both AM/PM 12-hour and 24-hour formats and includes an intuitive UI with built-in keyboard accessibility (arrow keys and tab navigation).

## Demo
https://akreid.github.io/ampmTimepicker/

![AmPmTimePicker Demo](./capture.gif)

### 1. Using ES Module (Recommended)

If your project supports ES modules, it's best to install it via npm and import it.

```bash
# Install via npm
npm install @akreid/ampm-timepicker
# or via yarn
yarn add @akreid/ampm-timepicker
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>AmPmTimePicker Demo</title>
  <!-- Import the component as a module -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@akreid/ampm-timepicker@1.1.3/ampmTimepicker.js"></script>
</head>
<body>
  <!-- Usage example -->
  <time-picker use-ampm="true" interval="15"></time-picker>
</body>
</html>
```

### 2. Using CDN (Quick Start)

You can use it immediately by adding a `<script>` tag to your HTML file. It is recommended to use a file path that includes the version number.

```html
<!-- Include script (Version: 1.1.3) -->
<script src="https://cdn.jsdelivr.net/npm/@akreid/ampm-timepicker@1.1.3/ampmTimepicker.js"></script>

<!-- Basic usage -->
<time-picker></time-picker>
```

## ⚙️ Attributes

You can control the picker's behavior and display format by adding attributes to the component tag.

| Attribute | Type | Default | Description |
|---|---|---|---|
| `use-ampm` | `boolean` | `false` | When set to `true`, it operates in an AM/PM 12-hour format. (Defaults to 24-hour format if not set) |
| `interval` | `number` | `1` | Sets the minute selection interval. (e.g., `5`, `10`, `15`) |
| `start-time` | `string` | `00:00` | The minimum selectable time (Format: `HH:mm`, based on 24-hour format) |
| `end-time` | `string` | `23:59` | The maximum selectable time (Format: `HH:mm`, based on 24-hour format) |
| `margin-right`| `string` | `0px` | Sets the right margin. (e.g., `10px`) |
| `hour-label` | `string` | `null` | The label displayed at the top of the Hour column in the dropdown |
| `min-label` | `string` | `null` | The label displayed at the top of the Minute column in the dropdown |
| `ampm-label` | `string` | `null` | The label displayed at the top of the AM/PM column in the dropdown |
| `disabled` | `boolean`| `false` | When set to `true`, the component is disabled and interaction is blocked |
| `readonly` | `boolean`| `false` | When set to `true`, the value cannot be changed by the user |
| `required` | `boolean`| `false` | When set to `true`, the field must be filled before submitting a form |
| `name` | `string` | `null` | The name of the element used for form submission |
| `value` | `string` | `null` | The initial time value (Format: `HH:mm`) |

### HTML Example
```html
<time-picker 
  use-ampm="true" 
  interval="10" 
  start-time="09:00" 
  end-time="18:30" 
  hour-label="Hour" 
  min-label="Min" 
  ampm-label="AM/PM"
  margin-right="8px">
</time-picker>
```

## 🎨 Styling & Theming

`<time-picker>` natively supports **Automatic Dark Mode** synchronized with the OS and browser settings. Its default styles adapt naturally to the parent container's theme using native CSS System Colors.

### 1. CSS Custom Properties
You can override the default colors using the following CSS variables. (Old variable names are still supported, but `--ampm-` prefix is recommended to prevent conflicts.)

| Variable Name | Default Value | Description |
|---|---|---|
| `--ampm-width` | `165px` | The total width of the input form |
| `--ampm-height` | `42px` | The total height of the input form |
| `--ampm-border-radius`| `8px` | The border-radius for all corners |
| `--ampm-bg-color` | `Field` (System Color)| Background color |
| `--ampm-font-color` | `FieldText` (System Color)| Text color |
| `--ampm-primary-color`| `#007bff` / `#4da3ff` (Dark) | Outline color on focus and active list item color |
| `--ampm-border-color` | `ButtonBorder` (System Color)| Border line color |
| `--ampm-invalid-color`| `#dc3545` | Color when the component is invalid |
| `--ampm-disabled-bg` | `#ddd` / `#444` (Dark) | Background color when disabled |
| `--ampm-disabled-opacity`| `0.6` | Opacity of the component when disabled |
| `--ampm-readonly-bg` | `#f0f0f0` / `#2a2a2a` (Dark) | Background color when readonly |
| `--ampm-dropdown-bg` | `var(--ampm-bg-color)` | Dropdown background color |
| `--ampm-dropdown-text-color`| `var(--ampm-font-color)` | Dropdown text color |
| `--ampm-dropdown-border-color`| `var(--ampm-border-color)` | Dropdown outer border color |
| `--ampm-dropdown-hover-bg` | `var(--ampm-bg-hover)` | Dropdown item hover background color |
| `--ampm-dropdown-header-bg` | `rgba(0,0,0,0.04)` | Dropdown column header background |
| `--ampm-dropdown-divider-color`| `#eee` / `#444` (Dark) | Dropdown internal column divider lines |
| `--ampm-dropdown-scrollbar-thumb`| `#ccc` / `#555` (Dark) | Dropdown scrollbar thumb color |

### 2. Internal Element Control (`::part`)
For more granular control (like paddings or font weights), use the `::part` selector.
- `part="container"`: The main wrapper container
- `part="input"`: The internal text input
- `part="toggle-btn"`: The dropdown toggle button

```css
/* Example: Change input padding and alignment */
time-picker::part(input) {
  padding-left: 20px;
  text-align: center;
}
```

### 3. Dropdown Global Styling
The dropdown list is appended to `document.body`. To style the dropdown items globally, use the `.ampm-timepicker-dropdown` class.

```css
/* Example: Change hover background color */
.ampm-timepicker-dropdown .item:hover {
  background-color: #ffcccc !important;
}
```

> **Note**: If you want to disable automatic dark mode and force a light theme, add `:root { --ampm-bg-color: #ffffff; --ampm-font-color: #333333; }` to your global stylesheet.

## 💻 JavaScript API

### 1. Properties
You can get the selected time or change it dynamically through the `value` property.
> 💡 **Note**: The input/output format of the value is always a 24-hour `HH:mm` string.

```javascript
const picker = document.querySelector('time-picker');

// Set a value
picker.value = '14:30'; 

// Get the current value
console.log(picker.value); // "14:30"
```

### 2. Events
`change` event is triggered whenever the time changes. You can check the selected value in `e.detail.value`.

```javascript
const picker = document.querySelector('time-picker');

picker.addEventListener('change', (e) => {
  const selectedTime = e.detail.value;
  console.log('Selected time:', selectedTime); // e.g., "09:00"
});
```

### 3. Form Integration
Since it supports `ElementInternals`, you can use it directly inside a `<form>` tag like a native input.

```html
<form id="scheduleForm">
  <time-picker name="setTime"></time-picker>
  <time-picker name="startTime" start-time="08:30" value="09:00" interval="10"></time-picker>
</form>

<script>
  const scheduleForm = document.getElementById('scheduleForm');
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Use the native FormData API to easily extract values
    const formData = new FormData(scheduleForm);
    const setTime = formData.get('setTime');
    const startTime = formData.get('startTime');
    
    alert(`Selected Time: ${setTime}\nStart Work: ${startTime}`);

    // Tip: When sending to a server via fetch or axios:
    // axios.post('/api/save', Object.fromEntries(formData));
  });
</script>
```

## ⌨️ Accessibility and UX
This component is designed to be fully operable using a keyboard, in addition to a mouse.

- **Smart Typing Input**: Typing numbers into the input field automatically auto-corrects to the specified format.
- **Arrow Key Navigation (Input)**: While the input is focused, pressing the `↑` (Up) or `↓` (Down) keys will increment/decrement the time by the `interval` unit.
- **Dropdown Navigation**: 
  - When the dropdown is open, pressing the `←` or `→` keys will switch focus between the AM/PM, Hour, and Minute columns.
  - Within each column, use the `↑` or `↓` keys to navigate through the values.
- **Tab Focus Control**: Pressing the `Tab` key within the dropdown smoothly moves the focus to the next element. Logic is applied to prevent the browser address bar from capturing the focus (a common Shadow DOM focus trap issue).
- **Screen Scroll Synchronization**: Scrolling the browser window while the dropdown is open will automatically close the dropdown and commit the currently selected value.

## 📝 Changelog
Detailed changes for each release are documented in the [CHANGELOG.md](./CHANGELOG.md).
