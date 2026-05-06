import requests
url='http://localhost:8000/api/auth/register'
p={"email":"testuser@example.com","username":"testuser","password":"Test@1234","full_name":"Test User"}
r=requests.post(url,json=p)
print(r.status_code)
print(r.text)
