from flask import Blueprint, request, make_response
import json
import time
from handlers.external_datasource import ExtCase, ExtEntity, ExtTest
from cache import _cache

bp = Blueprint('external', __name__, url_prefix='/external')

@bp.route('/<app>/<id>')
@_cache.memoize(600)
def fetch(app, id):
    #ExtTest().fetch(id)
    if app == 'Cases':
        data = ExtCase().fetch(id)
        return json.dumps([{'id':i[0],'value':i[1]} for i in data])
    elif app == 'Entities':
        data = ExtEntity().fetch(id)
        return json.dumps([{'id':i[0],'value':i[1]} for i in data])
    else:
        return 'Please choose an app that is either Cases or Entities'