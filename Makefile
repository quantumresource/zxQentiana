export PYTHON = python3

# either absolute path or relative path with additional ../ because it is called in a subdirectory
export PYODIDE_PATH = ../../pyodide


.PHONY: all clean serve pyodide_zx

all: pyodide/pyodide.js pyodide_zx

pyodide_zx:
	$(MAKE) -C pyodide_zx

pyodide-build-0.12.0.tar.bz2:
	wget https://github.com/iodide-project/pyodide/releases/download/0.12.0/pyodide-build-0.12.0.tar.bz2

pyodide/pyodide.js: pyodide-build-0.12.0.tar.bz2
	mkdir -p pyodide
	tar -C pyodide/ -xvf pyodide-build-0.12.0.tar.bz2

serve:
	$(PYTHON) -m http.server

clean:
	rm -r pyodide-build-0.12.0.tar.bz2 pyodide
	$(MAKE) -C pyodide_zx clean
