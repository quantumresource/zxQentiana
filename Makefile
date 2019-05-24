# needs to be the command for the python 3 interpreter
# python 2 is not supported
export PYTHON = python3

# either absolute path or relative path with additional ../ because it is called in a subdirectory
export PYODIDE_PATH = ../../pyodide


.PHONY: all clean serve pyodide_zx

all: website_files/packages.json pyodide_build/pyodide.js pyodide_zx/pyzx.data


website_files/packages.json: pyodide_build/pyodide.js pyodide_zx/pyzx.data
	mkdir -p website_files
	cp pyodide_build/* website_files
	cp pyodide_zx/packages.json pyodide_zx/pyzx.data pyodide_zx/pyzx.js website_files


pyodide_zx/pyzx.data: pyodide_zx/Makefile
	$(MAKE) -C pyodide_zx

pyodide_build/pyodide.js:
	wget https://github.com/iodide-project/pyodide/releases/download/0.12.0/pyodide-build-0.12.0.tar.bz2
	mkdir -p pyodide_build
	tar -C pyodide_build/ -xvf pyodide-build-0.12.0.tar.bz2
	rm pyodide-build-0.12.0.tar.bz2

serve:
	$(PYTHON) run_website.py

clean:
	$(MAKE) -C pyodide_zx clean
	rm -r pyodide_build website_files
