#! /usr/bin/env python
"""
From directory where you store your files, type:

    python static.py --dir . --port 8000
"""
from __future__ import print_function
import argparse
import os
import posixpath
import urllib

from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler


class StaticHTTPServer(HTTPServer):
    """HTTPServer."""
    def __init__(self, base_path, *args, **kwargs):
        HTTPServer.__init__(self, *args, **kwargs)
        self.RequestHandlerClass.base_path = base_path


class StaticHTTPRequestHandler(SimpleHTTPRequestHandler):
    """HTTP Request Handler."""
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def translate_path(self, path):
        path = posixpath.normpath(urllib.unquote(path))
        words = path.split('/')
        words = filter(None, words)
        path = self.base_path
        for word in words:
            drive, word = os.path.splitdrive(word)
            head, word = os.path.split(word)
            if word in (os.curdir, os.pardir):
                continue
            path = os.path.join(path, word)
        return path


def serve(handler_cls=StaticHTTPRequestHandler, server_cls=StaticHTTPServer):
    """Serve.

    :param handler_cls:
    :param server_cls:
    :return:
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', '-p', default=8000, type=int)
    parser.add_argument('--dir', '-d', default=os.getcwd(), type=str)
    args = parser.parse_args()

    server_address = ('', args.port)

    httpd = server_cls(args.dir, server_address, handler_cls)

    sa = httpd.socket.getsockname()
    print ("Serving HTTP on", sa[0], "port", sa[1], "...")
    httpd.serve_forever()


if __name__ == '__main__':
    serve()
