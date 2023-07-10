# Confirm that posting a fragment when not authenticated produces a 401 error
POST http://localhost:80/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@gmail.com: invalidPassword
`This is a fragment!`

# Response we expect from Step 1
HTTP/* 401