from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json
import time

bp1 = Blueprint('entity', __name__, url_prefix='/entity')
db = CasesSQL()

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2021')

cases = Cases('https://casesapi.boxerproperty.com')
r = cases.token('API_Admin', 'Boxer@123')  # store the token in the browser


def t():
    return time.time()


@bp1.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = '*'
    return r


@bp1.route('/entity_link', methods=['POST'])
def entity_link():
    data = request.json
    print(data)
    df = db.entity_data(data['entityIds'])
    print(df)
    return df.to_json(orient='records')


@bp1.route('/entity_systemcode_count', methods=['GET'])
def entity_systemcode_count():
    df = db.system_code_count()
    return df.to_json(orient='records')