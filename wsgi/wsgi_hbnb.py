#!/usr/bin/python3
"""
imports Flask instance for gunicorn configurations
gunicorn --bind 127.0.0.1:8003 wsgi.wsgi_hbnb:web_dynamic.app
"""

web_dynamic = __import__('web_dynamic.100-hbnb',
                         globals(), locals(), ['*'])

if __name__ == "__main__":
    """runs the main flask app"""
    web_dynamic.app.run()
