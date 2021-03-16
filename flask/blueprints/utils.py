from stemmons.api import Cases
from api.mobile import Mobile

mobile = Mobile('http://home.boxerproperty.com/MobileAPI','michaelaf','Boxer@@2021')

cases = Cases('https://casesapi.boxerproperty.com')

def xml_to_json(root):
    fields = []
    def parser(elem, d={}):


        if len(elem)==0:
            d.update({elem.tag:elem.text})
            return d
        else:
            values = {}

            for i in elem:
                _  = {}
                values.update(parser(i,_))

            if elem.tag == 'ASSOC_TYPE':
                #fields = _.get('ASSOC_TYPE',[])
                fields.append(values)


            return {elem.tag:values}
    d = parser(root)
    d.update({'fields':fields})
    return d