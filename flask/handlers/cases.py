try:
    from base import Engine, Base  # models.base
except:
    from models.base import Engine, Base
try:
    from models.cases.serializers import *
except:
    from models.cases.serializers import *
import base64


# Everythings i could need to know about case types should be found here

class Response:

    def label_value_date(self, label, value, created):
        return {
            "label": label,
            "value": value,
            "date": created
        }

    def typeId(self, id):
        return {'typeId': id}


class CaseHandler(Response):
    '''combine all tables ot get everything we want. May need to subdivide by type, but we
     will see'''

    def __init__(self):
        engine = Engine()
        self.session = engine.session()

    def assoc_type_data(self):
        import json
        values = [{
            "label": "Each Assoc Type",
            "id": instance.ASSOC_TYPE_ID,
            "created_by": instance.CREATED_BY,
            "is_active": instance.IS_ACTIVE,
            "name": instance.NAME,
            "href": f"#/",
        } for instance in
            self.session.query(AssocType)]
        return json.dumps({
            "label": "Assoc Type",
            "href": "/Asoc Type/Assoc_Type",
            "description": "List of all Assoc Types",
            "count": len(values),
            "requestMethod": "GET",
            "customData": [],
            "values": values})
