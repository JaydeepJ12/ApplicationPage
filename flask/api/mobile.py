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