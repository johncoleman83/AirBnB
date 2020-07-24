# AirBnB Clone: Flask Web Application

## Description

This directory contains Web Application files for the Python Flask App.
The Flask App and nginx are connected with gunicorn Web Server Gateway
Interface (WSGI).

## Environment

* __OS:__ Linux Ubuntu 16.04.3 LTS (xenial)
* __language:__ Python 3.4.3
* __application server:__ Flask 0.12.2, Jinja2 2.9.6
* __database:__ mysql Ver 14.14 Distrib 5.7.18
* __python style:__ PEP 8 (v. 1.7.0)
* __web static style:__ [W3C Validator](https://validator.w3.org/)

## Tests

* Test complete integation with files AirBnB HTML: `0-btcpbnb.py`.  Execute
  from root directory (`AirBnB_clone`) with all the necessary environmental
  variables to establish the database storage model:

```
$ cat 100-dump.sql | mysql -uroot -p
$ BTCPBNB_MYSQL_USER=btcpbnb_dev BTCPBNB_MYSQL_PWD=btcpbnb_dev_pwd \
BTCPBNB_MYSQL_HOST=localhost BTCPBNB_MYSQL_DB=btcpbnb_dev_db \
BTCPBNB_TYPE_STORAGE=db python3 -m web_dynamic.0-btcpbnb
```

## License

MIT License
