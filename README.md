# vscode-pynsist

[![The MIT License](https://flat.badgen.net/badge/license/MIT/orange)](http://opensource.org/licenses/MIT)
[![GitHub](https://flat.badgen.net/github/release/idleberg/vscode-pynsist)](https://github.com/idleberg/vscode-pynsist/releases)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs-short/idleberg.pynsist.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=idleberg.pynsist)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/vscode-pynsist)](https://circleci.com/gh/idleberg/vscode-pynsist)
[![David](https://flat.badgen.net/david/dep/idleberg/vscode-pynsist)](https://david-dm.org/idleberg/vscode-pynsist)

Language support, snippets and build-system for [pynsist](https://pypi.python.org/pypi/pynsist), a tool to build Windows installers for your Python applications

![Screenshot](https://raw.github.com/idleberg/vscode-pynsist/master/screenshot.gif)

*See Pynsist in action*

## Installation

### Extension Marketplace

Launch Quick Open, paste the following command, and press <kbd>Enter</kbd>

`ext install idleberg.pynsist`

### CLI

With [shell commands](https://code.visualstudio.com/docs/editor/command-line) installed, you can use the following command to install the extension:

`$ code --install-extension idleberg.pynsist`

### Packaged Extension

Download the packaged extension from the the [release page](https://github.com/idleberg/vscode-pynsist/releases) and install it from the command-line:

```bash
$ code --install-extension path/to/pynsist-*.vsix
```

Alternatively, you can download the packaged extension from the [Open VSX Registry](https://open-vsx.org/) or install it using the [`ovsx`](https://www.npmjs.com/package/ovsx) command-line tool:

```bash
$ ovsx get idleberg.pynsist
```

### Clone Repository

Change to your Visual Studio Code extensions directory:

```powershell
# Windows Powershell
cd $Env:USERPROFILES\.vscode\extensions

# Windows Command Prompt
$ cd %USERPROFILE%\.vscode\extensions
```

```bash
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

Before you can build, make sure `pynsist` and `makensis` are in your PATH [environment variable](http://superuser.com/a/284351/195953). Alternatively, you can specify the path to `pynsist` in your [user settings](https://code.visualstudio.com/docs/customization/userandworkspace).

Once set up, you can make use of the commands provided by this package:

- `pynsist: Generate Script` - generates an NSIS script from your `installer.cfg`
- `pynsist: Compile Installer` - generates an NSIS script and compiles it
- `pynsist: Create Build Task` - create build task for the built-in Task Runner

## Related

- [atom-pynsist](https://atom.io/packages/pynsist)
- [sublime-pynsist](https://packagecontrol.io/packages/Pynsist)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
