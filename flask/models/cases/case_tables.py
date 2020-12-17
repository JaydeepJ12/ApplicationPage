try: from base import Base #models.base
except: from models.base import Base
from sqlalchemy import Table, Column, Integer, String, ForeignKey


assoc_type = Table('ASSOC_TYPE', Base.metadata,
                    Column('ASSOC_TYPE_ID', Integer, primary_key=True),
                    Column('NAME', String),
                    Column('IS_ACTIVE', String),
                    Column('CREATED_BY', String),
                   )
