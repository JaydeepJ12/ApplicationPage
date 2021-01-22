from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json 
import time
import math
import plotly.express as px
import numpy as np
from handlers.cases import CaseHandler
from flask_cors import CORS, cross_origin

bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2021')

cases = Cases('https://casesapi.boxerproperty.com')
r = cases.token('API_Admin','Boxer@123') #store the token in the browser
def t():
    return time.time()

@bp.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = '*'
    return r

@bp.route('/config')
def config():
    ctid = request.args.get('CaseTypeID')
    t0 = t()
    # r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetTypesByCaseTypeID?user={{user}}&caseType={ctid}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    df = db.cases_type_form(int(ctid))
    # df = df.sort_values(by='NAME')
    df['assoc_decode']=[[] for i in df.index]
    for i, row in df.iterrows():
        data1 = assocDecode(f"{row['AssocTypeId']}")
        df['assoc_decode'][i] = json.loads(data1)
    return df.to_json(orient='records') #

@bp.route('/assocDecode')
def assocDecode(assoc_id = 0):
    AssocId = request.args.get('AssocId')
    if AssocId:
       assoc_id = AssocId
    df = db.assoc_decode(assoc_id)
    # r = cases.get(f'https://casesapi.boxerproperty.com/api/Cases/GetAssocDecode?assocTypeID={assoc_id}') # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
    # data1 = json.loads(r.text)
    # data1 = data1.get('ResponseContent')
    return  df.to_json(orient='records') #

@bp.route('/caseTypes')
def caseTypes():
   df = db.cases_types()
   df = df.sort_values(by='NAME')
   #print(df)
   return df.to_json(orient='records') #

@bp.route('/getEntitiesByEntityId', methods=['POST'])
def getEntitiesByEntityId():
   data = request.json
   df = db.get_entities_by_entity_id(data['entityId'])
   df = df.sort_values(by='NAME')
   return df.to_json(orient='records')

@bp.route('/caseTypesByEntityId', methods=['POST'])
def caseTypesByEntityId():
   data = request.json
   df = db.case_types_by_entity_id(data['entityIds'])
   df = df.sort_values(by='NAME')
   return df.to_json(orient='records')

@bp.route('/caseassoctypecascade')
def caseassoctypecascade():
   caseTypeId = request.args.get('CaseTypeID')
   df = db.caseassoctypecascade(int(caseTypeId))
   return df.to_json(orient='records') #

def getPastDueCount(userShortName):
    df = db.get_past_due_count(userShortName) #always returns dataframe
    return df.to_json(orient='records')

@bp.route('/getPeople', methods=['POST'])
def getPeople():
   data = request.json
   df = db.get_people(data['skipCount'], data['maxCount'], data['searchText'])
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

def getUserFullName(userShortName):
    df = db.get_user_fullname(userShortName) #always returns dataframe
    return df.to_json(orient='records')
   
@bp.route('/GetCaseNotes', methods=['POST'])
def get_case_notes():
    data = mobile.get_case_notes(request.json).json()
    for x in data['responseContent']: #can throw error with resp is empty
        userShortName = x.get('createdBy')
        userFullName = json.loads(getUserFullName(str(userShortName)))
        if userFullName:
            x['fullName'] = userFullName[0]['FULL_NAME']
        # x.update({'createdBy':userFullName[0]['FULL_NAME']}) 
    return data

@bp.route('/GetCaseHeaders', methods=['POST'])
def get_case_headers():
    data = mobile.get_case_headers(request.json).json()
    return data

def getSystemPriority(assocTypeId):
    df = db.get_system_priority(assocTypeId) #always returns dataframe
    return df.to_json(orient='records')

@bp.route('/GetFullCaseByCaseId', methods=['POST'])
def get_full_case_by_caseId():
    data = mobile.get_full_case_by_caseId(request.json).json()
    return data


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
        if math.isnan(data[1]):
            data[1] = 0
        if math.isnan(data[2]):
            data[2] = 0
        if math.isnan(data[3]):
            data[3] = 0
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
        if math.isnan(data[1]):
            data[1] = 0
        if math.isnan(data[2]):
            data[2] = 0
        if math.isnan(data[3]):
            data[3] = 0
        dataset.append({"assigned_supervisor_name": data[0], "past_due_case": data[1], "not_due": data[2], "no_due_date": data[3]})
    return json.dumps({"name":"Assign Assignee Supervisor List API", "status": 200, "data": dataset})


@bp.route('/status/')
def status():
    case_type = request.args.get('case_type')
    color_sequence = request.args.get('color_sequence')
    if color_sequence is None:
        color_sequence = 'black'
    else:
        color_sequence = request.args.get('color_sequence')
    sub_query = db.case_type_count_all(case_type).values.tolist()
    dataset = []
    for data in sub_query:
        dataset.append({"past_due_case":data[0],"not_due":data[1],
                        "no_due_date":data[2]})
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
        if math.isnan(data[1]):
            data[1] = 0
        if math.isnan(data[2]):
            data[2] = 0
        if math.isnan(data[3]):
            data[3] = 0
        dataset.append({"case_type_name": data[0], "past_due_case": data[1], "not_due": data[2],
                        "no_due_date": data[3]})
    return json.dumps({"name": "Case Type API List", "status": 200, "data": dataset})


@bp.route('/assoc_type', methods=['GET'])
def assoc_type_data():
    if request.method == 'GET':
        return CaseHandler().assoc_type_data()

@bp.route('/case_type_data', methods=['GET'])
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

@bp.route('/getRelatedCasesCountData', methods=['POST'])
def get_related_cases_count_data():
    data = mobile.get_related_cases_count_data(request.json).json()
    return data

@bp.route('/getUserInfo', methods=['POST'])
def get_user_info():
    data = request.json
    df = db.get_user_info(data['userShortName'])
    return df.to_json(orient='records')
