from flask import Blueprint, request
from sql.cases import CasesSQL
from sql.entity import EntitySQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json
import time
from flask_cors import CORS, cross_origin

bp1 = Blueprint('entity', __name__, url_prefix='/entity')
db = CasesSQL()
entities = EntitySQL()

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
@cross_origin(supports_credentials=True)
def entity_link():
    data = request.json
    df = db.entity_data(data['entityIds'])
    ENTITY_ID=df['ENTITY_ID'].to_list()
    ENTITY_ID=list(set(ENTITY_ID))
    ENTITY_ID.sort()
    ID=df['ID'].to_list()
    name=ID[:len(ENTITY_ID)]
    url=ID[len(ENTITY_ID):]
    EntityDict=[{"ENTITY_ID": ENTITY_ID[i], "ID": url[i],  "NAME": name[i]} for i in range(len(ENTITY_ID))]
    return json.dumps(EntityDict)


@bp1.route('/entity_systemcode_count', methods=['GET'])
def entity_systemcode_count():
    df = db.system_code_count()
    return json.dumps([{"Title":"COUNT OF ITEMS", "Count": df.to_dict(orient='records')[0]['total_count']},
                      {"Title": "COUNT OF ITEMS BY STATUS", "Count": df.to_dict(orient='records')[0]['sttus_count']},
                      {"Title":"COUNT OF ITEMS BY CATEGORY", "Count":df.to_dict(orient='records')[0]['category_count']}]
                       )


@bp1.route('/entity_list_byId', methods=['POST'])
def entity_list_byId():
    data = request.json
    df = db.entity_list_byId(data.get('entityTypeIds'))
    return df.to_json(orient='records')

@bp1.route('/entity_list_bySystemCode', methods=['POST'])
def entity_list_bySystemCode():
    data = request.json
    print(data)
    df = db.entity_list_bySystemCode(data['entityTypeIds'], data['systemCode'])
    return df.to_json(orient='records')

@bp1.route('/list_by_id', methods=['GET'])
def list_by_id():
    ''' defaults to show the first 25 if no offset and max are givin'''
    app_id = request.args.get('id')
    offset = request.args.get('offset', 0)
    max_count = request.args.get('max',25)
    df = entities.list_by_id(max_count=max_count, offset=offset, id=app_id)
    return df.to_json(orient='records')

@bp1.route('/type_list_by_id', methods=['GET'])
def type_list_by_id():
    ''' no limit and max for this, as there should never been a ton of these in the db'''
    app_id = request.args.get('id')
    print(request.args)
    if app_id == None:
        return 'id field required'
        
    df = entities.type_list_by_id(app_id)
    if df.empty == True: 
        return 'No Data Available'

    return df.to_json(orient='records')

@bp1.route('/data_by_entity_id', methods=['GET'])
def data_by_entity_id():
    ''' no limit and max for this, as there should never been a ton of these in the db'''
    eid = request.args.get('id')
    if eid == None:
        return 'id field required'
        
    df = entities.entity_by_id(eid)
    if df.empty == True: 
        return 'No Data Available'

    return df.to_json(orient='records')