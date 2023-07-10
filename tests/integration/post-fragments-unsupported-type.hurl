# Confirm that posting an unsupported Content-Type produces a 415 error
POST http://localhost:8080/v1/fragments
Content-Type: image/jpeg
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`This is a fragment!`

# Response
HTTP/* 415
Content-Type: application/json; charset=utf-8
Content-Length: 78