# Tutorial https://alpha.iodide.io/notebooks/300/
#
# Global declarations to be used from Python and JavaScript
#
import json

# the pyZX module
import pyzx as zx
from fractions import Fraction

# The resource estimation engine
from pyqentiana.cube_to_physical import Qentiana
# The Type2 tradeoff plots
from pyqentiana.distance_bins import DistanceBins
# The Type1 tradeoff plots
from pyqentiana.phys_qubits_vs_log_err import PhysicalQubitsVsLogicalError
from pyqentiana.time_vs_space import TimeVsSpace
from pyqentiana.res_savings import ResourceSavings


# https://github.com/iodide-project/pyodide/blob/master/docs/type_conversions.md#using-javascript-objects-from-python
from js import pyZXJS

# See javascript_call_000.js for these declarations
from js import plot_names
from js import data_objects
data_objects[".plot1"] = DistanceBins()
data_objects[".plot2"] = PhysicalQubitsVsLogicalError()
data_objects[".plot3"] = TimeVsSpace()
data_objects[".plot4"] = ResourceSavings()

#
## Functions
#
def phase_to_s(a):
    if not a: return ''
    if not isinstance(a, Fraction):
        a = Fraction(a)
    ns = '' if a.numerator == 1 else str(a.numerator)
    ds = '' if a.denominator == 1 else '/' + str(a.denominator)

    # unicode 0x03c0 = pi
    return ns + '\u03c0' + ds

def draw(g, where, scale=None):
    if not hasattr(g, 'vertices'):
        g = g.to_graph()

    if scale == None:
        scale = 800 / (g.depth() + 2)
        if scale > 50: scale = 50
        if scale < 20: scale = 20

    node_size = 0.2 * scale
    if node_size < 2: node_size = 2

    node_size = 5

    w = "100%"
    h = "100%"

    nodes = [{'name': str(v),
                'x': (g.row(v) + 1) * scale,
                'y': (g.qubit(v) + 2) * scale,
                't': g.type(v),
                'phase': phase_to_s(g.phase(v)) }
                for v in g.vertices()]
    links = [{'source': str(g.edge_s(e)),
                'target': str(g.edge_t(e)),
                't': g.edge_type(e) } for e in g.edges()]
    
    graphj = json.dumps({'nodes': nodes, 'links': links})

    pyZXJS.showGraph("#" + where, graphj, w, h, node_size)
