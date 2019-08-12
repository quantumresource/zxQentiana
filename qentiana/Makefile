# the variables are from the Makefile in the parent folder
# see -I parameter to make
include Makefile.globals.mk

.PHONY = all compile clean

STORE_FOLDER = pyqentiana
REPOSITORY_URL = https://raw.githubusercontent.com/alexandrupaler/opensurgery/master/resanalysis
COMPILE_NAME = pyqentiana

all: compile

compile: ${STORE_FOLDER}/%.py

${STORE_FOLDER}/%.py: | ${STORE_FOLDER}
	${PYTHON} ${PYODIDE_PATH}/tools/file_packager.py ${COMPILE_NAME}.data --js-output=${COMPILE_NAME}.js --preload ${STORE_FOLDER}@/lib/python3.7/site-packages/${STORE_FOLDER} --abi=1 --export-name=pyodide._module --exclude __pycache__ --use-preload-plugins

${STORE_FOLDER}:
	mkdir -p ${STORE_FOLDER}
	touch ${STORE_FOLDER}/__init.py__
	wget ${REPOSITORY_URL}/cube_to_physical.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/distance_bins.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/phys_qubits_vs_log_err.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/res_savings.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/res_utils.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/time_vs_space.py -P ${STORE_FOLDER}
	wget ${REPOSITORY_URL}/experiment.py -P ${STORE_FOLDER}

clean:
	# delete the downloaded py files
	rm -rf ${STORE_FOLDER}
	# delete the transpiled files
	rm ${COMPILE_NAME}.js ${COMPILE_NAME}.data