#quick script to create credentials for VN
import os
import argparse
from urllib.parse import urlparse

class Encoder():
    '''This is what drives the terminal setup.bat to allow entering of local db config'''
    def __init__(self, server=None, username=None, password=None, cwd=None):
        if cwd is None:
            self.cwd = os.getcwd()+'/bases'
        else:
            o = urlparse(cwd)
            self.cwd = o.geturl()

        self.make_key()
        self.credentials(server, username, password)
        self.write_to_file()
        
       

    def credentials(self, server, username, password):
        '''Runs the cli asking for sql server, username, pass, etc.'''
        if None in [server, username, password]:
            print('Enter sql server name:')
            self.server = input()
            print('Enter username:')
            self.username = input()
            print('Enter password:')
            self.password = input() 
        else:
            self.server = server
            self.username = username
            self.password = password
       
        self.server = self.encrypt(bytes(self.server,'utf-8'))
        self.username = self.encrypt(bytes(self.username,'utf-8'))
        self.password = self.encrypt(bytes(self.password,'utf-8'))

    def make_key(self):
        '''Create a local sym enc key for the instance.'''
        from cryptography.fernet import Fernet as f

        with open(f"{self.cwd}/temp.txt",'w') as z:
            temp = f.generate_key()
            
            z.write(str(temp.hex()))

    def encrypt(self, data):
        '''Encrypts data for storange in info.txt.


            :param data: Info to encrypt         
            :type data: String

        '''
        from cryptography.fernet import Fernet as f
        with open(f'{self.cwd}/temp.txt','r') as z:
                temp = bytes().fromhex(z.read())
                
        f = f(temp)
        return f.encrypt(data)

    def write_to_file(self):
        '''Actuall method that writes all encoded object attributes to file'''
        with open(f'{self.cwd}/info.txt', 'w') as f:
            f.writelines(['server: ' + self.server.decode("utf-8") 
                        + '\n',
                        'password: '+ self.password.decode("utf-8")  
                        + '\n',
                        'username: ' + self.username.decode("utf-8")  
                        ])





if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Load credentials for Visualize application.')
    parser.add_argument('-u', type=str, action='store')
    parser.add_argument('-p', type=str, action='store')
    parser.add_argument('-s', type=str, action='store')
    parser.add_argument('-cwd', type=str, action='store')
    args = parser.parse_args()
    
    start = Encoder(server=args.s, username=args.u, password=args.p, cwd=args.cwd)