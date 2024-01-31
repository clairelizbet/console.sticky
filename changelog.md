# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com). Versions
follow the [Semantic Versioning spec](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-31

### Added

- `printSticky` (renamed for clarity and brevity; multiple presets are no longer
  supported)
- `printStyledSticky` (renamed for clarity and brevity)
- `removeSticky` (renamed for brevity)
- `getAllStickies` (renamed for brevity)
- `removeAllStickies` (renamed for brevity)

### Changed

- `StickyPreset.ImportantNotice` renamed to `StickyPreset.Notice`
- `StickyPreset.ImportantWarning` renamed to `StickyPreset.Warning`

### Deprecated

- **1.x versions of console.sticky are no longer supported**

### Removed

- `addConsoleSticky` (use `printSticky` instead)
- `addStyledConsoleSticky` (use `printStyledSticky` instead)
- `removeConsoleSticky` (use `removeSticky` instead)
- `getAllConsoleStickies` (use `getAllStickies` instead)
- `removeAllConsoleStickies` (use `removeAllStickies` instead)
- `attachConsoleSticky` (attaching to the global scope is no longer supported)
- `attachConsoleStickySync` (attaching to the global scope is no longer
  supported)

### Fixed

- Unstyled stickies are removed by `removeAllStickies` (this was not the case
  with the v1 `removeAllConsoleStickies` function due to a bug)

[2.0.0]: https://github.com/clairelizbet/console.sticky/tree/v2.0.0
