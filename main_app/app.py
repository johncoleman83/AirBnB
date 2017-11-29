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
port = 8000
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
def main_index():
    """
    handles request to main index, currently a login page
    """
    cache_id = uuid4()
    if request.method == 'GET':
        return render_template('index.html', cache_id=cache_id, message=None)
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
        action = request.form.get('action')
        if action == 'login':
            url = 'http://0.0.0.0:5001/auth/login'
        elif action == 'signup':
            url = 'http://0.0.0.0:5001/auth/register'
        else:
            auth_token = request.form.get('logout')
            return logout(auth_token=auth_token)
        r = requests.post(url, headers=headers,
                          data=json.dumps(payload))
        r_data = r.json()
        if r_data.get('error'):
            return render_template('index.html',
                                   cache_id=cache_id,
                                   message=r_data.get('error'))
        auth_token = r_data.get('auth_token')
        if auth_token is None:
            return render_template('index.html',
                                   cache_id=cache_id,
                                   message=r_data.get('error'))
        if 'register' in url:
            signup_message = 'thank you for signing up'
            return render_template('index.html',
                                   cache_id=cache_id,
                                   message=signup_message)
        state_objs = storage.all('State').values()
        states = dict([state.name, state] for state in state_objs)
        amens = list(storage.all('Amenity').values())
        cache_id = uuid4()
        return render_template('places.html', cache_id=cache_id, states=states,
                               amens=amens, auth_token=auth_token)


@app.route('/logout', methods=['GET', 'POST'])
def logout(auth_token=None):
    """
    handles request to main index, currently a login page
    """
    if request.method == 'GET':
        cache_id =uuid4()
        return render_template('404.html', cache_id=cache_id), 404
    cache_id = uuid4()
    if auth_token is None:
        auth_token = request.form.get('logout')
    headers = {
        'content-type': 'application/json',
        'Authorization': 'Bearer {}'.format(auth_token)
    }
    url = 'http://0.0.0.0:5001/auth/logout'
    r = requests.post(url, headers=headers)
    r_data = r.json()
    if r_data.get('error'):
        return render_template('index.html',
                               cache_id=cach_id,
                               message=r_data.get('error'))
    message = 'You are now logged out.'
    cache_id = uuid4()
    return render_template('index.html',
                           cache_id=cache_id,
                           message=message)


@app.errorhandler(404)
def page_not_found(error):
    """
    404 Error Handler
    """
    cache_id = uuid4()
    return render_template('404.html', cache_id=cache_id), 404


if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=host, port=port)
