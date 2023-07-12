# 1. POST a new text fragment to http://localhost:8080 as an authorized user.
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`Hello S3!`

# 2. Confirm that the server returns a 201, and capture the Location header value to a variable named url
HTTP/* 201
[Captures]
url: header "Location"

# 3. GET the fragment you just created using the url as an authorized user.
GET {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# 4. Confirm that the server returns a 200,
# that the type of the fragment is text/plain, and
# that the body is equal to Hello S3!
HTTP/* 200
Content-Type: text/plain; charset=utf-8
`{"status":"ok","fragments":"Hello S3!"}`

# 5. DELETE the fragment using the url as an authorized user.
DELETE {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# 6. Confirm that the server returns a 200.
# HTTP/* 200
HTTP/* 404

# 7. Try to GET the fragment again using the url as an authorized user.
GET {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# 8. Confirm that the server returns a 404, since the fragment should be deleted.
# HTTP/* 404
HTTP/* 200