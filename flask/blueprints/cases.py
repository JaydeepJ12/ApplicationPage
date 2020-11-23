from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from operator import itemgetter
import pandas as pd
import json 

bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

cases = Cases('http://casesapi.boxerproperty.com')
r = cases.token('API_Admin','Boxer@123') #store the token in the browser

@bp.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r

@bp.route('/config')
def config():
    ctid = request.args.get('CaseTypeID')

    r = cases.get(f'http://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={{user}}&caseType={ctid}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html

    data = json.loads(r.text)
    data = data.get('ResponseContent')
    return  json.dumps(data)#

@bp.route('/assocDecode')
def assocDecode():
    #
    assoc_id = request.args.get('ASSOC_TYPE_ID')

    r = cases.get(f'http://casesapi.boxerproperty.com/api/Cases/GetAssocDecode?assocTypeID={assoc_id}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    data = json.loads(r.text)
    data = data.get('ResponseContent')
    return  json.dumps(data)#

@bp.route('/test')
def create():
    r = cases.get('http://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={user}&caseType=19')
    print(r.text)
    return r.text