from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json 
import time
import numpy as np


bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2020')

cases = Cases('https://casesapi.boxerproperty.com')
r = cases.token('API_Admin','Boxer@123') #store the token in the browser
def t():
    return time.time()
@bp.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r

@bp.route('/config')
def config():
    ctid = request.args.get('CaseTypeID')
    t0 = t()
    # r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={{user}}&caseType={ctid}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    df = db.cases_type_form(int(ctid))
    # df = df.sort_values(by='NAME')
    t1 = t()
    print(f'Get Types by Type Id: {t1-t0}')

    df['assoc_decode']=[[] for i in df.index]
    for i, row in df.iterrows():
        t0 = t()
        data1 = assocDecode(f"{row['AssocTypeId']}")
        t1 = t()
        print(f"{row['AssocTypeId']} took: {t1-t0}")
        df['assoc_decode'][i] = json.loads(data1)

    return df.to_json(orient='records') #

@bp.route('/assocDecode')
def assocDecode(assoc_id):
    df = db.assoc_decode(assoc_id)
    # r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetAssocDecode?assocTypeID={assoc_id}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    # data1 = json.loads(r.text)
    # data1 = data1.get('ResponseContent')
    return  df.to_json(orient='records') #

@bp.route('/caseTypes')
def caseTypes():
   df = db.cases_types()
   df = df.sort_values(by='NAME')
   return df.to_json(orient='records') #

@bp.route('/caseassoctypecascade')
def caseassoctypecascade():
   caseTypeId = request.args.get('CaseTypeID')
   df = db.caseassoctypecascade(int(caseTypeId))
   return df.to_json(orient='records') #

@bp.route('/test')
def create():
    r = cases.get('https://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={user}&caseType=19')
    return r.text

@bp.route('/GetExternalDataValues',methods=['POST'])
def external_data_values():
    data = mobile.external_data_values(request.json).json()
    for x in data['responseContent']:
        x['DecodeId'] = x.pop("id")
        x["DecodeValue"] =  x.pop("name")
    return data

@bp.route('/GetEntityExternalDataValues',methods=['POST'])
def external_data_values_entity():
    data = mobile.external_data_values_entity(request.json).json()
    return data

@bp.route('/GetEmployeesBySearch', methods=['POST'])
def get_employees_by_search():
    data = mobile.get_employees_by_search(request.json).json()
    return data

@bp.route('/GetCaseNotes', methods=['POST'])
def get_case_notes():
    data = mobile.get_case_notes(request.json).json()
    return data