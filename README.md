# Dart Barrel Export File Generator

[VS Code Extension](https://marketplace.visualstudio.com/items?itemName=orestesgaolin.dart-export-index)

## Features

![Usage](./screenshots/usage.png)

This extension adds following commands:

- Export Dart files in current directory to index.dart
  - will create `index.dart` file exporting all the Dart files in the current directory
- Export all Dart files in current directory and below to index.dart
  - Same as the command above, but includes dart files of directories below the current one.
- Export Dart files in current directory to dir_name.dart
  - will create `current_dir_name.dart` file exporting all the Dart files in the current directory e.g. `widgets.dart` if run within _widgets_ directory
- Export all Dart files in current directory and below to dir_name.dart
  - Same as the command above, but includes dart files of directories below the current one.
- Export (add) current Dart file to `index.dart`
  - will add current file to index.dart in the current directory
- Export (add) current Dart file to `dir_name.dart`
  - will add current file to `current_dir_name.dart` in the current directory

## Source

Source code available on [GitHub](https://github.com/orestesgaolin/create-index).

This is a fork of [create-index](https://github.com/tsugitta/create-index).
