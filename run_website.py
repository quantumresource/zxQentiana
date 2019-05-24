from http.server import HTTPServer, SimpleHTTPRequestHandler

SimpleHTTPRequestHandler.extensions_map['.wasm'] = 'application/wasm'
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()