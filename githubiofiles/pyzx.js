
var Module = typeof pyodide._module !== 'undefined' ? pyodide._module : {};

Module.checkABI(1);

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'pyzx.data';
    var REMOTE_PACKAGE_BASE = 'pyzx.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'lib', true, true);
Module['FS_createPath']('/lib', 'python3.7', true, true);
Module['FS_createPath']('/lib/python3.7', 'site-packages', true, true);
Module['FS_createPath']('/lib/python3.7/site-packages', 'pyzx', true, true);
Module['FS_createPath']('/lib/python3.7/site-packages/pyzx', 'scripts', true, true);
Module['FS_createPath']('/lib/python3.7/site-packages/pyzx', 'routing', true, true);
Module['FS_createPath']('/lib/python3.7/site-packages/pyzx', 'graph', true, true);

    function DataRequest(start, end, audio) {
      this.start = start;
      this.end = end;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);
        this.finish(byteArray);
      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            err('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change

        this.requests[this.name] = null;
      }
    };

        var files = metadata.files;
        for (var i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_pyzx.data');

    };
    Module['addRunDependency']('datafile_pyzx.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"filename": "/lib/python3.7/site-packages/pyzx/rules.py", "start": 0, "end": 27450, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/todd.py", "start": 27450, "end": 45135, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/io.py", "start": 45135, "end": 51833, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/optimize.py", "start": 51833, "end": 83482, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/quantomatic.py", "start": 83482, "end": 89987, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/__init__.py", "start": 89987, "end": 91275, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/generate.py", "start": 91275, "end": 104089, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/simplify.py", "start": 104089, "end": 127065, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/pyquil_circuit.py", "start": 127065, "end": 131131, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/d3.py", "start": 131131, "end": 134638, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/drawing.py", "start": 134638, "end": 141573, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/linalg_c.pyx", "start": 141573, "end": 154123, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/gflow.py", "start": 154123, "end": 156831, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/tensor.py", "start": 156831, "end": 164264, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/tikz.py", "start": 164264, "end": 169190, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/circuit.py", "start": 169190, "end": 212995, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/linalg.py", "start": 212995, "end": 229307, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/extract.py", "start": 229307, "end": 271552, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/__main__.py", "start": 271552, "end": 273719, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/phasepoly.py", "start": 273719, "end": 292251, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/scripts/__init__.py", "start": 292251, "end": 292251, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/scripts/cnot_mapper.py", "start": 292251, "end": 312271, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/scripts/circ2circ.py", "start": 312271, "end": 316366, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/scripts/circ2tikz.py", "start": 316366, "end": 318367, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/routing/__init__.py", "start": 318367, "end": 319221, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/routing/parity_maps.py", "start": 319221, "end": 325147, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/routing/machine_learning.py", "start": 325147, "end": 331038, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/routing/steiner.py", "start": 331038, "end": 334981, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/routing/architecture.py", "start": 334981, "end": 355807, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/graph_gt.py", "start": 355807, "end": 358474, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/__init__.py", "start": 358474, "end": 359328, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/graph.py", "start": 359328, "end": 361060, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/graph_s.py", "start": 361060, "end": 367238, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/graph_ig.py", "start": 367238, "end": 371552, "audio": 0}, {"filename": "/lib/python3.7/site-packages/pyzx/graph/base.py", "start": 371552, "end": 394958, "audio": 0}], "remote_package_size": 394958, "package_uuid": "fc42da53-f6b8-4a05-bff3-90bb78150d64"});

})();
