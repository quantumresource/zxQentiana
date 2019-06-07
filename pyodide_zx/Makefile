.PHONY: all clean
all: pyzx.js

pyzx:
	git clone git@github.com:Quantomatic/pyzx.git

pyzx.js: pyzx
	${PYTHON} ${PYODIDE_PATH}/tools/file_packager.py pyzx.data --preload pyzx/pyzx@/lib/python3.7/site-packages/pyzx --abi=1 --export-name=pyodide._module --js-output=pyzx.js --exclude __pycache__ --use-preload-plugins

clean:
	rm pyzx -r
	rm *.js *.data
