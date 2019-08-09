from js import document
from js import experiment
from js import update_plots
from js import plot_names

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

draw(circuit, "fig_circuit")

# Some information from the circuit
t_count = zx.tcount(circuit)
max_log_qubits = circuit.qubit_count()
cons.innerHTML += "<br> T gates from pyZX " + str(t_count) + " " + str(max_log_qubits);

# Construct a new experiment
experiment["depth_units"] = t_count
experiment["footprint"] = max_log_qubits * 1.5

# Update the plots with the new experiment
update_plots(plot_names)