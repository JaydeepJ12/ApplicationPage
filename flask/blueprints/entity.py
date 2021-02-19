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
    df = db.entity_data(data['entityIds'])
    df_id = df.groupby('ENTITY_ID').ID.agg([('ID', ', '.join)])
    df_system_code = df.groupby('ENTITY_ID').SYSTEM_CODE.agg([('SYSTEM_CODE', ', '.join)])
    final_dataframe = pd.merge(df_id, df_system_code, on="ENTITY_ID")
    return final_dataframe.to_json(orient='records')


@bp1.route('/entity_systemcode_count', methods=['GET'])
def entity_systemcode_count():
    df = db.system_code_count()
    return json.dumps([{"total_count":df.to_dict(orient='records')[0]['total_count']},
                      {"sttus_count":df.to_dict(orient='records')[0]['sttus_count']},
                      {"category_count":df.to_dict(orient='records')[0]['category_count']}]
                       )