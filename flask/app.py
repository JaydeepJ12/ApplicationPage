from flask import Flask, request
from blueprints.cases import bp as cases
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import json

base = Flask(__name__)
app = Flask(__name__)

app.register_blueprint(cases)

@app.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r
        
#####Test endpoint below#####
@app.route('/test', methods=['GET'])
def test():
    return 'Hello World'

deploy = DispatcherMiddleware(base,{
    '/flask':app
})

if __name__ == '__main__':
    app.run(debug=True, threaded=False)