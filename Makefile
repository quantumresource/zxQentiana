include Makefile.globals.mk

# from where should the pyodide build be downloaded?
PYODIDE_COMPILED = https://github.com/iodide-project/pyodide/releases/download/0.13.0/pyodide-build-0.13.0.tar.bz2
# to which directory should it be saved?
PYODIDE_BUILD = pyodide_build
# File name of Pyodide distro to save to
PYODIDE_FILE_NAME = pyodide_build.tar.bz2

# The directory where pyZX should be downloaded and compiled
PYODIDE_ZX_PATH = pyodide_zx

# The directory where Qentiana should be downloaded
QENTIANA_PATH = qentiana

# The path where the compiled/transpiled code should be copied
# For the moment I am not using the entire Pyodide stack in order to speed up loading times
# This path is also used in index.html for loading pyodide and the libraries
SITEFILES_PATH = githubiofiles

.PHONY: all clean serve pyzx package qentiana #interface

#all: githubiofiles/packages.json pyodide_build/pyodide.js pyodide_zx/pyzx.data qentiana/cube_to_physical.js
all: pyzx qentiana package | ${PYODIDE_BUILD}

# packages: pyodide_build/pyodide.js ${PYODIDE_ZX_PATH}/pyzx.% ${QENTIANA_PATH}/cube_to_physical.% interface/interface.%
package: ${PYODIDE_ZX_PATH}/pyzx.% ${QENTIANA_PATH}/cube_to_physical.% #interface/interface.%
	# mkdir -p website_files
	# The packaging is not completely solved. Comment the next two line...
	# mkdir -p ${SITEFILES_PATH}
	# cp pyodide_build/* ${SITEFILES_PATH}
	#
	# cp pyodide_zx/pyzx.data pyodide_zx/pyzx.js website_files
	# cp qentiana_build/cube_to_physical.js qentiana_build/cube_to_physical.data website_files
	# cp interface/packages.json interface/interface.js interface/interface.data website_files
	#
${PYODIDE_ZX_PATH}/pyzx.% :
	# Copy the new pyZX
	cp ${PYODIDE_ZX_PATH}/pyzx.data ${PYODIDE_ZX_PATH}/pyzx.js ${SITEFILES_PATH}

${QENTIANA_PATH}/cube_to_physical.%	:
# Copy the new Qentiana
	cp ${QENTIANA_PATH}/cube_to_physical.js ${QENTIANA_PATH}/cube_to_physical.data ${SITEFILES_PATH}

# interface/interface.% :
# 	cp interface/packages.json interface/interface.js interface/interface.data ${SITEFILES_PATH}


pyzx: ${PYODIDE_ZX_PATH}
	$(MAKE) -I ${PWD} -C ${PYODIDE_ZX_PATH}

${PYODIDE_BUILD}:
	mkdir -p ${PYODIDE_BUILD}
	wget $(PYODIDE_COMPILED) --output-document ${PYODIDE_FILE_NAME}
	tar -C ${PYODIDE_BUILD}/ -xvf ${PYODIDE_FILE_NAME}
	rm ${PYODIDE_FILE_NAME}


qentiana:
	$(MAKE) -I ${PWD} -C ${QENTIANA_PATH}


# interface:
# 	$(MAKE) -I ${PWD} -C interface

serve:
	$(PYTHON) run_website.py

clean:
	$(MAKE) -I . -C ${PYODIDE_ZX_PATH} clean
	$(MAKE) -I . -C ${QENTIANA_PATH} clean
	$(MAKE) -I . -C interface clean
	#rm -r pyodide_build website_files