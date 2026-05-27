# Changelog

All notable changes to this project will be documented in this file.

## [1.2.6] - 2026-05-27

### Added
- **Batch Configuration Example**: Added documentation and a demo for configuring multiple timepickers globally using JavaScript while allowing per-element overrides.
- **i18n Validation**: The `required` state validation message now automatically uses the browser's native localized string (e.g., "Please fill out this field." or "이 입력란을 작성하세요.") instead of a hardcoded Korean string.
- **Custom Validation Message**: Added the `required-message` attribute to allow developers to set a custom error message for the `required` state.

## [1.2.5] - 2026-05-18

### Added
- **Reactive Attributes**: Added dynamic reactivity for `start-time` and `end-time` attributes. Modifying these attributes via JavaScript now immediately recalculates time boundaries and updates the dropdown state if it is currently open. Ideal for "Start Time to End Time" paired pickers.

### Changed
- **Performance Optimization (AdoptedStyleSheets)**: Migrated internal style injection from per-instance `<style>` tags to `CSSStyleSheet` objects shared at the class level via `adoptedStyleSheets`. All instances of `<time-picker>` now share a single host stylesheet and a single dropdown stylesheet, eliminating redundant CSS parsing and significantly reducing memory usage when multiple pickers are present on a page.
- **Accessibility**: Added `aria-hidden="true"` to the internal `#color-resolver` div to prevent screen readers from encountering the invisible helper element.


## [1.2.4] - 2026-05-13

### Fixed
- **CSS Specificity Overhaul**: Completely refactored internal styling logic for component states (`disabled`, `readonly`, `invalid`, `hide-button`). All hardcoded internal selectors were wrapped with `:where()` to lower their CSS specificity to `0`. This allows developers to effortlessly override any state styling using standard `::part()` selectors without needing `!important`.
- **Documentation & Demo**: Fixed a visual inconsistency in `index.html` where the "Disabled State Direct Override" demo was displaying the default gray background instead of the described warning yellow due to CSS specificity issues. Restored missing CSS and removed now-unnecessary `!important` tags thanks to the specificity overhaul.


## [1.2.3] - 2026-05-13

### Fixed
- **Documentation**: Fixed incorrect CDN version numbers in `README.md` and `README_KR.md` HTML snippet comments.


## [1.2.2] - 2026-05-13

### Added
- **Scoped Dropdown Styling**: Implemented the `dropdown-class` attribute to safely inject custom classes directly into the dynamically appended dropdown, enabling isolated styling without global layout class interference.
- **Framework Auto-scoping**: Added automatic synchronization of all `data-*` attributes from the `<time-picker>` element to the dropdown. This provides out-of-the-box, seamless support for scoped CSS in modern frameworks like Vue and Svelte (`<style scoped>`) without requiring any manual configuration.


### Changed
- **Mobile Touch Optimization**: The virtual keyboard is now automatically disabled (`inputmode="none"`) on touch devices to improve user experience, allowing the dropdown UI to be used comfortably without the screen being obscured by the keyboard.
- **Hide Button Attribute**: Added a new `hide-button` boolean attribute that allows developers to completely hide the right toggle icon, leaving only the input area.
- **CSS Specificity Optimization**: Lowered the CSS specificity of the internal dropdown styles by wrapping selectors in `:where()`. Migrated static inline styles to the internal `<style>` block and dynamic box-shadows to CSS variables (`--local-box-shadow`). This enables users to easily override styles using standard CSS classes (e.g., `.ampm-timepicker-dropdown .ampm-item`) without needing `!important`.
- **CSS Architecture Optimization**: Streamlined the component's base CSS variables by deprecating hyper-specific variables (e.g., `--ampm-disabled-bg`, `--ampm-readonly-bg`) and replacing them with intelligent `color-mix()` functions. This automatically calculates harmonious background colors for disabled and readonly states based on the active theme, without requiring manual configuration. (Fallback support for deprecated variables is fully retained).

### Fixed
- **Mobile Keyboard Scroll**: Fixed an issue where the dropdown would immediately close on mobile devices because focusing the input triggered a browser auto-scroll (e.g., to make room for the virtual keyboard).
- **Scroll Bleeding**: Fixed an issue where scrolling with the mouse wheel inside the dropdown would cause the outer parent page to scroll when reaching the top or bottom boundaries.
- **Dropdown Overflow**: Fixed an issue where the dropdown would be cut off on the right side of the screen if the timepicker was positioned too close to the right window edge.


## [1.2.1] - 2026-05-08

### Fixed
- **Memory Leak**: Fixed an issue where the `mousedown` event listener for closing the dropdown was never removed upon component disconnection.
- **Global Style Collision**: Prefixed all generic class names inside the globally appended dropdown (`.item`, `.header`, `.column`, `.hidden`, etc.) with `ampm-` to strictly prevent the user's global CSS styles from bleeding in and breaking the dropdown UI.

## [1.2.0] - 2026-05-08

### Added
- **Automatic Dark Mode Support**: The timepicker now automatically adapts to the OS and browser theme using `prefers-color-scheme` and system CSS colors (`Field`, `Canvas`, etc.).
- **Extended CSS Variables**: Exposed new CSS variables for controlling `disabled` & `readonly` states (`--ampm-disabled-bg`, etc.) and comprehensive styling of the dropdown internals (`--ampm-dropdown-header-bg`, `--ampm-dropdown-divider-color`, etc.).
- **CSS Shadow Parts (`::part`)**: Added `part="container"`, `part="input"`, and `part="toggle-btn"` to allow fine-grained styling of the component's internal elements.
- **Global Dropdown Class**: Added the `.ampm-timepicker-dropdown` class to the body-appended dropdown to allow users to fully customize the dropdown menu via global CSS.

### Changed
- **Native Accent Colors**: `--ampm-primary-color` now uses the `AccentColor` CSS system keyword by default to flawlessly match the user's OS or browser theme color (with fallback support for older browsers).
- **Refined UI & Styling**:
  - Replaced translucent `disabled` and `readonly` background defaults with solid colors (`#ddd`, `#f0f0f0`) to prevent visual bleed-through issues when combined with component opacity.
  - Polished dropdown aesthetics by removing vertical dividers from the header row, and utilizing `color-mix` to apply a 50% opacity to scroll area dividers for a softer, premium look.
  - Reduced header font size for a more professional hierarchy.
- **Robust Dropdown Theme Sync**: Implemented a Shadow DOM color resolver to guarantee that complex CSS variable chains set on the host element perfectly compute and apply to the body-appended dropdown.
- **CSS Variable Names**: Updated CSS variables to use the `--ampm-` prefix (e.g., `--ampm-bg-color`) to prevent conflicts with global styles. Older variable names are still supported as fallbacks for full backward compatibility.
- **Font Inheritance**: Changed `font-family` and `color` to `inherit` to blend seamlessly with the parent container's styling.

### Fixed
- **Global Style Bleeding**: Fixed a critical bug where generic class names inside the dropdown (`.item`, `.column`, `.hidden`) were leaking into the global `document.body` scope, potentially overriding the user's website styles. All dropdown styles are now strictly scoped.

## [1.1.3] - 2026-05-06

### Added
- **Multilingual Documentation**: Renamed the Korean documentation to [README_KR.md](./README_KR.md) and added cross-links between the English and Korean versions for better accessibility.

### Changed
- **Chronological Time Sorting**: Updated the AM/PM hour dropdown sequence to list from `12` then `01` to `11` instead of `01` to `12`, reflecting standard chronological order.
- **Repository Optimization**: Updated `.gitignore` and `.npmignore` to properly include/exclude documentation and configuration files.
- **Demo Polish**: Fixed typos and improved the script examples in `index.html`.

## [1.1.2] - 2026-05-04

### Changed
- **Documentation Update**: Added `--invalid-color` and `--toggle-border-left` to the CSS Custom Properties documentation.

## [1.1.1] - 2026-05-04

### Fixed
- **Links Update**: Fixed incorrect demo and homepage URLs in `package.json` and `README.md` to match the actual GitHub Pages address.

## [1.1.0] - 2026-05-04

### Added
- **State Control Attributes**: Added support for `readonly`, `required`, and `disabled` attributes. The timepicker can now be controlled using standard HTML attributes just like a native form input.
- **Form Integration**: Implemented `ElementInternals` to make the component a true Form-associated Custom Element. The timepicker can now be seamlessly integrated into a native `<form>`, automatically supports `FormData` submission, and participates in standard browser form validation.

### Fixed
- **12-Hour Format AM/PM Selection Bug**: Fixed an issue where clicking the AM/PM toggle in the 12-hour format would prematurely close the timepicker and complete the selection. The dropdown now correctly stays open when toggling AM/PM, waiting for the user to explicitly confirm or click away.