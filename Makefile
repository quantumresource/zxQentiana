# needs to be the command for the python 3 interpreter
# python 2 is not supported
export PYTHON = python3

# either absolute path or relative path with additional ../ because it is called in a subdirectory
# the path to the local git repo of pyodide
# we do not compile it, but use tools from the repo
# the compiled version is downloaded...see belowa
export PYODIDE_PATH = /home/alexandru/pyodide

# from where should the pyodide build be downloaded?
export PYODIDE_BUILD = https://github.com/iodide-project/pyodide/releases/download/0.13.0/pyodide-build-0.13.0.tar.bz2


.PHONY: all clean serve pyodide_zx

all: website_files/packages.json pyodide_build/pyodide.js pyodide_zx/pyzx.data


website_files/packages.json: pyodide_build/pyodide.js pyodide_zx/pyzx.data qentiana_build/cube_to_physical.js interface/interface.js
	mkdir -p website_files
	cp pyodide_build/* website_files
	cp pyodide_zx/pyzx.data pyodide_zx/pyzx.js website_files
	cp qentiana_build/cube_to_physical.js qentiana_build/cube_to_physical.data website_files
	cp interface/packages.json interface/interface.js interface/interface.data website_files


pyodide_zx/pyzx.data: pyodide_zx/Makefile
	$(MAKE) -C pyodide_zx

pyodide_build/pyodide.js:
	mkdir -p pyodide_build
	# if wget fails, the download should be rm-ed
	wget $(PYODIDE_BUILD) --output-document pyodide_build.tar.bz2
	#if [ $? -ne 0 ]
  	#	then echo "--> Wget failed"
  	#	else echo "--> Wget OK"
	#fi

	tar -C pyodide_build/ -xvf pyodide_build.tar.bz2
	rm pyodide_build.tar.bz2

qentiana_build/cube_to_physical.js: qentiana_build/Makefile
	$(MAKE) -C qentiana_build


interface/interface.js: interface/Makefile interface/packages.json
	$(MAKE) -C interface

serve:
	$(PYTHON) run_website.py

clean:
	$(MAKE) -C pyodide_zx clean
	$(MAKE) -C qentiana_build clean
	$(MAKE) -C interface clean
	rm -r pyodide_build website_files
