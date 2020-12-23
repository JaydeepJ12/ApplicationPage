from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from operator import itemgetter
from flask_cors import CORS, cross_origin
import pandas as pd
import json
from handlers.cases import CaseHandler

bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

cases = Cases('http://casesapi.boxerproperty.com')
r = cases.token('API_Admin','Boxer@123') #store the token in the browser


@bp.route('/config')
@cross_origin("*")
def config():
    ctid = request.args.get('CaseTypeID')

    r = cases.get(f'http://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={{user}}&caseType={ctid}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html

    data = json.loads(r.text)
    print(data)
    data = data.get('ResponseContent')
    return  json.dumps(data)#

@bp.route('/assocDecode')
@cross_origin("*")
def assocDecode():
    assoc_id = request.args.get('ASSOC_TYPE_ID')
    # systemCode = request.args.get('SYSTEM_CODE')
    print(assoc_id)
    df = db.assoc_decode(assoc_id) # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    if(len(df) > 0): 
        return df.to_json(orient='records') #
    else :
       return "[]"


@bp.route('/test')
def create():
    r = cases.get('http://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={user}&caseType=19')
    print(r.text)
    return r.text
    

@bp.route('/assoc_type', methods=['GET'])
def assoc_type_data():
    if request.method == 'GET':
        return CaseHandler().assoc_type_data()


@bp.route('/case_type', methods=['GET'])
def case_type_data():
    if request.method == 'GET':
        return CaseHandler().case_type_data()


@bp.route('/case_type_insert', methods=['POST'])
def insert_case_type_data():
    if request.method == 'POST':
        return CaseHandler().case_type_insert()


@bp.route('/assoc_type_insert', methods=['POST'])
def insert_assoc_type_data():
    if request.method == 'POST':
        return CaseHandler().assoc_type_insert()