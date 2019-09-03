from js import document
from js import experiment
from js import update_plots
from js import plot_names

from js import my3DGraph
# from js import pyZXJS
from js import load_remote_file
from js import circuit_url_from_js
from js import fname_circuit_url_from_js

# get DOM elements
cons = document.getElementById("txt_console")
figcircuit = document.getElementById("fig_circuit")

#
# PyZX part
#
circuit = None
if circuit_url_from_js != "random":
    load_and_save_file(circuit_url_from_js, fname_circuit_url_from_js)
    #open and read the file after the appending:
    circuit = zx.Circuit.load(fname_circuit_url_from_js).to_graph()
else:
    #Generate random circuit of Clifford gates
    qubit_amount = 10
    gate_count = 80
    from pyzx.generate import cliffordT
    circuit = cliffordT(qubit_amount, gate_count)

#Use one of the built-in rewriting strategies to simplify the circuit
from pyzx.simplify import full_reduce
full_reduce(circuit)

# Draw the circuit only if the ZX diagram is small enough not to kill the browser
if (len(list(circuit.edges())) < 1000) and (len(list(circuit.vertices())) < 200):
    gjson = draw(circuit, "fig_circuit")
else:
    gjson = {'nodes':[], 'links': []}

my3DGraph.graphData(gjson)

# Some information from the circuit
from pyzx.simplify import tcount
t_count = tcount(circuit)
max_log_qubits = circuit.qubit_count()
cons.innerHTML += "<br> {} T gates, and {} qubits from pyZX ".format(t_count, max_log_qubits);

# Construct a new experiment - will update the manual configuration
experiment["depth_units"] = t_count
experiment["routing_overhead"] = 50
experiment["footprint"] = max_log_qubits * (100 + experiment["routing_overhead"])/100


# Update the plots with the new experiment
update_plots(plot_names)