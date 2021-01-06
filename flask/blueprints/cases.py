from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json 
import time
import numpy as np
from handlers.cases import CaseHandler
from flask_cors import CORS, cross_origin

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

def getUserFullName(name_list):
    df = db.get_user_fullname(name_list)#always returns dataframe
    return df.to_json(orient='records')

@bp.route('/GetCaseNotes', methods=['POST'])
def get_case_notes():
    data = mobile.get_case_notes(request.json).json()
    for x in data['responseContent']: #can throw error with resp is empty
        userShortName = x.get('createdBy')
        userFullName = json.loads(getUserFullName(str(userShortName)))
        x['fullName'] = userFullName[0]['FULL_NAME']
        # x.update({'createdBy':userFullName[0]['FULL_NAME']}) 
    return data

@bp.route('/GetCaseHeaders', methods=['POST'])
def get_case_headers():
    data = mobile.get_case_headers(request.json).json()
    return data

@bp.route('/GetFullCaseByCaseId', methods=['POST'])
def get_full_case_by_caseId():
    data = mobile.get_full_case_by_caseId(request.json).json()
    for x in data['responseContent']['notes']: #can throw error with resp is empty
        userShortName = x['createdBy']
        userFullName = json.loads(getUserFullName(str(userShortName)))
        x['fullName'] = userFullName[0]['FULL_NAME']
    for y in data['responseContent']['details']: #can throw error with resp is empty
        print(y['controlId'])
        assocDecodeData = assocDecode(y['controlId'])
        y['assoc_decode'] = json.loads(assocDecodeData)
    return data
    r = cases.get('http://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={user}&caseType=19')
    print(r.text)
    return r.text


@bp.route('/assigned/')
def assigned_to():
    case_type = request.args.get('case_type')
    color_sequence = request.args.get('color_sequence')
    if color_sequence is None:
        color_sequence = ['goldenrod', 'darkgrey', 'black']
    else:
        color_sequence = color_sequence.split(',')
    sub_query = db.assignee_case_types(case_type).values.tolist()
    dataset = []
    for data in sub_query:
        dataset.append({"assigned_name": data[0], "past_due_case": data[1], "not_due": data[2], "no_due_date": data[3]})
    return json.dumps({"name":"Assign Case List API","status": 200, "data": dataset, })


@bp.route('/assigned_supervisor/')
def assigned_supervisor():
    case_type = request.args.get('case_type')
    color_sequence = request.args.get('color_sequence')
    if color_sequence is None:
        color_sequence = ['goldenrod', 'darkgrey', 'black']
    else:
        color_sequence = color_sequence.split(',')
    sub_query = db.assigne_supervisor(case_type).values.tolist()
    dataset = []
    for data in sub_query:
        dataset.append({"assigned_supervisor_name": data[0], "past_due_case": data[1], "not_due": data[2], "no_due_date": data[3]})
    return json.dumps({"name":"Assign Assignee Supervisor List API", "status": 200, "data": dataset})


@bp.route('/status/')
def status():
    case_type = request.args.get('case_type')
    color_sequence = request.args.get('color_sequence')
    if color_sequence is None:
        color_sequence = ['goldenrod', 'darkgrey', 'black']
    else:
        color_sequence = color_sequence.split(',')
    sub_query = db.case_type_count_all(case_type).values.tolist()
    dataset = []
    for data in sub_query:
        dataset.append({"past_due_case": data[0], "not_due": data[1], "no_due_date": data[2]})
    return json.dumps({"name":"Status of Case", "status": 200, "data": dataset})


@bp.route('/case_type/')
def case_type():
    case_type = request.args.get('case_type')
    color_sequence = request.args.get('color_sequence')
    if color_sequence is None:
        color_sequence = ['goldenrod', 'darkgrey', 'black']
    else:
        color_sequence = color_sequence.split(',')
    sub_query = db.case_type_count_dues(case_type).values.tolist()
    dataset = []
    for data in sub_query:
        dataset.append({"case_type_name": data[0], "past_due_case": data[1], "not_due": data[2], "no_due_date": data[3]})
    return json.dumps({"name": "Case Type API List", "status": 200, "data": dataset})


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
    data = json.loads(request.data)
    print(data)
    if request.method == 'POST':
        try:
            return CaseHandler().case_type_insert(data)
        except Exception as exe:
            return json.dumps({"error_stack": str(exe)})


@bp.route('/assoc_type_insert', methods=['POST'])
@cross_origin(supports_credentials=True)
def insert_assoc_type_data():
    data = json.loads(request.data)
    if request.method == 'POST':
        try:
            return CaseHandler().assoc_type_insert(data)
        except Exception as exe:
            return json.dumps({"error_stack": str(exe)})


@bp.route('/system_code', methods=['GET'])
def system_code_list():
    if request.method == 'GET':
        try:
            return CaseHandler().system_code_list()
        except Exception as exe:
            return json.dumps({"error_stack": str(exe)})