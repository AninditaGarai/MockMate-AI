import requests

BASE = "http://localhost:8000/api"
email = "testuser+1@example.com"
password = "Test@1234"

s = requests.Session()
try:
    r = s.post(f"{BASE}/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    data = r.json()
    token = data.get('access_token')
    print('Login OK, token:', token[:30] + '...' if token else None)

    headers = {'Authorization': f'Bearer {token}'}
    payload = {"interview_type": "HR", "difficulty": "medium"}
    r2 = s.post(f"{BASE}/users/start-interview", json=payload, headers=headers)
    print('Start interview status:', r2.status_code)
    try:
        print('Response:', r2.json())
    except Exception:
        print('No JSON response')
except Exception as e:
    print('Error:', e)
