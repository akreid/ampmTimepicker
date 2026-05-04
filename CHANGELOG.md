# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-05-04

### Added
- **State Control Attributes**: Added support for `readonly`, `required`, and `disabled` attributes. The timepicker can now be controlled using standard HTML attributes just like a native form input.
- **Form Integration**: Implemented `ElementInternals` to make the component a true Form-associated Custom Element. The timepicker can now be seamlessly integrated into a native `<form>`, automatically supports `FormData` submission, and participates in standard browser form validation.

### Fixed
- **12-Hour Format AM/PM Selection Bug**: Fixed an issue where clicking the AM/PM toggle in the 12-hour format would prematurely close the timepicker and complete the selection. The dropdown now correctly stays open when toggling AM/PM, waiting for the user to explicitly confirm or click away.
