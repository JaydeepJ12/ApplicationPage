try: from base import Base #models.base
except: from models.base import Base
from sqlalchemy import Table, Column, Integer, String, ForeignKey

case_type = Table('CASE_TYPE', Base.metadata,
                    Column('CASE_TYPE_ID', Integer, primary_key=True),
                    Column('NAME', String),
                    Column('INSTANCE_NAME', String),
                    Column('IS_ACTIVE', String),
                    Column('CREATED_BY', String),
                    Column('CREATED_DATETIME', String),
                    Column('MODIFIED_DATETIME', String),
                    Column('MODIFIED_BY', String),
                   )

assoc_type = Table('ASSOC_TYPE', Base.metadata,
                    Column('ASSOC_TYPE_ID', Integer, primary_key=True),
                    Column('NAME', String),
                    Column('ASSOC_FIELD_TYPE', String),
                    Column('DESCRIPTION', String),
                    Column('SYSTEM_CODE', String),
                    Column('SHOW_ON_LIST', String),
                    Column('IS_REQUIRED', String),
                    Column('IS_ACTIVE', String),
                    Column('SYSTEM_PRIORITY', Integer),
                    Column('CASE_TYPE_ID', Integer, ForeignKey('case_type.CASE_TYPE_ID')),
                    Column('CREATED_BY', String),
                    Column('CREATED_DATETIME', String),
                    Column('MODIFIED_DATETIME', String),
                    Column('MODIFIED_BY', String),
                   )

