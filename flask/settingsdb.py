# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
#
# Base = declarative_base()
#
#
# class Engine:
#     ''' Holds the sqlalchemy engine connection for db models'''
#
#     def __init__(self,
#                  user='spreader',
#                  passw='Red_Sky',
#                  server='bpm-sql140',
#                  db='BOXER_CME',
#                  driver='SQL+Server',
#                  debug=False):
#         self._engine = create_engine(f'mssql+pyodbc://{user}:{passw}@{server}/{db}?driver={driver}',
#                                      echo=debug)
#
#     # def engine(self):
#     #     return self._engine
#     #
#     # def session(self):
#     #     Session = sessionmaker(bind=self._engine)
#     #     return Session()