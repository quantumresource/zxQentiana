# the variables are from the Makefile in the parent folder
# see -I parameter to make
include Makefile.globals.mk

.PHONY: all compile clean

# The name of the directory where repo is downloaded is the name of the repo
STORE_FOLDER = pyzx

# The compilation name
COMPILE_NAME = pyzx

all: compile

# compile: | ${STORE_FOLDER}
compile: ${STORE_FOLDER}
	${PYTHON} ${PYODIDE_PATH}/tools/file_packager.py ${COMPILE_NAME}.data --js-output=${COMPILE_NAME}.js --preload ${STORE_FOLDER}/pyzx@/lib/python3.7/site-packages/pyzx --abi=1 --export-name=pyodide._module --exclude __pycache__ --use-preload-plugins

${STORE_FOLDER}:
	#git clone git@github.com:Quantomatic/pyzx.git
	git clone https://github.com/Quantomatic/pyzx.git

clean:
	rm -rf ${STORE_FOLDER}
	rm ${COMPILE_NAME}.js ${COMPILE_NAME}.data