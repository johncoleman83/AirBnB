#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template, request, url_for
import json
from models import storage
import requests
from uuid import uuid4


# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5001
host = '0.0.0.0'


# begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/', methods=['GET', 'POST'])
def main_index(the_id=None):
    """
    handles request to main index, currently a login page
    """
    if request.method == 'GET':
        return render_template('index.html')
    if request.method == 'POST':
        email = request.form.get('email', None)
        password = request.form.get('password', None)
        payload = {
            'email': email,
            'password': password
        }
        headers = {
            'content-type': 'application/json'
        }
        url = 'http://0.0.0.0:5000/auth/login'
        r = requests.post(url, headers=headers, data=json.dumps(payload))
        r_data = r.json()
        if r_data.get('error'):
            return render_template('index.html')
        auth_token = r_data.get('auth_token')
        if auth_token is None:
            return render_template('index.html')
        state_objs = storage.all('State').values()
        states = dict([state.name, state] for state in state_objs)
        amens = list(storage.all('Amenity').values())
        cache_id = uuid4()
        return render_template('places.html', states=states, amens=amens,
                               cache_id=cache_id, auth_token=auth_token)


@app.route('/places/', methods=['GET'])
def hbnb_filters(the_id=None):
    """
    handles request to custom template with states, cities & amentities
    """
    state_objs = storage.all('State').values()
    states = dict([state.name, state] for state in state_objs)
    amens = list(storage.all('Amenity').values())
    cache_id = uuid4()
    auth_token = 'please_login'
    return render_template('places.html', states=states, amens=amens,
                           cache_id=cache_id, auth_token=auth_token)

if __name__ == "__main__":
    """
    MAIN Flask App"""
    app.run(host=host, port=port)
