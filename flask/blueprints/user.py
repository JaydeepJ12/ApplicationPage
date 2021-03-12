from flask import Blueprint, request, make_response
from sql.cases import CasesSQL
from api.mobile import Mobile
import pandas as pd
import json 
import time
import numpy as np
from handlers.cases import CaseHandler
from flask_cors import CORS, cross_origin

bpu = Blueprint('people', __name__, url_prefix='/people')

db = CasesSQL()
mobile = Mobile('http://home.boxerproperty.com/MobileAPI', 'michaelaf', 'Boxer@@2021')

@bpu.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = '*'
    return r

@bpu.route('/find', methods=['POST'])
def getPeople():
    #needs to take in an app-id
    data = request.json
    if not data['searchText']:
        return make_response("please pass search text", 400)
    df = db.get_people(data['skipCount'], data['maxCount'], data['searchText'])
    return df.to_json(orient='records')

@bpu.route('/department_fetch', methods=['POST'])
@cross_origin(supports_credentials=True)
def department_fetch():
    if request.method == 'POST':
        data = request.json
        df = db.department_fetch(data)
        return df.to_json(orient='records')

@bpu.route('/authenticate', methods=['POST'])
def authenticate():
    data = mobile.authenticate(request.json).json()
    return data