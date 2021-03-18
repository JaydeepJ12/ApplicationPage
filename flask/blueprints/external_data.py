from flask import Blueprint, request, make_response
import json
import time
from handlers.external_datasource import ExternalData
from cache import _cache

bp = Blueprint('external', __name__, url_prefix='/external')

@bp.route('/<id>')
@_cache.memoize(600)
def fetch(id):
    data = ExternalData().fetch(id)
    return json.dumps([{'id':i[0],'value':i[1]} for i in data])