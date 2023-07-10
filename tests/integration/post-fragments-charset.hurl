# Confirm that posting a fragment Content-Type that includes a charset
# (e.g., text/plain; charset=utf-8) works, and is returned as the fragment's type when doing a GET
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`This is a fragment!`

# Response we expect from Step 1
HTTP/* 201
Content-Type: application/json; charset=utf-8
[Asserts]
# location header verified with Regex
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
[Captures]
url: header "Location"

# Get the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

HTTP/* 200
Content-Type: text/plain; charset=utf-8
Content-Length: 49
`{"status":"ok","fragments":"This is a fragment!"}`