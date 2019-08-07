# pyZX + Qentiana = zxQentiana

[![Unitary Fund](https://img.shields.io/badge/Supported%20By-UNITARY%20FUND-brightgreen.svg?style=for-the-badge)](http://unitary.fund)

Browser based tool for resource estimating quantum circuits (processed by pyZX). It is a Pyodide compilation of Qentiana (from OpenSurgery) and PyZX. The current version can:
- Visualise zx diagrams
- (Manipulate zx diagrams)
- Resource estimate with different scenarios (error rate, cycle time)
- Plot comparisons between estimation scenarios
- (Download CSV data)

<a href="https://docs.google.com/presentation/d/e/2PACX-1vQ3ikcnnLrruod0jHAHC5e-jBfwnwE07iwuUVT642E44odPCaa626p1jrFPPDV1ZJhOSM4y2R3dZjfR/pub?start=true&loop=false&delayms=5000&slide=id.g5b51ccc5bf_1_14" target="_blank">See a presentation of zxQentiana here</a>

Each individual project can be found on their respective github repositories:

- PyZX: [Github](https://github.com/Quantomatic/pyzx) [Demo](http://zxcalculus.com/pyzx.html)
- Qentiana: [Github](https://github.com/herr-d/qentiana) [Website](https://herr-d.github.io/qentiana/)
- OpenSurgery: [Github](https://github.com/alexandrupaler/opensurgery) [Website](https://alexandrupaler.github.io/opensurgery)

The calculations are performed inside the browser without the need to install Python or use a server that runs Python. This is enabled by the Pyodide package that brings the python scientific stack to the browser [see Github](https://github.com/iodide-project/pyodide).

## Installation
For compilation and development the following packages are required:

- python 3
- wget
- git
- pyodide (will be downloaded by the Makefile)

Pyodide is used in two forms:
- source code from [Github](git@github.com:iodide-project/pyodide.git)
- built version that is automatically downloade by our Makefile

Edit PYODIDE_PATH from the Makefile.globals.mk to the path where the git repo was cloned. Prefer absolute path.

The Makefile automatically downloads the remaining dependencies and creates the folder 'website_files' that needs to be hostet on a website:
```
make
```

## Testing the website

A small script is provided to test the website locally. With the following command a simple webserver is created.

```
make serve
```

The website can be accessed locally through the browser at:
```
localhost:8000
```
