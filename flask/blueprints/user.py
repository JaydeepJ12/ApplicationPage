from flask import Blueprint, request
from utils import cases, mobile
from sql.cases import CasesSQL
import pandas as pd
import json 
import time
import numpy as np
from handlers.cases import CaseHandler

bp = Blueprint('people', __name__, url_prefix='/people')

db = CasesSQL()

@bp.route('/find', methods=['POST'])
def getPeople():
    #needs to take in an app-id
    data = request.json
    df = db.get_people(data['skipCount'], data['maxCount'], data['searchText'])

    return df.to_json(orient='records') 