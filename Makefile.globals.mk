ifneq ($(PYTHON),"python3")
	# needs to be the command for the Python3 interpreter
	# python 2 is not supported
	export PYTHON = python3
endif

ifndef PYODIDE_PATH
	# Either absolute path or relative path with additional ../ because it is called in a subdirectory
	# The path to the local git repo of pyodide.
	# We do not compile it, but use tools from the repo. The compiled version is downloaded.
	export PYODIDE_PATH = /home/alexandru/pyodide
endif