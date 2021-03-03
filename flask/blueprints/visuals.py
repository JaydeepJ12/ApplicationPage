from flask import Blueprint, request
import pandas as pd
import json
from sql.visual import VisualSQL

bp = Blueprint('visuals', __name__, url_prefix='/visuals')
db = VisualSQL()

def react_data(df, name_col='Case Type', id_col='Status', val_col='Count', drop=True):
    ''' Takes in a data frame, outputs the revis data format based off of input columns
    drop is used for stacked bar type graphs
    {'name': 'Ad-Hoc Project',
  'Hold': 2,
  'New': 67,
  'Researching': 12,
  'Work in Progress': 17
    
    '''
    results = []
    for i in df[name_col].unique():

        group = df[df[name_col]==i]
        if drop:
            group = group.drop(name_col, axis=1)

        d = {'name':i}
        for label, val in zip(group[id_col],group[val_col]):
            d.update({label:val})


        results.append(d)
    return results

def status_graph(df):
    df = df[['Case Type','Due Status','Count']]
    df = df.groupby(['Case Type','Due Status']).count().reset_index()
    print(df)
    return react_data(df,
        name_col='Case Type',
        id_col='Due Status',
        val_col='Count')

def status_by_priority_graph(df):
    df = df[['Status','Count']]
    df = df.groupby(['Status']).count().reset_index()
    print(df)
    return react_data(df,
        name_col='Status',
        id_col='Status',
        val_col='Count', 
        drop=False)

#could even abstract one layed up if i wanted
def assigned_to_graph(df):
    df = df[['Assigned To','Due Status','Count']]
    df = df.groupby(['Assigned To', 'Due Status']).count().reset_index()
    print(df)
    return react_data(df,
        name_col='Assigned To',
        id_col='Due Status',
        val_col='Count')

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
    ## for dev just serve static data
    df = db.open_case_data(ctids)
    
    
    return json.dumps({
        'count_by_status_priority':status_graph(df),
        'count_by_status':status_by_priority_graph(df),
        'count_by_assigned_to':assigned_to_graph(df),
        'count_by_assigned_to_supervisor':''
    })

