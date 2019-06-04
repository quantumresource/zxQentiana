# pyZX + Qentiana = zxQentiana

Browser based tool for resource estimating quantum circuits processed by pyZX

- Visualise zx diagrams
- (Manipulate zx diagrams)
- Resource estimate with different scenarios (error rate, cycle time)
- Plot comparisons between estimation scenarios
- Download CSV data

<a href="https://docs.google.com/presentation/d/e/2PACX-1vQ3ikcnnLrruod0jHAHC5e-jBfwnwE07iwuUVT642E44odPCaa626p1jrFPPDV1ZJhOSM4y2R3dZjfR/pub?start=true&loop=true&delayms=10000" target="_blank">See a presentation of zxQentiana here</a>

Each individual project can be found on their respective github repositories:

- PyZX: [Github](https://github.com/Quantomatic/pyzx) [Demo](http://zxcalculus.com/pyzx.html)
- Qentiana: [Github](https://github.com/herr-d/qentiana) [Website](https://herr-d.github.io/qentiana/)

The calculations are performed inside the browser without the need to install python or use a server that runs python. This is enabled by the Pyodide package that bring the python scientific stack to the browser [see Github](https://github.com/iodide-project/pyodide).

## Installation
For compilation and development the following packages are required:

- python 3
- wget
- git
- pyodide (halfway compiled): The address in the makefile needs to be adjusted to point to the pyodide directory. Get it from [Github](git@github.com:iodide-project/pyodide.git)

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
