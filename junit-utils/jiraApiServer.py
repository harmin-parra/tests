#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import Request, urlopen
from urllib.parse import quote
import argparse
import os
import base64
import json


JIRA_URL = "https://bugtracker.com"
JIRA_EMAIL = "user@email.com"
JIRA_API_TOKEN = "XXX";

credentials = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()


class Handler(BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if not self.path.startswith("/api/jira/"):
            self.send_error(404)
            return

        ticket_key = self.path[len("/api/jira/"):]

        jira_url = (
            f"{JIRA_URL}/rest/api/3/issue/"
            f"{quote(ticket_key)}"
        )

        request = Request(
            jira_url,
            headers={
                "Authorization": f"Basic {credentials}",
                "Accept": "application/json"
            }
        )

        try:
            with urlopen(request) as response:
                issue = json.loads(response.read())

            result = {
                "title": issue["fields"]["summary"],
                "status": issue["fields"]["status"]["name"]
            }

            body = json.dumps(result).encode()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        except Exception as e:
            body = json.dumps({
                "error": str(e)
            }).encode()

            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)


parser = argparse.ArgumentParser()
parser.add_argument("-p", "--port", type=int, default=8000)
args = parser.parse_args()

server = HTTPServer(("0.0.0.0", args.port), Handler)

print(f"Server running on port {args.port}")
server.serve_forever()
