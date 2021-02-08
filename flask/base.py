from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
Base = declarative_base()


class Engine:
    ''' Holds the sqlalchemy engine connection for db models'''

    def __init__(self,
                 user='spreader',
                 passw='Red_Sky',
                 server='BPM-PGMT-2-2-1',
                 db='Departments',
                 driver='SQL+Server',
                 debug=False):
        self._engine = create_engine(f'mssql+pyodbc://{user}:{passw}@{server}/{db}?driver={driver}',
                                     echo=debug)

    def engine(self):
        return self._engine

    def session(self):
        Session = sessionmaker(bind=self._engine)
        return Session()


# user='Websiteuser_ent',
# passw='Ent@123',