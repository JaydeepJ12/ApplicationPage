from flask import Flask, request
from blueprints.cases import bp as cases
from blueprints.entity import bp1 as entity
from blueprints.user import bpu as user
from blueprints.visuals import bp as visuals
from blueprints.external_data import bp as external
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from cache import _cache
import json

base = Flask(__name__)
app = Flask(__name__)
config={'CACHE_TYPE': 'simple'}
_cache.init_app(app, config=config)

app.register_blueprint(cases)
app.register_blueprint(entity)
app.register_blueprint(user)
app.register_blueprint(visuals)
app.register_blueprint(external)



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