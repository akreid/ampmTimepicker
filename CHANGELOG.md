# Changelog

All notable changes to this project will be documented in this file.

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
