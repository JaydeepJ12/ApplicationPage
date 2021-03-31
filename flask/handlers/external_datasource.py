import sqlite3
import pyodbc 
from stemmons import Stemmons_Dash_App
from cache import _cache


class ExternalData:

    def __init__(self,):
        self.conn = Stemmons_Dash_App().db.conn

    
    def fetch(self, id):
        ''' addembles methods to fetch data '''
        #get data for external data source from db
        conn_str, query = self.get_ext_info(id)

        # format fetched info and created connection to pointed db
        
        if conn_str != None:
            server, uid, pwd = self.dissemble_string(conn_str)
            conn = self.create_conn(server, uid, pwd)
        else:
            conn = self.conn
        return self.fetch_external_data(conn, query)

    def get_ext_info(self,  id):
        raise NotImplementedError('Must be subclassed and implemented in child class')

    def dissemble_string(self, conn_str):
        ''' takes in the conn stringfrom db, note if this is enplty should use local db connection
        from this form:
        Data Source=BPM-SQL120.boxerproperty.com;Initial Catalog=BoxerDirectory;
        Persist Security Info=True;User ID=spreader;Password=Red_Sky
        
        to this form:
            //(server, catalog,_, uid, password)
            (server, uid, pwd)
        '''
        
        #server, catalog, _, uid, pwd = conn_str.split(';')

        server, catalog, _, uid, pwd = [i.split('=')[1] for i in conn_str.split(';')]
        #return (server, catalog, _, uid, pwd)
        return server, uid, pwd
        
    def create_conn(self, server, uid, pwd):
        'returns and instance of pyodbc connection object'
        
        return pyodbc.connect(  'Driver={ODBC Driver 17 for SQL Server};'
                                        f'Server={server};'       #from parent
                                        # 'Database=FACTS;'             #may want to let people choose this later on                            
                                        f'UID={uid};'            #from parent
                                        f'PWD={pwd}',
                                        autocommit=False)
    def format_query(self, query):
        ''' for pydbc, each command needs to be executed on the same connectiong, two commands can't be sed in the same server.
        
        If use *table name* is on the first line, 
            returns 'use *table name*', main_query
        
        otherwise,
            return None, main_query
        '''
        split = query.split('\n')
        #remove all
        [split.pop(i[0]) for i in enumerate(split) if len(i[1])==0 ]

        if 'use ' in split[0].lower():
            # return top, bottom
            return split[0], '\n'.join(split[1:])

        else:
            return None, query
        
    def fetch_external_data(self, conn, query):
        ''' should assble methods to fetch external data from external datasource outputs,
        takes in the correct local connection'''
        
        use_statement, query = self.format_query(query)
        
        #execute use statement for connection context
        if use_statement != None:
            conn.execute(use_statement)

        return conn.execute(query).fetchall()


class ExtTest(ExternalData):
    pass

class ExtCase(ExternalData):

    def get_ext_info(self,  id):
        query = '''
       SELECT
     [CONNECTION_STRING]
      ,[QUERY]
  FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_EXTERNAL_DATASOURCE]
  where ENTITY_ASSOC_EXTERNAL_DATASOURCE_ID = ? and is_active = 'Y'
        '''
        conn_str, query = self.conn.execute(query,(id,)).fetchone()
        return conn_str, query 

class ExtEntity(ExternalData):

    def get_ext_info(self,  id):
        query = '''
        SELECT [CONNECTION_STRING]
      ,[QUERY]
        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_EXTERNAL_DATASOURCE]
        where [ENTITY_ASSOC_EXTERNAL_DATASOURCE_ID] = ?
        '''
        conn_str, query = self.conn.execute(query,(id,)).fetchone()
        return conn_str, query 


class MemeryTable:
    pass


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn

def relationship_table(conn):
    ''' before creating memory table, need to be sure that there isnt already a table for given field in memory already'''

    #Do we want to include date time, not drop and delete tables/rows, and just let it buld up over time
    command = f'''
    CREATE TABLE IF NOT EXISTS relationships(
                                            Field_ID integer PRIMARY KEY,
                                            Table_ID text NOT NULL
                                        );
    '''
    return conn.execute(command)

def create_table(conn, name):
    ''' takes a name and connection, creates table with name with columns id and name,
    returns cursor from executions'''
    
    
    command = f'''
    CREATE TABLE IF NOT EXISTS {name} (
                                            ID integer PRIMARY KEY,
                                            NAME text NOT NULL
                                        );
                                        
    '''
    return conn.execute(command)

def insert_query(table, values):
    ''' Generates a query to insert id and name columns into local table '''
    values = [f"('{i[0]}','{i[1]}')" for i in values]
    return f"INSERT INTO '{table}' (id, name) VALUES {','.join(values)};"

def check_id_exists(conn, id):
    ''' If this value is in the table, return true, elseo return false '''
    
    query = ''' 
    select * from relationships where Field_ID = ?
    '''
    if conn.execute(query,(id,)).fetchone():
        return True
    else:
        return False