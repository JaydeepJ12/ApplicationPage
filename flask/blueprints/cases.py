from flask import Blueprint, request
from sql.cases import CasesSQL
from stemmons.api import Cases

bp = Blueprint('cases', __name__, url_prefix='/cases')
db = CasesSQL()

cases = Cases('http://casesapi.boxerproperty.com/')
r = cases.token('user','pass') #store the token in the browser


@bp.route('/config')
def config():
    ctid = request.args.get('CaseTypeID')
    df = db.cases_type_form(ctid) # all calls to the CasesSql object will return a pandas data frame https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html

    return df.to_json(orient='records') #

@bp.route('/create')
def create():
    pass