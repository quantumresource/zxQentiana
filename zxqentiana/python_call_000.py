# Tutorial https://alpha.iodide.io/notebooks/300/
#
# Global declarations to be used from Python and JavaScript
#
import json

# the pyZX module
import pyzx as zx
from fractions import Fraction

# The pyodide compilation makes a single file/module from the resource analysis files
from pyqentiana.cube_to_physical import Qentiana
from pyqentiana.phys_qubits_vs_log_err import PhysicalQubitsVsLogicalError
from pyqentiana.time_vs_space import TimeVsSpace
from pyqentiana.res_savings import ResourceSavings

# https://github.com/iodide-project/pyodide/blob/master/docs/type_conversions.md#using-javascript-objects-from-python
from js import document
from js import pyZXJS
from js import experiment

# See javascript_call_000.js for these declarations
from js import plot_names
from js import data_objects
data_objects[".plot1"] = PhysicalQubitsVsLogicalError()
data_objects[".plot2"] = PhysicalQubitsVsLogicalError()
data_objects[".plot3"] = TimeVsSpace()
data_objects[".plot4"] = ResourceSavings()

# #
# ## Functions
# #
# def phase_to_s(a):
#     if not a: return ''
#     if not isinstance(a, Fraction):
#         a = Fraction(a)
#     ns = '' if a.numerator == 1 else str(a.numerator)
#     ds = '' if a.denominator == 1 else '/' + str(a.denominator)

#     # unicode 0x03c0 = pi
#     return ns + '\u03c0' + ds

# def draw(g, where, scale=None):
#     if not hasattr(g, 'vertices'):
#         g = g.to_graph()

#     if scale == None:
#         scale = 800 / (g.depth() + 2)
#         if scale > 50: scale = 50
#         if scale < 20: scale = 20

#     node_size = 0.2 * scale
#     if node_size < 2: node_size = 2

#     node_size = 5

#     w = "100%"
#     h = "100%"

#     nodes = [{'name': str(v),
#                 'x': (g.row(v) + 1) * scale,
#                 'y': (g.qubit(v) + 2) * scale,
#                 't': g.type(v),
#                 'phase': phase_to_s(g.phase(v)) }
#                 for v in g.vertices()]
#     links = [{'source': str(g.edge_s(e)),
#                 'target': str(g.edge_t(e)),
#                 't': g.edge_type(e) } for e in g.edges()]
    
#     graphj = json.dumps({'nodes': nodes, 'links': links})

#     pyZXJS.showGraph("#" + where, graphj, w, h, node_size)

# # get DOM elements
# cons = document.getElementById("txt_console")
# figcircuit = document.getElementById("fig_circuit")

# #
# # PyZX part
# #
# qubit_amount = 10
# gate_count = 80

# #Generate random circuit of Clifford gates
# circuit = zx.generate.cliffordT(qubit_amount, gate_count)

# #Use one of the built-in rewriting strategies to simplify the circuit
# zx.simplify.full_reduce(circuit)

# draw(circuit, "fig_circuit")

# # Some information from the circuit
# t_count = zx.tcount(circuit)
# max_log_qubits = circuit.qubit_count()

# cons.innerHTML += "<br> T gates from pyZX " + str(t_count) + " " + str(max_log_qubits);

# experiment.depth = t_count
# experiment.footprint = max_log_qubits
# experiment.volume = 1.5 * experiment.depth * experiment.footprint
# # update_plots()

# # estimate the resources
# qentiana = qre.Qentiana(t_count, max_log_qubits)
# res_values = qentiana.compute_physical_resources()

# estimation = "\nResource prediction: " + str(res_values)
# cons.innerText += estimation