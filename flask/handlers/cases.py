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
import datetime

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

    # def employee_fullname(self, short_name):
    #     return self.session.query(EmployeeDepartment).get(short_name).FULL_NAME

    def case_activity_log(self, case_ids):
        try:
            case_ids = case_ids.split(',')
            values = [{
                "label": "Case Activity Logss",
                "activity_id": instance.CASE_ACTIVITY_ID,
                "activity_type": self.session.query(CaseActivityType).get(instance.ACTIVITY_TYPE_ID).NAME,
                "activity_description": self.session.query(CaseActivityType).get(instance.ACTIVITY_TYPE_ID).DESCRIPTION,
                "case_id": instance.CASE_ID,
                "activity_note": instance.NOTE,
                "created_by": instance.MODIFIED_BY,
                "is_active": instance.IS_ACTIVE,
                "modified_by": instance.MODIFIED_BY,
                "created_datetime": str(instance.CREATED_DATETIME),
                "modified_datetime": str(instance.MODIFIED_DATETIME),
                "href": f"#/",
            } for instance in
                self.session.query(CaseActivityLog).filter(CaseActivityLog.CASE_ID.in_(case_ids)).all()]
            return json.dumps({
                "label": "Case Activity Logs",
                "href": "/Case Activity Logs",
                "description": "List of all case activity logs",
                "count": len(values),
                "requestMethod": "GET",
                "customData": [],
                "values": values})

        except Exception as exe:
            print(exe)
            return json.dumps({"error":str(exe)})

    def departments_data(self, maxCount):
        values = [{
            "label": "Department User List",
            "id": instance.EMPLOYEEID,
            "guid": instance.EMPLOYEE_GUID,
            "name": instance.EmpFirstName,
        } for instance in
            self.session.query(EmployeeDepartment)[:int(maxCount)]]
        return json.dumps({
            "label": "Departmets List Type",
            "href": "/cases/departments",
            "description": "List of all departments people",
            "count": len(values),
            "requestMethod": "GET",
            "customData": [],
            "values": values})

    def departments_data_byId(self, id):
        data = self.session.query(EmployeeDepartment).get(id)
        return json.dumps({
            "label": "Departmets List Type",
            "href": "/cases/departments",
            "description": "List of all departments people",
            "count": 1,
            "requestMethod": "GET",
            "customData": [],
            "values": {"id": data.EMPLOYEEID, "guid": data.EMPLOYEE_GUID, "name": data.EmpFirstName}})

    def system_code_list(self):
        import json
        values = [{
            "label": "System code List",
            "id": instance.ASSOC_SYSTEM_CODE_ID,
            "system_code": instance.SYSTEM_CODE,
            "system_code_level": instance.SYSTEM_CODE_LEVEL,
            "created_by": instance.CREATED_BY,
            "is_active": instance.IS_ACTIVE,
        } for instance in
            self.session.query(SystemCode)]
        return json.dumps({
            "label": "System Code",
            "href": "/System Code",
            "description": "List of all system codes",
            "count": len(values),
            "requestMethod": "GET",
            "customData": [],
            "values": values})

    def case_type_insert(self, data):
        """
        {"name":"test1", "instance_name":"test postman","created_by":"username",  "is_active":"N",
        "created_datetime":"2020-12-21 05:43:43.000", "modified_datetime":"2020-12-22 06:43:43.000",
        "modified_by":"username"}

        use above json to store case type in db via postman
        """
        for x in range(len(data.get("name"))):
            insert = CaseType.__table__.insert(None, isInline).values(NAME=data.get("name")[x]['name'],
                                                                  IS_ACTIVE=data.get("is_active"),
                                                                  CREATED_BY=data.get("created_by"),
                                                                  CREATED_DATETIME=datetime.datetime.now(),
                                                                  MODIFIED_DATETIME=datetime.datetime.now(),
                                                                  MODIFIED_BY=data.get("modified_by"))
            self.session.execute(insert)
            self.session.commit()
        return json.dumps({
            "label": "Assoc Type",
            "href": "/Case Type/Case_Type",
            "description": "List of all case Types",
            "count": [],
            "requestMethod": "POST",
            "customData": [],
            "values": [],
            "method":200})

    def assoc_type_insert(self,data):
        """
        {"name":"test", "assoc_field_type":"D","is_active":"N", "case_type_id": 18, "description":"testing from postman"
        , "system_code":"STS1", "created_by":"username", "system_priority":10, "show_on_list":"N", "is_required":"N",
        "created_datetime":"2020-12-21 05:43:43.000", "modified_datetime":"2020-12-22 06:43:43.000", "modified_by":"username"}

        use above json for add assoc type from postman and frontend
        """
        insert = AssocType.__table__.insert(None, isInline).values(NAME=data.get("name"),
                                                                   ASSOC_FIELD_TYPE=data.get("assoc_field_type"),
                                                                   IS_ACTIVE=data.get("is_active"),
                                                                   CASE_TYPE_ID=data.get("case_type_id"),
                                                                   DESCRIPTION=data.get("description"),
                                                                   SYSTEM_CODE=data.get("system_code"),
                                                                   CREATED_BY=data.get("created_by"),
                                                                   SYSTEM_PRIORITY=data.get("system_priority"),
                                                                   SHOW_ON_LIST=data.get("show_on_list"),
                                                                   IS_REQUIRED=data.get("is_required"),
                                                                   CREATED_DATETIME=data.get("created_datetime"),
                                                                   MODIFIED_DATETIME=data.get("modified_datetime"),
                                                                   MODIFIED_BY=data.get("modified_by"))
        self.session.execute(insert)
        self.session.commit()
        return json.dumps({
            "label": "Assoc Type added successfully",
            "href": "/Assoc Type/Case_Type",
            "description": "List of all case Types",
            "count": [],
            "requestMethod": "POST",
            "customData": [],
            "values": []})



