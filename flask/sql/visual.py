from stemmons import Stemmons_Dash_App
import pandas as pd
import plotly.express as px

class VisualSQL:
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
    
    def open_case_data(self, id):

        id = self.tuplefy(id)

        query = f'''
       SELECT top 100
[LIST_CASE_ID] as [Case ID]
      ,[LIST_CASE_ID] as [Count]
	  ,[LIST_CASE_TYPE_NAME] as [Case Type]
	  ,[LIST_CASE_TITLE] as [Case Title]
      ,(SELECT top 1 [VALUE]
		  FROM [BOXER_CME].[dbo].[CONFIG_SYSTEM]
		  where SYSTEM_CODE = 'VCASE') + '?CaseID='+trim(str([LIST_CASE_ID]) ) as [Case URL] --this will have to be altered
	  ,case when [LIST_CASE_DUE] = '' then 'No Due Date'
			when try_cast([LIST_CASE_DUE] as date) < cast(GETDATE() as date) then 'Past Due'
			when try_cast([LIST_CASE_DUE] as date) > cast(GETDATE() as date) then 'Not Due' 
			when try_cast([LIST_CASE_DUE] as date) = cast(GETDATE() as date) then 'Due'
			else 'No Due Date' end as [Due Status]
	  ,[LIST_CASE_DUE] as [Due Date]
	  ,[LIST_CASE_STATUS_VALUE]  as [Status]
	  ,[LIST_CASE_PRIORITY_VALUE] as [Priority]
	  ,[LIST_CASE_ASSGN_TO_SAM] as [Assigned To SAM]
      ,[LIST_CASE_ASSGN_TO_DISPLAY_NAME] as [Assigned To]    
	  ,[LIST_CASE_CREATED_BY_SAM]  as [Created By SAM]
      ,[LIST_CASE_CREATED_BY_DISPLAY_NAME] as [Created By]
	  ,convert(date, [LIST_CASE_CREATED_DATETIME]) as [Created Date]
      ,convert(date, [LIST_CASE_CLOSED_DATETIME]) as [Closed Date]
		
  FROM [BOXER_CME].[dbo].[CASE_LIST]
	where [LIST_CASE_CLOSED_DATETIME] is null
	and [LIST_CASE_TYPE_ID]={id}
  '''   
        print(query)
        return self.db.execQuery(query)
