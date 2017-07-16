# vscode-pynsist

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/release/idleberg/vscode-pynsist.svg?style=flat-square)](https://github.com/idleberg/vscode-pynsist/releases)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs-short/idleberg.pynsist.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=idleberg.pynsist)
[![Travis](https://img.shields.io/travis/idleberg/vscode-pynsist.svg?style=flat-square)](https://travis-ci.org/idleberg/vscode-pynsist)
[![David](https://img.shields.io/david/dev/idleberg/vscode-pynsist.svg?style=flat-square)](https://david-dm.org/idleberg/vscode-pynsist?type=dev)

Language support, snippets and build-system for [pynsist](https://pypi.python.org/pypi/pynsist), a tool to build Windows installers for your Python applications

## Installation

### Extension Marketplace

Launch Quick Open, paste the following command, and press <kbd>Enter</kbd>

`ext install pynsist`

### Packaged Extension

Download the package extension from the the [release page](https://github.com/idleberg/vscode-pynsist/releases) and install it from the command-line:

```bash
$ code --install-extension pynsist-*.vsix
```

### Clone Repository

Change to your Visual Studio Code extensions directory:

```bash
# Windows
$ cd %USERPROFILE%\.vscode\extensions

# Linux & macOS
$ cd ~/.vscode/extensions/
```

Clone repository as `pynsist`:

```bash
$ git clone https://github.com/idleberg/vscode-pynsist pynsist
```

## Usage

### Snippets

This package provides snippets to create sections and settings inside your `installer.cfg`, as well as all supported NSIS variables.

### Building

Before you can build, make sure `pynsist` and `makensis` are in your PATH [environmental variable](https://support.microsoft.com/en-us/kb/310519). Alternatively, you can specify the path to `pynsist` in your [user settings](https://code.visualstudio.com/docs/customization/userandworkspace).

Once setup, you can make use of the two commands provided by this package:

- `pynsist: Generate Script` - generates an NSIS script from your `installer.cfg`
- `pynsist: Compile Installer` - generates an NSIS script and compiles it

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/vscode-applescript) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
