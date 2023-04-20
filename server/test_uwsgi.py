#  uwsgi --http :8000 --wsgi-file test.py
def application(env, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    return [b"Hello World"]  # python3