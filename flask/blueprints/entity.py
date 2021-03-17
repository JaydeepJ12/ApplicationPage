from flask import Blueprint, request, make_response
from sql.cases import CasesSQL
from sql.entity import EntitySQL
from stemmons.api import Cases
from api.mobile import Mobile
from operator import itemgetter
import pandas as pd
import json
import time
from flask_cors import CORS, cross_origin
import io
from blueprints.utils import xml_to_json
from xml.etree.ElementTree import fromstring, ElementTree
bp1 = Blueprint('entity', __name__, url_prefix='/entity')
db = CasesSQL()
entities = EntitySQL()

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2021')

cases = Cases('https://casesapi.boxerproperty.com')
r = cases.token('API_Admin', 'Boxer@123')  # store the token in the browser


def t():
    return time.time()

def iter_docs(author):
    author_attr = author.attrib
    for doc in author.iter('ENTITY_TYPE'):
        doc_dict = author_attr.copy()
        doc_dict.update(doc.attrib)
        doc_dict['data'] = doc.text
        yield doc_dict

@bp1.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = '*'
    return r

@bp1.route('/config/<id>', methods=['GET'])
def config(id): 
    ''' 
    http://localhost:5000/entity/config/1139
    
    pass in entity type id to convert at the end of the url
    '''
    r = entities.config(etid = id).fetchone()
    print(r[0])
    #https://stackoverflow.com/questions/28259301/how-to-convert-an-xml-file-to-nice-pandas-dataframe
    #r =io.StringIO(r[0])
    etree = ElementTree(fromstring(r[0])).getroot() #create an ElementTree object 
    
    #if speed become an issue here we can skip converting to df and create our own method to convert xml to json
    return json.dumps(xml_to_json(etree))

@bp1.route('/entity_link', methods=['POST'])
@cross_origin(supports_credentials=True)
def entity_link():
    data = request.json
    if not data['entityIds']:
        return make_response("please pass entity ids", 400)
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
    df = entities.system_code_count()
    item_count =  df['total_count'].values[0]
    status_count = df['sttus_count'].values[0]
    category_count = df['category_count'].values[0]
    return json.dumps([{"Title":"COUNT OF ITEMS", "Count":int(item_count)},
                      {"Title": "COUNT OF ITEMS BY STATUS", "Count":int(status_count)},
                      {"Title":"COUNT OF ITEMS BY CATEGORY", "Count":int(category_count)}]
                       )


@bp1.route('/entity_list_byId', methods=['POST'])
def entity_list_byId():
    data = request.json
    if not data['entityTypeIds']:
        return make_response("please pass entity type Ids", 400)
    df = db.entity_list_byId(data.get('entityTypeIds'))
    return df.to_json(orient='records')


@bp1.route('/entity_list', methods=['POST'])
def entity_list():
    data = request.json
    if not data['entityTypeIds']:
        return make_response("please pass entity type Ids", 400)
    df = db.entity_list_byId(data.get('entityTypeIds'))
    return df.to_json(orient='records')

@bp1.route('/entity_count_byId', methods=['POST'])
def entity_count_byId():
    data = request.json
    print(data)
    df = db.entity_count_byId(data['entityTypeIds'])
    return json.dumps([{"Title":"COUNT OF ITEMS", "Count": df.to_dict(orient='records')[0]['total_count']},
                      {"Title": "COUNT OF ITEMS BY STATUS", "Count": df.to_dict(orient='records')[0]['sttus_count']},
                      {"Title":"COUNT OF ITEMS BY CATEGORY", "Count":df.to_dict(orient='records')[0]['category_count']}]
                       )

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

@bp1.route('/GetEntityAllTypeList', methods=['GET'])
def GetCategories():
    data = mobile.GetCategories().json()
    return data
