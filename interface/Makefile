include ../Makefile.globals.mk

.PHONY: all clean
all: interface.js

interface.js: interface.py
	${PYTHON} ${PYODIDE_PATH}/tools/file_packager.py interface.data --preload interface.py@/lib/python3.7/site-packages/ --abi=1 --export-name=pyodide._module --js-output=interface.js --exclude __pycache__ --use-preload-plugins

clean:
	rm *.js *.data
