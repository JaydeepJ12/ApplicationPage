try:
    from base import Engine, Base  # models.base
except:
    from models.base import Engine, Base
try:
    from .case_tables import *
except:
    from .case_tables import *


class AssocType(Base):
    __table__ = assoc_type
    __mapper_args__ = {
        'include_properties': ['ASSOC_TYPE_ID', 'NAME', 'ASSOC_FIELD_TYPE', 'CASE_TYPE_ID',
                               'DESCRIPTION', 'SYSTEM_CODE', 'SYSTEM_PRIORITY', 'SHOW_ON_LIST',
                               'IS_REQUIRED', 'IS_ACTIVE', 'CREATED_DATETIME', 'CREATED_BY', 'MODIFIED_DATETIME',
                               'MODIFIED_BY']
    }


class CaseType(Base):
    __table__ = case_type
    __mapper_args = {
        'include_properties': ['CASE_TYPE_ID', 'NAME', 'INSTANCE_NAME', 'IS_ACTIVE', 'CREATED_BY',
                               'CREATED_DATETIME', 'MODIFIED_DATETIME', 'MODIFIED_BY']
    }


class SystemCode(Base):
    __table__ = system_code
    __mapper_args = {
        'include_properties': ['ASSOC_SYSTEM_CODE_ID', 'SYSTEM_CODE', 'SYSTEM_CODE_LEVEL', 'SYSTEM_CODE_NAME',
                               'IS_ACTIVE',
                               'CREATED_DATETIME', 'MODIFIED_DATETIME', 'MODIFIED_BY', 'CREATED_BY']
    }


class CaseActivityLog(Base):
    __table__ = case_activity_log
    __mapper_args = {
        'include_properties': ['CASE_ACTIVITY_ID', 'CASE_ID', 'IS_ACTIVE', 'NOTE',
                               'CREATED_DATETIME', 'MODIFIED_DATETIME', 'MODIFIED_BY', 'CREATED_BY']
    }


class EmployeeDepartment(Base):
    __table__ = departments_employee
    __mapper_args = {
        'include_properties': ['EMPLOYEE_GUID', 'EMPLOYEEID', 'EmpFirstName']
    }