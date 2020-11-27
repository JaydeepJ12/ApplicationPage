from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json 

bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2020')

cases = Cases('https://casesapi.boxerproperty.com')
r = cases.token('API_Admin','Boxer@123') #store the token in the browser

@bp.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r

@bp.route('/config')
def config():
    ctid = request.args.get('CaseTypeID')
    r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={{user}}&caseType={ctid}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    
    data = json.loads(r.text)
    data = data.get('ResponseContent')

    for value in data:
        data1 = assocDecode(value["AssocTypeId"])
        value.update({"assoc_decode": data1})

    return  json.dumps(data)#

@bp.route('/assocDecode')
def assocDecode(assoc_id):
    r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetAssocDecode?assocTypeID={assoc_id}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    data1 = json.loads(r.text)
    data1 = data1.get('ResponseContent')
    return  data1#

@bp.route('/caseTypes')
def caseTypes():
   df = db.cases_types()
   df = df.sort_values(by='NAME')
   return df.to_json(orient='records') #

@bp.route('/caseassoctypecascade')
def caseassoctypecascade():
   caseTypeId = request.args.get('CaseTypeID')
   print(caseTypeId, type(caseTypeId))
   df = db.caseassoctypecascade(int(caseTypeId))
   print(df)
   return df.to_json(orient='records') #

@bp.route('/test')
def create():
    r = cases.get('https://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={user}&caseType=19')
    return r.text

@bp.route('/GetExternalDataValues',methods=['POST'])
def external_data_values():
    print(request.json)
    return mobile.external_data_values(request.json).json()