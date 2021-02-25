from flask import Blueprint, request
import pandas as pd
from sql.visual import VisualSQL

bp = Blueprint('visuals', __name__, url_prefix='/visuals')
db = VisualSQL()

def status_graph(df):
    df = df[['Case Type','Status','Count']]
    print(df.groupby(['Case Type','Status']).count())
    return df.head()
def status_count_graph(df):
    pass

def assigned_to_graph(df):
    pass

def assigned_to_supervisor_graph(df):
    pass

@bp.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = '*'
    return r

@bp.route('/case_overview',methods=['GET'])
def case_overview():

    ctids = request.args.get('case_types','').split(',')
    print(ctids)
    df = db.open_case_data(ctids)
    print(len(df))
    print(status_graph(df))
    return df.to_json()

