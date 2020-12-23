try:
    from base import Engine, Base  # models.base
except:
    from models.base import Engine, Base
try:
    from models.cases.serializers import *
except:
    from models.cases.serializers import *
import json
isInline = True
from sqlalchemy import insert
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

    def case_type_data(self):
        import json
        values = [{
            "label": "Case Type List",
            "id": instance.CASE_TYPE_ID,
            "name": instance.NAME,
            "instance_name": instance.INSTANCE_NAME,
            "created_by": instance.CREATED_BY,
            "is_active": instance.IS_ACTIVE,
            "href": f"#/",
        } for instance in
            self.session.query(CaseType)]
        return json.dumps({
            "label": "Assoc Type",
            "href": "/Case Type/Case_Type",
            "description": "List of all case Types",
            "count": len(values),
            "requestMethod": "GET",
            "customData": [],
            "values": values})

    def case_type_insert(self):
        insert = CaseType.__table__.insert(None, isInline).values(NAME="test", INSTANCE_NAME="sat_test", IS_ACTIVE="N",
                                                                  CREATED_BY="satishp",
                                                                  CREATED_DATETIME="2020-12-21 05:43:43.000",
                                                                  MODIFIED_DATETIME="2020-12-22 06:43:43.000",
                                                                  MODIFIED_BY="satishp")
        self.session.execute(insert)
        self.session.commit()
        return json.dumps({
            "label": "Assoc Type",
            "href": "/Case Type/Case_Type",
            "description": "List of all case Types",
            "count": [],
            "requestMethod": "POST",
            "customData": [],
            "values": case_type.compile().params})

    def assoc_type_insert(self):
        insert = AssocType.__table__.insert(None, isInline).values(NAME="test_assoc",
                                                                   ASSOC_FIELD_TYPE='D', IS_ACTIVE="N", CASE_TYPE_ID=18,
                                                                   DESCRIPTION="tested assoc type added",
                                                                   SYSTEM_CODE="STTUS",
                                                                   CREATED_BY="satishp", SYSTEM_PRIORITY=10,
                                                                   SHOW_ON_LIST="N", IS_REQUIRED="N",
                                      
                                                                   CREATED_DATETIME="2020-12-21 05:43:43.000",
                                                                   MODIFIED_DATETIME="2020-12-22 06:43:43.000",
                                                                   MODIFIED_BY="satishp")
        self.session.execute(insert)
        self.session.commit()
        return json.dumps({
            "label": "Assoc Type added successfully",
            "href": "/Assoc Type/Case_Type",
            "description": "List of all case Types",
            "count": [],
            "requestMethod": "POST",
            "customData": [],
            "values": insert.compile().params})
