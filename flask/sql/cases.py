from stemmons import Stemmons_Dash_App
import pandas as pd
import plotly.express as px


class CasesSQL:
    ''' shoudl handle all sql calls involving cases, transformation and db call should be separate '''

    def __init__(self):
        self.db = Stemmons_Dash_App()

    def tuplefy(self, id):
        if isinstance(id, list) and len(id) > 1:
            # print(f'APP THING: {id}')
            id = tuple(id)
        else:
            # print(f'APP NOT THING: {id}')
            id = f'({id[0]})'

        return id

    def cases_type_form(self, id):
        
        query = '''
        SELECT [ASSOC_TYPE_ID] as AssocTypeId
                ,[ASSOC_FIELD_TYPE] as AssocFieldType
                ,[CASE_TYPE_ID] as CaseTypeId
                ,[NAME] as [Name]
                ,[DESCRIPTION] as Description
                ,[EXTERNAL_DATASOURCE_ID] as ExternalDataSourceId
                ,[SYSTEM_CODE] as SystemCode
                ,[SYSTEM_PRIORITY] as SystemPriority
                ,[SHOW_ON_LIST] as ShowOnList
                ,[UI_WIDTH] as UiWidth
                ,[IS_REQUIRED] as IsRequired
                ,[IS_ACTIVE] as IsActive
  
            FROM [BOXER_CME].[dbo].[ASSOC_TYPE]
            where is_active = 'Y'
            and CASE_TYPE_ID = ?
            order by SYSTEM_PRIORITY asc
        '''
        return self.db.execQuery(query, params = (id,))

    def cases_types(self):
        query = f'''
        SELECT CT.CASE_TYPE_ID,CT.NAME,CASE_TYPE_OWNER, 
        CH.[NAME] As HopperName 
        FROM [BOXER_CME].[dbo].[CASE_TYPE] AS CT
        INNER JOIN [BOXER_CME].[dbo].[CASE_HOPPER] AS CH ON CT.DEFAULT_HOPPER_ID = CH.HOPPER_ID
        WHERE CT.IS_ACTIVE = 'Y'
        '''
        return self.db.execQuery(query)

    def get_entities_by_entity_id(self, entityId):
        query = f'''
        SELECT a.[ENTITY_ID] ,
        [FIELD_VALUE] AS [NAME] ,
        [EXTERNAL_DATASOURCE_OBJECT_ID] AS [EXID] ,
        b.[SYSTEM_CODE]
        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA] a
        JOIN 
            (SELECT [ENTITY_ASSOC_TYPE_ID],
                [SYSTEM_CODE]
            FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE]
            WHERE ENTITY_TYPE_ID = 
                (SELECT top 1 [ENTITY_TYPE_ID]
                FROM [BOXER_ENTITIES].[dbo].[ENTITY_TYPE]
                WHERE SYSTEM_CODE = 'USCSE')
                        AND is_active = 'Y'
                        AND SYSTEM_CODE IN ( 'TITLE', 'DESC', 'ASSCT', 'ASSET', 'ASSQF', 'ASSJB', 'ASSSD', 'ASSRP', 'DPTLV', 'DPTBN', 'DPTSD', 'DPTJF', 'DPTJT', 'SICON', 'APPPT', 'USCAL' ))b
                ON a.ENTITY_ASSOC_TYPE_ID = b.ENTITY_ASSOC_TYPE_ID
        LEFT JOIN [BOXER_ENTITIES].[dbo].ENTITY e
            ON a.ENTITY_ID = e.ENTITY_ID
        WHERE a.IS_ACTIVE = 'Y'
                AND e.IS_ACTIVE = 'Y'
                AND EXTERNAL_DATASOURCE_OBJECT_ID is NOT null
                AND a.[ENTITY_ID] = {entityId}
        UNION
        SELECT [ENTITY_ID] ,
                [TEXT] AS [NAME] ,
                [ENTITY_FILE_ID] AS [EXID] ,
                b.SYSTEM_CODE
        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT] a
        JOIN 
            (SELECT [ENTITY_ASSOC_TYPE_ID],
                [SYSTEM_CODE]
            FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE]
            WHERE ENTITY_TYPE_ID = 
                (SELECT top 1 [ENTITY_TYPE_ID]
                FROM [BOXER_ENTITIES].[dbo].[ENTITY_TYPE]
                WHERE SYSTEM_CODE = 'USCSE')
                        AND is_active = 'Y'
                        AND SYSTEM_CODE IN ('APICN')) b
                ON a.ENTITY_ASSOC_TYPE_ID = b.ENTITY_ASSOC_TYPE_ID
                AND a.[ENTITY_ID] = {entityId}
        ORDER BY  b.[SYSTEM_CODE] 
        '''
        return self.db.execQuery(query)

    def case_types_by_entity_id(self, entityIds):
        query = f'''
        SELECT CH.[NAME] As HopperName, CT.* FROM [BOXER_CME].[dbo].[CASE_TYPE] AS CT 
        INNER JOIN [BOXER_CME].[dbo].[CASE_HOPPER] AS CH ON CT.DEFAULT_HOPPER_ID = CH.HOPPER_ID
        WHERE CT.IS_ACTIVE = 'Y' AND CASE_TYPE_ID IN
            (SELECT [TEXT] AS ID
            FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT] a
            LEFT JOIN [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type] b
                ON a.[ENTITY_ASSOC_TYPE_ID] = b.[ENTITY_ASSOC_TYPE_ID]
            WHERE entity_id IN ({entityIds})
                    AND a.is_active = 'Y'
                    AND a.[ENTITY_ASSOC_TYPE_ID] IN 
                (SELECT ENTITY_ASSOC_TYPE_ID
                FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type]
                WHERE entity_type_id IN 
                    (SELECT top 1 ENTITY_TYPE_ID
                    FROM [BOXER_ENTITIES].[dbo].entity_list
                    WHERE entity_id IN ({entityIds}) )
                            AND ( SYSTEM_CODE IN ( 'EXTPK' , 'QSAID', 'URL', 'SBTTL' ) ) ) )
        '''
        return self.db.execQuery(query)

    def assoc_decode(self, id):
        query = f'''
        SELECT ASSOC_DECODE_ID as DecodeId, NAME as DecodeValue FROM [BOXER_CME].[dbo].[ASSOC_DECODE]
            where is_active = 'Y'
            and ASSOC_TYPE_ID = {id}
            order by SYSTEM_PRIORITY asc
        '''
        return self.db.execQuery(query)

    def caseassoctypecascade(self, caseTypeId):
        query = f'''
        SELECT CATS.CASE_ASSOC_TYPE_CASCADE_ID,CATS.CASE_ASSOC_TYPE_ID_PARENT,CATS.CASE_ASSOC_TYPE_ID_CHILD    
            FROM [BOXER_CME].[dbo].[CASE_ASSOC_TYPE_CASCADE] CATS WITH (NOLOCK)      
            INNER JOIN [BOXER_CME].[dbo].[ASSOC_TYPE] AT WITH (NOLOCK) ON AT.ASSOC_TYPE_ID = CATS.CASE_ASSOC_TYPE_ID_PARENT AND AT.IS_ACTIVE ='Y' AND CATS.IS_ACTIVE = 'Y'    
            INNER JOIN [BOXER_CME].[dbo].[CASE_TYPE] CT WITH (NOLOCK) ON AT.CASE_TYPE_ID = CT.CASE_TYPE_ID AND CT.IS_ACTIVE= 'Y'    
            WHERE CT.CASE_TYPE_ID = {caseTypeId}     
            AND (AT.ASSOC_FIELD_TYPE = 'E' OR AT.ASSOC_FIELD_TYPE = 'O')  
        '''
        return self.db.execQuery(query)

    def assignee_case_types(self, case_type_ids):
        if case_type_ids is None:
            case_type_ids = 19
        query = f"""
        Declare @case_type_id as nvarchar(max)='19,6'
        Select Assigned_to_Display_Name
        ,MAX(A.Past_due_case) AS Past_due_case
        ,MAX(A.Not_Due) As  Not_Due
        ,MAX(A.No_due_date) As No_due_date

        from
        (
        SELECT Assigned_to_Display_Name
         ,count (CL.Case_id)  As Past_due_case
        , NULL as Not_Due
        , Null as No_due_date
        FROM [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) < Try_Convert(Date,Getdate()) 
        And IS_active='Y'and Case_Type_ID in (19,6)
        Group By [Assigned_to_Display_Name]


        UNION

        SELECT Assigned_to_Display_Name
        ,NULL As Past_due_case
        ,Count(CL.Case_id) as Not_Due
        ,NULL as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) > Try_Convert(Date,Getdate()) 
        And IS_active='Y'  And Case_Type_ID In (19,6)
        Group By [Assigned_to_Display_Name]

        Union
        SELECT Assigned_to_Display_Name
        ,NUll As Past_due_case
        ,NULL as Not_Due
        ,Count(CL.Case_id) as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')=''
        And IS_active='Y'   and Case_Type_ID In (19,6)
        Group By [Assigned_to_Display_Name]

        )A

        Group BY Assigned_to_Display_Name
        """
        return self.db.execQuery(query)

    def case_type_count_dues(self, case_type_ids):
        if case_type_ids is None:
            case_type_ids = 19
        query = f"""
                Select [Case_Type_Name]
        ,MAX(A.Past_due_case) AS Past_due_case
        ,MAX(A.Not_Due) As  Not_Due
        ,MAX(A.No_due_date) As No_due_date

        from
        (
        SELECT [Case_Type_Name]
        ,Count(CL.Case_id)  As Past_due_case
        , NULL as Not_Due
        , Null as No_due_date
        FROM [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) < Try_Convert(Date,Getdate()) 
        And IS_active='Y'  
        Group By [Case_Type_Name]

        UNION

        SELECT [Case_Type_Name]
        ,NULL As Past_due_case
        ,Count(CL.Case_id) as Not_Due
        ,NULL as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) > Try_Convert(Date,Getdate()) 
        And IS_active='Y'  
        Group By [Case_Type_Name]


        Union

        SELECT [Case_Type_Name]
        ,NUll As Past_due_case
        ,NULL as Not_Due, Count(CL.Case_id) as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
        And IS_active='Y'  
        Group By [Case_Type_Name]

        ) A

        Group BY [Case_Type_Name]
        """
        return self.db.execQuery(query)

    def assigne_supervisor(self, case_type_ids):
        if case_type_ids is None:
            case_type_ids = 20
        query = f"""
            Declare @case_type_id as nvarchar(max)='19,6'

            Select By_Assignee_Supervisor
            ,MAX(A.Past_due_case) AS Past_due_case
            ,MAX(A.Not_Due) As  Not_Due
            ,MAX(A.No_due_date) As No_due_date

            from
            (
            SELECT By_Assignee_Supervisor
             ,count (CL.Case_id)  As Past_due_case
            , NULL as Not_Due
            , Null as No_due_date
            FROM [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
            Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
             And Try_Convert(date,[Due Date]) < Try_Convert(Date,Getdate()) 
            And IS_active='Y'and Case_Type_ID in ({case_type_ids})
            Group By [By_Assignee_Supervisor]


            UNION

            SELECT By_Assignee_Supervisor
            ,NULL As Past_due_case
            ,Count(CL.Case_id) as Not_Due
            ,NULL as No_due_date
            FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
            Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
             And Try_Convert(date,[Due Date]) > Try_Convert(Date,Getdate()) 
            And IS_active='Y'  And Case_Type_ID In ({case_type_ids})
            Group By [By_Assignee_Supervisor]

            Union
            SELECT By_Assignee_Supervisor
            ,NUll As Past_due_case
            ,NULL as Not_Due
            ,Count(CL.Case_id) as No_due_date
            FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
            Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')=''
            And IS_active='Y'   and Case_Type_ID In ({case_type_ids})
            Group By [By_Assignee_Supervisor]

            )A

            Group BY By_Assignee_Supervisor
            """
        print(self.db.execQuery(query))
        return self.db.execQuery(query)

    def case_type_count_all(self, case_type_ids):
        print(case_type_ids)
        if case_type_ids is None:
            case_type_ids = 19
        query = f'''
        Select 
        MAX(A.Past_due_case) AS Past_due_case
        ,MAX(A.Not_Due) As  Not_Due
        ,MAX(A.No_due_date) As No_due_date

        from
        (


        SELECT 
        count (CL.Case_id)  As Past_due_case
        , NULL as Not_Due
        , Null as No_due_date
        FROM [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) < Try_Convert(Date,Getdate()) 
        And IS_active='Y'and Case_Type_ID in ({case_type_ids})


        UNION

        SELECT 
        NULL As Past_due_case
        ,Count(CL.Case_id) as Not_Due
        ,NULL as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
         And Try_Convert(date,[Due Date]) > Try_Convert(Date,Getdate()) 
        And IS_active='Y'  And Case_Type_ID in ({case_type_ids})
        Group By [Case_Type_Name]

        Union
        SELECT 
        NUll As Past_due_case
        ,NULL as Not_Due
        ,Count(CL.Case_id) as No_due_date
        FROM  [FACTS].[DBO].[CASE_LIST] CL With(Nolock) 
        Where  coalesce([CaseClosed date],'')='' and coalesce([Due Date],'')<>''
        And IS_active='Y'   and Case_Type_ID in ({case_type_ids}) 
        Group By [Case_Type_Name]

        )A '''

        return self.db.execQuery(query)

    def get_user_fullname(self, userShortName):
        query = f'''
        SELECT TOP 1 FULL_NAME FROM [BOXER_CME].[dbo].[CME_USER_CACHE] WHERE SHORT_USER_NAME in ('{userShortName}') ORDER BY 1 DESC
        '''
        return self.db.execQuery(query)

    def get_system_priority(self, assocTypeId):
        try:
            query = f'''
            SELECT SYSTEM_PRIORITY FROM [BOXER_CME].[dbo].[ASSOC_TYPE] WHERE ASSOC_TYPE_ID = {assocTypeId} ORDER BY 1 DESC
            '''
            return self.db.execQuery(query)
        except:
            return '[]'

    def get_people(self, skipCount, maxCount, searchText=''):
        query = f'''
           	SELECT
            c.SHORT_USER_NAME AS ShortUserName,
            c.DISPLAY_NAME AS FullName,
            c.CREATED_DATETIME AS CreatedDate,
            COUNT(*) AS TotalCount
            FROM [BOXER_CME].[dbo].[CME_USER_CACHE] AS c
            INNER JOIN [BOXER_CME].[dbo].[CASE_LIST] AS b ON b.LIST_CASE_ASSGN_TO_SAM = c.SHORT_USER_NAME
            WHERE IS_ACTIVE = 'Y' AND COALESCE(IS_EXTERNAL_USER,'N')='N'
            AND DISPLAY_NAME Like CASE WHEN '{searchText}' = '' THEN DISPLAY_NAME ELSE '%' + '{searchText}' + '%' END
            GROUP BY c.DISPLAY_NAME, c.SHORT_USER_NAME ,c.CREATED_DATETIME
            ORDER BY 1 ASC
            offset {skipCount} rows
            FETCH NEXT {maxCount} rows only
        '''
        return self.db.execQuery(query)

    def get_department_emp_filters(self, parentName, parentID, entityId):

        if parentName == 'topLevel':
            query = f'''
                    Select DEPARTMENT_STRUCTURE_BASIC_NAME_ID as ID, NAME , 'BASIC NAME' as Level from [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_BASIC_NAME] WITH(NOLOCK) where DEPARTMENT_STRUCTURE_TOP_LEVEL_ID={parentID}
                '''
        elif parentName == 'basicName':
            query = f'''
                    Select DEPARTMENT_STRUCTURE_SUB_DEPARTMENT_ID as ID, NAME ,'SUB DEPARTMENT'as Level from [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_SUB_DEPARTMENT]  WITH(NOLOCK) where DEPARTMENT_STRUCTURE_BASIC_NAME_ID={parentID}
                '''
        elif parentName == 'subDepartment':
            query = f'''
                    Select DEPARTMENT_STRUCTURE_JOB_FUNCTION_ID as ID, NAME ,'JOB FUNCTION'as Level from [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_JOB_FUNCTION] WITH(NOLOCK) where DEPARTMENT_STRUCTURE_SUB_DEPARTMENT_ID={parentID}
                '''
        elif parentName == 'jobFunction':
            query = f'''
                    Select DEPARTMENT_STRUCTURE_JOB_TITLE_ID as ID, NAME ,'JOB TITLE'as Level from [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_JOB_TITLE]  WITH(NOLOCK) where DEPARTMENT_STRUCTURE_JOB_FUNCTION_ID={parentID}
                '''
        else:
            query = f'''
                    SELECT 
                    DSTL.DEPARTMENT_STRUCTURE_TOP_LEVEL_ID AS ID
                    ,DSTL.[NAME] 
                    ,'TOP??LEVEL'??as??[Level]
                    FROM  [BOXER_ENTITIES].[DBO].[ENTITY] E WITH(NOLOCK) 
                    INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_TYPE EAT WITH(NOLOCK) ON E.ENTITY_TYPE_ID = EAT.ENTITY_TYPE_ID AND EAT.SYSTEM_CODE = 'DPTJT' AND EAT.IS_ACTIVE = 'Y'
                    INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_METADATA EAM WITH(NOLOCK) ON E.ENTITY_ID = EAM.ENTITY_ID AND EAT.ENTITY_ASSOC_TYPE_ID = EAM.ENTITY_ASSOC_TYPE_ID and EAM.IS_ACTIVE = 'Y'
                    INNER JOIN [DEPARTMENTS].dbo.DEPARTMENT_STRUCTURE_JOB_TITLE  DSJT  WITH (NOLOCK) ON EAM.EXTERNAL_DATASOURCE_OBJECT_ID = DSJT.DEPARTMENT_STRUCTURE_JOB_TITLE_ID 
                    INNER JOIN [DEPARTMENTS].dbo.DEPARTMENT_STRUCTURE_JOB_FUNCTION DSJF  WITH (NOLOCK) ON DSJT.DEPARTMENT_STRUCTURE_JOB_FUNCTION_ID = DSJF.DEPARTMENT_STRUCTURE_JOB_FUNCTION_ID 
                    INNER JOIN [DEPARTMENTS].dbo.DEPARTMENT_STRUCTURE_SUB_DEPARTMENT DSSD  WITH (NOLOCK) ON DSJF.DEPARTMENT_STRUCTURE_SUB_DEPARTMENT_ID = DSSD.DEPARTMENT_STRUCTURE_SUB_DEPARTMENT_ID  
                    INNER JOIN [DEPARTMENTS].dbo.DEPARTMENT_STRUCTURE_BASIC_NAME DSBN  WITH (NOLOCK) ON DSSD.DEPARTMENT_STRUCTURE_BASIC_NAME_ID = DSBN.DEPARTMENT_STRUCTURE_BASIC_NAME_ID  
                    INNER JOIN [DEPARTMENTS].dbo.DEPARTMENT_STRUCTURE_TOP_LEVEL DSTL  WITH (NOLOCK) ON DSBN.DEPARTMENT_STRUCTURE_TOP_LEVEL_ID = DSTL.DEPARTMENT_STRUCTURE_TOP_LEVEL_ID  
                    WHERE  E.ENTITY_ID = {entityId}       ----**** Pass ApplicationID or EntityID here to filter out the data.
                    GROUP BY DSTL.DEPARTMENT_STRUCTURE_TOP_LEVEL_ID,DSTL.[NAME]
                '''
        return self.db.execQuery(query)

    def get_department_company_list(self):
        query = f'''
           	Select  * from [DEPARTMENTS].[dbo].[Company] WHERE IS_ACTIVE ='Y'
        '''
        return self.db.execQuery(query)

    def get_department_employee_type_list(self):
        query = f'''
           	select * from [DEPARTMENTS].[dbo].[employee_type] WHERE IS_ACTIVE ='Y'
        '''
        return self.db.execQuery(query)

    def get_department_people(self, maxCount, searchText=''):
        query = f'''
          SELECT
                 c.EMPLOYEE_ID,
				c.FULL_NAME,
                c.DISPLAY_NAME,
				c.JOB_TITLE,
				c.DEPARTMENT_NAME,
				c.HOME_PHONE_NUMBER,
				c.CITY,
				c.STATE,
				c.LAST_NAME,
				c.STREET_ADDRESS,
				c.MANAGER_LDAP_PATH,
				c.BIRTH_DATE,
				c.FIRST_NAME,
				c.SHORT_USER_NAME,
				c.HIRE_DATE,
				c.GENDER,
				c.MIDDLE_NAME,
				c.EMAIL_ADDRESS,
				c.ZIP_CODE,
                et.EMPLOYEE_TYPE_NAME
                
                FROM [DEPARTMENTS].[dbo].DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER AS c LEFT JOIN [DEPARTMENTS].[dbo].EMPLOYEE_TYPE AS et ON (c.EMPLOYEE_TYPE_ID = et.EMPLOYEE_TYPE_ID)
                 WHERE c.IS_ACTIVE = 'Y'
                AND DISPLAY_NAME Like CASE WHEN '{searchText}' = '' THEN DISPLAY_NAME ELSE '%' + '{searchText}' + '%' END
                ORDER BY 1 ASC
                offset 0 rows
                FETCH NEXT {maxCount} rows only
        '''
        return self.db.execQuery(query)

    def get_past_due_count(self, userShortName):
        query = f'''
            SELECT COUNT(CLO.CASE_ID) CNT
            FROM [BOXER_CME].[dbo].[CASE_LIST] CLO 
            WHERE CLO.LIST_CASE_ASSGN_TO_SAM in ('{userShortName}')
            AND COALESCE(CLO.LIST_CASE_DUE,'')!='' 
            AND CAST(GETDATE() AS varchar(100)) > CLO.LIST_CASE_DUE
        '''
        return self.db.execQuery(query)

    def get_user_info(self, userShortName):
        query = f'''
           	SELECT * FROM [BOXER_CME].[dbo].[CME_USER_CACHE] WHERE SHORT_USER_NAME = '{userShortName}'
        '''
        return self.db.execQuery(query)

    def get_people_info(self, EMPLOYEE_ID, EMPLOYEE_SHORT_NAME):
        query = f'''
                SELECT 
                c.EMPLOYEE_ID,
                           c.FULL_NAME as Display_name,
                           c.JOB_TITLE as JobTitle,
                           c.DEPARTMENT_NAME as BasicName,
                           c.PHONE_NUMBER as EmpCellPhone,
                           c.CITY,
                           c.STATE,
                           c.LAST_NAME,
                           c.STREET_ADDRESS as OFFICE_LOCATION,
                           c.MANAGER_LDAP_PATH,
                           c.BIRTH_DATE,
                           c.FIRST_NAME,
                           c.SHORT_USER_NAME,
                           c.HIRE_DATE,
                           c.GENDER,
                           c.MIDDLE_NAME,
                           c.EMAIL_ADDRESS,
                           c.ZIP_CODE,
                         Manager.SupervisorId as Manager_Id
                                       ,et.EMPLOYEE_TYPE_NAME as empType
                                  FROM [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] AS c 
                                                LEFT JOIN [DEPARTMENTS].[dbo].[EMPLOYEE_TYPE] AS et 
                                                ON (c.EMPLOYEE_TYPE_ID = et.EMPLOYEE_TYPE_ID) 
                                                 OUTER APPLY  
                                                       (  
                                                        SELECT TOP 1 D2.EMAIL_Address As SupervisorSId,D2.Employee_ID As SupervisorId,COALESCE(D2.DISPLAY_NAME,D2.First_Name+' '+D2.Last_Name) AS  SUPERVISORNAME   
                                                        ,D1.Manager_LDAP_Path,d2.SHORT_USER_NAME ,D2.City AS 
                                                        Manager_City,D2.State as Manager_State 
                                                        FROM [Departments].[DBO].[DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] D1 WITH (NOLOCK)  
                                                        INNER JOIN [Departments].[DBO].[MANAGER_CONFIG] M1 WITH (NOLOCK) ON CONVERT(nvarchar(MAX),D1.Employee_GUID)=CONVERT(nvarchar(MAX),M1.Employee_GUID)  
                                                          AND D1.Short_User_Name=C.Short_User_Name  
                                                        INNER JOIN [Departments].[DBO].[DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] D2 WITH (NOLOCK) ON CONVERT(nvarchar(MAX),D2.Employee_GUID)=CONVERT(nvarchar(MAX),M1.MANAGER_GUID)  
                                                        INNER JOIN [Departments].[DBO].[USER_ACCOUNT_STATUS_REF] UASR WITH(NOLOCK) ON D1.USER_AD_STATUS =UASR.STATUS_VALUE  
                                                        INNER JOIN [Departments].[DBO].[USER_ACCOUNT_STATUS_REF] REF WITH (NOLOCK) ON REF.STATUS_VALUE = D1.USER_AD_STATUS  
                                                          AND REF.STATUS_DISABLED = 'N'  
                                                           
                                                        --WHERE D1.Short_User_Name=DSEM.Short_User_Name and D1.USER_AD_STATUS in (Select STATUS_VALUE from [dbo].[USER_ACCOUNT_STATUS_REF] where STATUS_DISABLED = 'N')  
                                                        ORDER BY M1.IS_Primary DESC  
                                                       )Manager  
                                                       WHERE (c.EMPLOYEE_ID={EMPLOYEE_ID}  or
													    c.SHORT_USER_NAME Like '%{EMPLOYEE_SHORT_NAME}%')
        '''
        print(query)
        return self.db.execQuery(query)

    def get_filter_values_by_caseTypeIds(self, caseTypeIds):
        query = f'''
            SELECT 
            distinct [NAME], att.SYSTEM_CODE
            FROM [BOXER_CME].[dbo].[ASSOC_DECODE] ad
            join (
            SELECT assoc_type_id, system_code FROM [BOXER_CME].[dbo].[ASSOC_TYPE] WHERE CASE_TYPE_ID in ({caseTypeIds}) and SYSTEM_CODE in ('STTUS', 'PRI  ')
            ) att on ad.assoc_type_id = att.ASSOC_TYPE_ID
            where ad.IS_ACTIVE = 'Y'
        '''
        return self.db.execQuery(query)

    def exid(self, id):
        ''' Takes in a application id(the entity that had the applicaiton data)
        return the exid for that
        '''
        query = f''' 
        SELECT
[EXTERNAL_DATASOURCE_OBJECT_ID] as [EXID]
FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA] a
join  (
        SELECT [ENTITY_ASSOC_TYPE_ID],
                [SYSTEM_CODE],
                [NAME]
        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE]
        where ENTITY_TYPE_ID = (
                                SELECT top 1 [ENTITY_TYPE_ID]
                                FROM [BOXER_ENTITIES].[dbo].[ENTITY_TYPE]
                                where SYSTEM_CODE = 'USCSE')
            and is_active = 'Y'
            and SYSTEM_CODE in (
			'ASSCT'
            ) )b
on a.ENTITY_ASSOC_TYPE_ID = b.ENTITY_ASSOC_TYPE_ID 
left join [BOXER_ENTITIES].[dbo].ENTITY e
on a.ENTITY_ID = e.ENTITY_ID
left join [BOXER_ENTITIES].[dbo].[ENTITY_SYSTEM_CODE] esc
 on  b.SYSTEM_CODE = esc.SYSTEM_CODE
where a.IS_ACTIVE = 'Y'
	and
	e.IS_ACTIVE = 'Y'
    and EXTERNAL_DATASOURCE_OBJECT_ID is not null
	and a.ENTITY_ID = {id}
        '''
        return self.db.execQuery(query)

    def ctids_from_exid(self, exid):
        ''' Takes in an exid and returns all the case type id for that '''

        query = f''' SELECT ENTITY_ID, [TEXT] as ID, b.SYSTEM_CODE 
  FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT] a
	  left join [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type] b
	on a.[ENTITY_ASSOC_TYPE_ID] = b.[ENTITY_ASSOC_TYPE_ID]

  where entity_id in {exid}
  and 
  a.is_active = 'Y'
  and
  a.[ENTITY_ASSOC_TYPE_ID] in  (
  SELECT ENTITY_ASSOC_TYPE_ID
  FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type]
  where entity_type_id in (select top 1 
							ENTITY_TYPE_ID 
							from [BOXER_ENTITIES].[dbo].entity_list 
							where entity_id in {exid} ) 
							and 
							(SYSTEM_CODE in ('EXTPK' , 'QSAID', 'URL','SBTTL'))
							)'''
        return self.db.execQuery(query)

    def ctids_from_application(self, app_id):
        exid = self.exid(app_id)['EXID'].tolist()
        exid = self.tuplefy(exid)
        self.ctid = self.ctids_from_exid(exid)
        return self.ctid['ID'].tolist()

    def open_case_type_data(self, app_id):
        case_types = self.ctids_from_application(app_id)

        case_types = self.tuplefy(case_types)
        query = f'''
        SELECT
		[Case_Type_ID]
      ,[Case_Type_Name] as [Case Type]
      ,[Case_ID]
      ,[Case_ID] as [Count]
      ,[Owned_by_Display_Name] as [Owned By]
      ,[Created_by_Display_Name] as [Created By]
      ,[Created_Datetime] as [Create Date]
      ,[Modified_by_Display_Name] 
      ,[Assigned_to_Display_Name] as [Assigned To]
      ,[Assign_Datetime] as [Assigned Date]
      ,[Is_Active]
      ,[Category]
      ,[Category_EXD_OBJECT_ID]
      ,[Cost Field]
      ,[Cost Field_EXD_OBJECT_ID]
      ,[Due Date]
      ,[Priority Type]        
      ,[Status Type]
      ,[Status Type_EXD_OBJECT_ID]
      ,[Case Title]
	  ,[Created_Datetime date] as [Created Date]
      ,[Assign_Datetime date]    
      ,[Due Date date]
      ,[CASE_LIFE] 
      ,[CaseDue_Status] as [Status]
      ,[CASE_URL] as [Case Url]
      ,[By_Assignee_Supervisor] as [By Assignee Supervisor]
      ,[CaseClosed date] as [Case Closed Date]
      ,[JOB_TITLE] as [Assignee Job Title]
      ,[DEPARTMENT_NAME] as [Assigned Department Name]       
  FROM [FACTS].[dbo].[CASE_LIST]
  
  where [CaseClosed date] is null
  and is_active = 'Y'
  and CASE_TYPE_ID in {case_types} 
        '''
        return self.db.execQuery(query)

    def case_activity_log_track(self, application_type, username, skipCount, maxCount):
        try:
            '''case activity track query'''
            if application_type == "entity":
                query = f'''
                                SELECT [ENTITY_ID] As ID
                ,'Entity' as application_name
                ,ea.[ENTITY_ACTIVITY_TYPE_ID] As [ACTIVITY_TYPE_ID]
                ,[NOTE] as note
                ,[NAME]
                ,ea.[CREATED_BY]
                ,ea.[ENTITY_ACTIVITY_ID] As ACTIVITY_ID
                ,ea.[CREATED_DATETIME]
                ,eat.[DESCRIPTION]
                FROM [BOXER_ENTITIES].[dbo].[ENTITY_ACTIVITY] ea With(Nolock)
                inner join  [BOXER_ENTITIES].[dbo].[ENTITY_ACTIVITY_TYPE] eat  With(Nolock) on 
                ea.ENTITY_ACTIVITY_TYPE_ID = eat.ENTITY_ACTIVITY_TYPE_ID 
                WHERE ea.[CREATED_BY]='{username}'
                order by [CREATED_DATETIME] desc
                OFFSET {skipCount} ROWS FETCH NEXT {maxCount} ROWS ONLY'''

                query1 = f'''select count(*) as total_count FROM [BOXER_ENTITIES].[dbo].[ENTITY_ACTIVITY]  WHERE 
                                           [CREATED_BY]='{username}' '''

                return {"total": self.db.execQuery(query1).to_dict(orient="records")[0]['total_count'],
                        "data": self.db.execQuery(query).to_dict(orient="records")}

            elif application_type == "cases":
                query = f'''SELECT [CASE_ID] As ID
                    ,'Case' as application_name
                    ,ea.[ACTIVITY_TYPE_ID] As [ACTIVITY_TYPE_ID]
                    ,[NOTE] as note
                    ,[NAME]
                    ,ea.[CREATED_BY]
                    ,ea.[CREATED_DATETIME]
                     ,ea.[CASE_ACTIVITY_ID] As ACTIVITY_ID
                    ,eat.[DESCRIPTION]
                    FROM [BOXER_CME].[dbo].[CASE_ACTIVITY] ea With(Nolock)
                    inner join [BOXER_CME].[dbo].[CASE_ACTIVITY_TYPE] eat  With(Nolock) on ea.ACTIVITY_TYPE_ID = 
                    eat.CASE_ACTIVITY_TYPE_ID
                    WHERE ea.[CREATED_BY]='{username}'
                    order by [CREATED_DATETIME] desc
                    OFFSET {skipCount} ROWS FETCH NEXT {maxCount} ROWS ONLY
                    '''
                query1 = f'''select count(*) as total_count FROM [BOXER_CME].[dbo].[CASE_ACTIVITY]  WHERE 
                            [CREATED_BY]='{username}' '''
                return {"total": self.db.execQuery(query1).to_dict(orient="records")[0]['total_count'],
                        "data": self.db.execQuery(query).to_dict(orient="records")}
        except Exception as exe:
            print("errr===>", exe)

    def entity_data(self, Ids):
        query = f'''
                    SELECT ENTITY_ID, [TEXT] as ID, b.SYSTEM_CODE 
                      FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT] a
                          left join [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type] b
                        on a.[ENTITY_ASSOC_TYPE_ID] = b.[ENTITY_ASSOC_TYPE_ID]
                    
                      where entity_id in ({Ids})
                      and 
                      a.is_active = 'Y'
                      and
                      a.[ENTITY_ASSOC_TYPE_ID] in  (
                      SELECT ENTITY_ASSOC_TYPE_ID
                      FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_type]
                      where entity_type_id in (select top 1 
                                                ENTITY_TYPE_ID 
                                                from [BOXER_ENTITIES].[dbo].entity_list 
                                                where entity_id in ({Ids}) )
                                                and 
                    (SYSTEM_CODE in ('EXTPK' , 'QSAID', 'URL','SBTTL', 'TITLE')))
                    order by SYSTEM_CODE,ENTITY_ID
                    '''
        return self.db.execQuery(query)

    def entity_list_byId(self, entityIds):
        try:
            query = f'''
            select entity_type_id as EntityType,
                count(list_id) as count,
				year(CREATED_DATETIME) as CreatedDate
                 from [BOXER_ENTITIES].[dbo].[entity_list] 
                 where entity_type_id in ({entityIds}) 
				 group by  year(CREATED_DATETIME), ENTITY_TYPE_ID
				order by year(CREATED_DATETIME)
            '''
            print(self.db.execQuery(query))
            return self.db.execQuery(query)
        except Exception as exe:
            return str(exe)

    def entity_count_byId(self, entityTypeIds):
        try:
            query = f'''
            SELECT
            (SELECT count(*) from [BOXER_ENTITIES].[dbo].[entity_list] 
            where ENTITY_TYPE_ID in({entityTypeIds})) AS total_count,
            SUM(CASE WHEN eat.[SYSTEM_CODE] = 'sttus' THEN 1 ELSE 0 END) AS sttus_count,
            SUM(CASE WHEN eat.[SYSTEM_CODE] = 'CATEG' THEN 1 ELSE 0 END) AS category_count
            FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA] eam 
            left join  [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE] eat
            on eam.[ENTITY_ASSOC_TYPE_ID] = eat.[ENTITY_ASSOC_TYPE_ID]
            where eat.ENTITY_TYPE_ID in({entityTypeIds})
            '''
            # print(self.db.execQuery(query))
            return self.db.execQuery(query)
        except Exception as exe:
            return str(exe)

    def entity_list_bySystemCode(self, entityIds, systemCode):
        try:
            query = f'''
            select eat.ENTITY_TYPE_ID as EntityType,
            count(eam.FIELD_VALUE) as count,
            eam.FIELD_VALUE as FieldValue
            from [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA] eam WITH (NOLOCK)
            left join [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE] eat on eat.[ENTITY_ASSOC_TYPE_ID] = eam.[ENTITY_ASSOC_TYPE_ID]
            where eat.ENTITY_TYPE_ID in({entityIds}) and eat.SYSTEM_CODE='{systemCode}'
            group by  eam.FIELD_VALUE, eat.ENTITY_TYPE_ID, eam.FIELD_VALUE
            order by eam.FIELD_VALUE
            '''
            print(self.db.execQuery(query))
            return self.db.execQuery(query)
        except Exception as exe:
            return str(exe)

    def activity_logs(self, user_sam, count=50, skip=0):
        ''' should be the endpoing for looping up ativity for a user
        
        NOTE: Entities is commented out while we wait for an index on that table'''

        query = f''' 
                select 
                    [Application]
                    ,[Activity Type]
                    ,Note
                    ,[Date]
                from (
                select 
                    'Cases' as [Application]
                    ,eat.NAME as [Activity Type]
                    ,[NOTE] as [Note]
                    ,ea.[CREATED_DATETIME] as [Date]
                from boxer_cme.dbo.CASE_ACTIVITY ea with(nolock)
                inner join BOXER_CME.dbo.Case_activity_type eat with(nolock)
                on ea.ACTIVITY_TYPE_ID = eat.CASE_ACTIVITY_TYPE_ID
                and ea.created_by = '{user_sam}'
                /*
                union all

                select 
                    'Entities' as [Application]
                    ,eat.NAME as [Activity_Type]
                    ,[NOTE] 
                    ,ea.CREATED_DATETIME as [Date]
                from BOXER_ENTITIES.dbo.Entity_ACTIVITY ea with(nolock)
                inner join BOXER_ENTITIES.dbo   .Entity_activity_type eat with(nolock)
                on ea.ENTITY_ACTIVITY_TYPE_ID = eat.ENTITY_ACTIVITY_TYPE_ID
                and ea.created_by = '{user_sam}'
                */
                ) dat

            order by [Date] desc

            offset {skip} rows fetch next {count} rows only
        '''
        
        
        return self.db.execQuery(query)

    def department_fetch(self, all_data):
        try:
            status = 1
            if all_data.get('empStatus') == "inactive":
                status = 0
            if all_data.get('empStatus') == "both":
                status = '0 OR ACTIVE = 1'
            if all_data.get("provisioned") == "yes":
                min_query = f"CAST(EAM.EXTERNAL_DATASOURCE_OBJECT_ID AS int) > 1"
            if all_data.get("provisioned") == "no":
                min_query = f"CAST(EAM.EXTERNAL_DATASOURCE_OBJECT_ID AS nvarchar) = null"
            all_data.pop('empStatus', None)
            all_data.pop('provisioned', None)
            entity_id = all_data.pop('application_id', None)
            query = f'''
                        SELECT 
                        DSJT.EMPLOYEEID AS EMPLOYEE_ID
                       ,DSJT.EmpDisplayName AS Display_name
                       ,DSJT.EMP_DEPARTMENT_TOP_LEVEL AS Top_level_name
                       ,DSJT.Emp_DEPARTMENT_TOP_LEVEL_ID
                       ,DSJT.EMP_DEPARTMENT_BASIC_NAME AS BasicName
                       ,DSJT.Emp_DEPARTMENT_BASIC_NAME_ID
                       ,DSJT.DEPARTMENT AS SubDepartment
                       ,DSJT.DepartmentID AS SUB_DEPARTMENT_ID
                       ,DSJT.Emp_JOB_FUNCTION_NAME AS JobFunction
                       ,DSJT.Emp_DEPARTMENT_JOB_FUNCTION_ID
                       ,DSJT.Emp_JOB_TITLE_NAME AS JobTitle
                       ,DSJT.Emp_DEPARTMENT_JOB_TITLE_ID
                       ,DSJT.empFirstName AS FIRST_NAME
                       ,DSJT.empLastName AS LAST_NAME
                       ,DSJT.MANAGER_LDAP_PATH
                       ,DSJT.EmpCity AS CITY
                       ,DSJT.OFFICE_LOCATION
                       ,DSJT.EmpCellPhone
                       ,DSJT.HIRE_DATE
                       ,DSJT.ZIP_CODE
                       ,DSJT.EmpState AS STATE
                       ,DSJT.Company_ID
                       ,DSJT.COMPANY_NAME AS CompanyName
                       ,CAST(EAM.EXTERNAL_DATASOURCE_OBJECT_ID AS int) AS DEPARTMENT_STRUCTURE_JOB_TITLE_ID
                       ,EMPT.EMPLOYEE_TYPE_NAME AS empType 
                       ,EMPT.EMPLOYEE_TYPE_ID 
                       ,DSJT.SAM_ACCOUNT_NAME AS SHORT_USER_NAME 
                       ,EmpEmail AS EMAIL_ADDRESS
                       ,DSEM2.Employee_ID As Manager_Id
                       ,DSEM2.BIRTH_DATE
                       ,CASE WHEN ACTIVE = 1 THEN 'ACTIVE' ELSE 'INACTIVE' END AS EMPLOYEE_STATUS
                       FROM  [BOXER_ENTITIES].[DBO].[ENTITY] E 
                       INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_TYPE EAT ON E.ENTITY_TYPE_ID=EAT.ENTITY_TYPE_ID AND EAT.SYSTEM_CODE='DPTJT' AND EAT.IS_ACTIVE='Y'
                       INNER JOIN [BOXER_ENTITIES].[DBO].ENTITY_ASSOC_METADATA EAM ON E.ENTITY_ID=EAM.ENTITY_ID AND EAT.ENTITY_ASSOC_TYPE_ID=EAM.ENTITY_ASSOC_TYPE_ID and EAM.IS_ACTIVE='Y'
                       INNER JOIN [DEPARTMENTS].[dbo].[vw_Table_DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] DSJT ON EAM.EXTERNAL_DATASOURCE_OBJECT_ID=DSJT.Emp_DEPARTMENT_JOB_TITLE_ID
                       INNER JOIN [DEPARTMENTS].[dbo].[DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] DSEM WITH(NOLOCK) ON DSJT.EMPLOYEE_GUID=DSEM.EMPLOYEE_GUID
                       INNER JOIN [Departments].[DBO].[MANAGER_CONFIG] MG WITH (NOLOCK) ON DSEM.Employee_GUID=MG.Employee_GUID
                       INNER JOIN [Departments].[DBO].[DEPARTMENT_STRUCTURE_EMPLOYEE_MASTER] DSEM2 WITH (NOLOCK) ON MG.MANAGER_GUID=convert(nvarchar(200),DSEM2.Employee_GUID)
                       LEFT JOIN [DEPARTMENTS].[dbo].[EMPLOYEE_TYPE] EMPT WITH(NOLOCK) ON DSEM.EMPLOYEE_TYPE_ID=EMPT.EMPLOYEE_TYPE_ID 
                       WHERE  E.ENTITY_ID =   {entity_id} and (ACTIVE = {status}) AND {min_query}
                    '''
            if all_data.get("employee") == "all":
                query = query + \
                    f"ORDER BY 1 ASC OFFSET 0 ROWS FETCH NEXT {all_data.get('maxCount')} ROWS ONLY"
                return self.db.execQuery(query)
            data_count = all_data.pop('maxCount', None)
            for key, value in all_data.items():
                if value is not None:
                    query = query + f"AND {key} like '%{value}%'"
            query += f"ORDER BY 1 ASC OFFSET 0 ROWS FETCH NEXT {data_count} ROWS ONLY"
            print(query)
            return self.db.execQuery(query)

        except Exception as exe:
            return str(exe)


class AppSql:
    # need a call that gives application entity 0ds, name and icon urls
    def __init__(self):
        self.db = Stemmons_Dash_App()

    def application_layout(self):
        pass

    def applications(self):
        query = '''
        
        select el.Entity_ID as [entity_id],
                TITLE_METADATA_TEXT as [title],
                cast(eat.ENTITY_FILE_ID as int) as [url]
        from BOXER_ENTITIES.dbo.ENTITY_LIST el

        left join(SELECT
            [ENTITY_FILE_ID],
            ENTITY_ID

        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_METADATA_TEXT]
        where ENTITY_ASSOC_TYPE_ID = (SELECT [ENTITY_ASSOC_TYPE_ID]
        
        FROM [BOXER_ENTITIES].[dbo].[ENTITY_ASSOC_TYPE]
        where SYSTEM_CODE='APICN'
        and is_active='Y')
            and  is_active = 'Y')eat
        on eat.ENTITY_ID = el.ENTITY_ID

        where ENTITY_TYPE_ID = (SELECT[ENTITY_TYPE_ID]
                FROM [BOXER_ENTITIES].[dbo].[ENTITY_TYPE]
                where system_code = 'USCSE'
                and IS_ACTIVE='Y')
                order by TITLE_METADATA_TEXT 
        '''
        return self.db.execQuery(query)


class AppHandler(AppSql):
    '''transforms sql calls into json for the react from end'''

    def __init__(self):
        super().__init__()

    def application_list(self):
        df = self.applications()

        resp = []
        for idx, row in df.iterrows():

            id = row['url']
            if pd.isna(id):
                id = 0
            else:
                id = int(id)

            resp.append({
                'title': row['title'],
                'id': row['entity_id'],
                # TODO: after dev make dynamic
                'url': f"http://entities.boxerproperty.com/Download.aspx?FileID={id}"
            })
        return resp



class CaseHandler(CasesSQL):

    def __init__(self):
        super().__init__()

    def case_type_inputs(self, ctid=19):
        df = self.cases_type_form(ctid)

        response = []
        for idx, row in df.iterrows():
            field_type = row['FIELD_TYPE']

            if field_type == 'T':
                response.append(self.resp_model(
                    idx, row['ASSOC_TYPE_ID'], field_type, [], row['label'], row['IS_REQUIRED']))

            elif field_type == 'A':
                response.append(self.resp_model(
                    idx, row['ASSOC_TYPE_ID'], field_type, [], row['label'], row['IS_REQUIRED']))

            elif field_type == 'N':
                response.append(self.resp_model(
                    idx, row['ASSOC_TYPE_ID'], field_type, [], row['label'], row['IS_REQUIRED']))

            elif field_type == 'D':
                response.append(self.resp_model(
                    idx, row['ASSOC_TYPE_ID'], field_type, [], row['label'], row['IS_REQUIRED']))

            else:
                response.append(self.resp_model(
                    idx, row['ASSOC_TYPE_ID'], [], [], [], []))
        else:
            response.append(self.resp_model(
                idx, row['ASSOC_TYPE_ID'], 'Froala', [], [], []))
        return response

    def resp_model(self, idx, assoc, type, options, label, required):
        '''
        {idx:{'type':'A',
            'options':[{'label':'blah,'value':'blah'}],
            'label':row['label'],
            'required':False }
        }
        '''
        return {'type': type,
                'options': options,
                'label': label,
                'required': required,
                'assocID': assoc}

    def case_graphs(self, id):

        df = self.open_case_type_data(id)
        fig = px.line(df, x='Assigned To', y='Count')
        return fig.to_json()
