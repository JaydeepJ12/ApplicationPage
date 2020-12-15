# try:
#     from settingsdb import Base  # models.base
# except:
#     from settingsdb.base import Base
# from sqlalchemy import Table, Column, Integer, String, ForeignKey
#
# entity_type_category = Table('CASE_TYPE', Base.metadata,
#                              Column('CASE_TYPE_ID', Integer, primary_key=True),
#                              # Column('ENTITY_TYPE_ID', Integer, ForeignKey(case_assoc_type.c.ENTITY_TYPE_ID)),
#                              Column('NAME', String),
#                              Column('INSTANCE_NAME', String),
#                              Column('INSTANCE_NAME_PLURAL', String),
#                              Column('IS_DEFAULT', String),
#                              Column('IS_ACTIVE', String),
#                              Column('CREATED_BY', String),
#                              Column('MODIFIED_BY', String),
#                              )