import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("¡Servidor iniciado!")
    print(f"Abre tu navegador y ve a: http://localhost:{PORT}")
    httpd.serve_forever()

