.PHONY: all clean
all: cube_to_physical.js

cube_to_physical.py:
	wget https://raw.githubusercontent.com/alexandrupaler/opensurgery/master/cube_to_physical.py

cube_to_physical.js: cube_to_physical.py
	${PYTHON} ${PYODIDE_PATH}/tools/file_packager.py cube_to_physical.data --preload cube_to_physical.py@/lib/python3.7/site-packages/ --abi=1 --export-name=pyodide._module --js-output=cube_to_physical.js --exclude __pycache__ --use-preload-plugins

clean:
	rm *.js *.data
