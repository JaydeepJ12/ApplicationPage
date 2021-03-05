from stemmons import Stemmons_Dash_App
import pandas as pd
import plotly.express as px

class EntitySQL:
    ''' shoudl handle all sql calls involving cases, transformation and db call should be separate '''

    def __init__(self):
        self.db = Stemmons_Dash_App()

    def tuplefy(self, id):
        if isinstance(id, list) and len(id) > 1:
            #print(f'APP THING: {id}')
            id = tuple(id)
        else:
            #print(f'APP NOT THING: {id}')
            id = f'({id[0]})'

        return id

    def type_list_by_id(self, id):
        ''' Id is an applicaiton id'''
        query = f''' SELECT E.ENTITY_ID as [ID],FIELD_VALUE as [Entity Types], EXTERNAL_DATASOURCE_OBJECT_ID as [EID]--, etid.TEXT as [ETID]
   FROM  [BOXER_ENTITIES].[DBO].[ENTITY] E 
   INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_TYPE EAT ON E.ENTITY_TYPE_ID=EAT.ENTITY_TYPE_ID AND EAT.IS_ACTIVE='Y' and EAT.SYSTEM_CODE= 'ASSET'
   INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_METADATA EAM ON E.ENTITY_ID=EAM.ENTITY_ID AND EAT.ENTITY_ASSOC_TYPE_ID=EAM.ENTITY_ASSOC_TYPE_ID and EAM.IS_ACTIVE='Y' 
   
   WHERE  E.ENTITY_ID =   {id} '''

        return self.db.execQuery(query) 

    def list_by_id(self, id, max_count=25, offset=0, ):
        ''' Id is an applicaiton id'''
        query = f''' SELECT [ENTITY_ID]
      ,[ENTITY_TYPE_ID]
      ,[TITLE_METADATA_TEXT] as [Title]
  FROM [BOXER_ENTITIES].[dbo].[ENTITY_LIST]

  where ENTITY_TYPE_ID = ( SELECT  [TEXT] as ETID
    
								  FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT]
								   where entity_id = {id}
								   and
								   IS_ACTIVE = 'Y'
								   and 
								ENTITY_ASSOC_TYPE_ID in  (
													SELECT [ENTITY_ASSOC_TYPE_ID]
														FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE]
													where system_code = 'EXTPK'))

	order by entity_id desc
	OFFSET {offset} ROWS FETCH NEXT {max_count} ROWS ONLY'''
   
        return self.db.execQuery(query )

    def entity_by_id(self, eid):
        ''' id is entity is'''
        pass