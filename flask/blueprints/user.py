from flask import Blueprint, request
from sql.cases import CasesSQL
import pandas as pd
import json 
import time
import numpy as np
from handlers.cases import CaseHandler
from flask_cors import CORS, cross_origin
bpu = Blueprint('people', __name__, url_prefix='/people')

db = CasesSQL()

@bpu.route('/find', methods=['POST'])
def getPeople():
    #needs to take in an app-id
    data = request.json
    df = db.get_people(data['skipCount'], data['maxCount'], data['searchText'])
    return df.to_json(orient='records')

@bpu.route('/department_fetch', methods=['POST'])
@cross_origin(supports_credentials=True)
def department_fetch():
    if request.method == 'POST':
        data = request.json
        df = db.department_fetch(data)
        return df.to_json(orient='records')

