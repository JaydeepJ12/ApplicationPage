import requests

class Mobile:

    def __init__(self, url, user, passwd):
        self.url = url
        self.auth(url, user, passwd)
    
    def auth(self, url, user, passwd):
        ''' Authorize with .net mobile api, creates a token and stores in self.token '''
        data = {'username': user,
                'password': passwd}
        r = requests.post(self.url + '/api/Auth/Authenticate', json=data)
        resp = r.json()
        #print(r.text)

        if resp['success'] == True: # store token if auth works, else send failure message
            self.token = resp['responseContent']['jwt']
        else:
            return resp
    
    def request(self, method,  *args, **kwargs):
        header = kwargs.get('headers',{})
        header.update({'headers':{'Authorization': f'Bearer {self.token}'}})
        kwargs.update(header)
        return requests.request(method, *args, **kwargs)
    
    def get(self, *args, **kwargs):
        return self.request('GET', *args, **kwargs)

    def post(self, *args, **kwargs):
        return self.request('POST', *args, **kwargs)

    def external_data_values(self, data):
        ''' should take in response directly from react in form {
                                    "Application": 0,
                                    "TypeID": 19,
                                    "FieldID": 1829,
                                    "Username": "BhavikS",
                                    "ParentValues": {
                                        "3415": [
                                        "1"
                                        ]
                                    }
                                    } '''
        return self.post(self.url +'/api/ExternalData/GetExternalDataValuesByFilter', json=data)

    def get_employees_by_search(self, data):
        ''' should take in response directly from react in form {
                                    "searchText": "test",
                                    "systemId": 0,
                                    "typeId": 0,
                                    "fieldId": 0,
                                    "itemInfoFieldId": 0,
                                    "fromPageIndex": 0,
                                    "toPageIndex": 0,
                                    "userName": "string"
                                    } '''
        return self.post(self.url +'/api/Home/GetEmployeesBySearch', json=data)

    def get_employees_by_username(self, data):
        ''' should take in response directly from react in form {
                                    "searchText": "bhaviks",
                                    "systemId": 0,
                                    "typeId": 0,
                                    "fieldId": 0,
                                    "itemInfoFieldId": 0,
                                    "fromPageIndex": 0,
                                    "toPageIndex": 0,
                                    "userName": "bhaviks"
                                    } '''
        return self.post(self.url +'/api/Home/GetEmployeeByUsername', json=data)

    def external_data_values_entity(self, data):
        ''' should take in response directly from react in form {
                                    "Application": 1,
                                    "TypeID": 1121,
                                    "FieldID": 1950,
                                    "Username": "BhavikS",
                                    "ParentValues": {
                                        "0": [
                                        "0"
                                        ]
                                    }
                                    } '''
        return self.post(self.url +'/api/ExternalData/GetExternalDataValuesByFilter', json=data)

    def get_case_notes(self, data):
        ''' should take in response directly from react in form {
                                    "applicationId": 1234,
                                    "sinceDate": null
                                    } '''
        return self.post(self.url +'/api/Case/GetCaseNotes', json=data)

    def get_case_headers(self, data):
        ''' should take in response directly from react in form {
                                    "Username": "BhavikS",
                                    "TypeId": 19,
                                    "PageSize": 50,
                                    "MaxCount": 50,
                                    "SkipCount": 0,
                                    "CurrentPage": 1,
                                    "Ascending": false,
                                    "SortColumn": null,
                                    "Filter": 1,
                                    "Filters": null,
                                    "TypeIdsForGrouping": null
                                    } '''
        return self.post(self.url +'/api/Case/GetCaseHeaders', json=data)

    def get_full_case_by_caseId(self, data):
        ''' should take in response directly from react in form {
                                    "caseId": 123456,
                                    "caseTypeId": 1,
                                    "assignedToMe": true,
                                    "isActive": "Y",
                                    "systemCode": "string",
                                    "username": "string",
                                    "pageNumber": 0,
                                    "pageSize": 0,
                                    "userOwner": "string",
                                    "userAssignTo": "string",
                                    "userCreatedBy": "string",
                                    "userTeam": "string",
                                    "userClosedby": "string"
                                    } '''
        return self.post(self.url +'/api/Case/GetFullCaseByCaseId', json=data)

    def get_related_cases_count_data(self, data):
        ''' should take in response directly from react in form {
                                                "caseId": 0,
                                                "caseTypeId": 0,
                                                "assignedToMe": true,
                                                "isActive": "string",
                                                "systemCode": "string",
                                                "username": "bhaviks",
                                                "pageNumber": 0,
                                                "pageSize": 0,
                                                "userOwner": "string",
                                                "userAssignTo": "string",
                                                "userCreatedBy": "string",
                                                "userTeam": "string",
                                                "userClosedby": "string"
                                            } '''
        return self.post(self.url +'/api/Case/GetRelatedCasesCount', json=data)
'''
mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf', 'Boxer@@2020')

print(mobile.external_data_values(data={
                                    "Application": 0,
                                    "TypeID": 19,
                                    "FieldID": 1829,
                                    "Username": "BhavikS",
                                    "ParentValues": {
                                        "3415": [
                                        "1"
                                        ]
}}).text)

'''