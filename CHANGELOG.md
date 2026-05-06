# Changelog

All notable changes to this project will be documented in this file.

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
