from js import document
from js import experiment
from js import update_plots
from js import plot_names

from js import my3DGraph
from js import pyZXJS

# get DOM elements
cons = document.getElementById("txt_console")
figcircuit = document.getElementById("fig_circuit")

#
# PyZX part
#
qubit_amount = 10
gate_count = 80

#Generate random circuit of Clifford gates
circuit = zx.generate.cliffordT(qubit_amount, gate_count)

#Use one of the built-in rewriting strategies to simplify the circuit
zx.simplify.full_reduce(circuit)

gjson = draw(circuit, "fig_circuit")
# pyZXJS.showGraph("#" + where, json.dumps(gjson), w, h, node_size)

# Some information from the circuit
t_count = zx.tcount(circuit)
max_log_qubits = circuit.qubit_count()
cons.innerHTML += "<br> {} T gates, and {} qubits from pyZX ".format(t_count, max_log_qubits);

# Construct a new experiment
experiment["depth_units"] = t_count
experiment["footprint"] = max_log_qubits * 1.5

# Update the plots with the new experiment
update_plots(plot_names)

my3DGraph.graphData(gjson)