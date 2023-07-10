# Confirm that posting a JSON fragment works, and doing a GET for the same fragment returns the expected result
POST http://localhost:80/v1/fragments
Content-Type: application/json
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`This is a fragment!`

# Response we expect from Step 1
HTTP/* 201
[Asserts]
# location header verified with Regex
header "Location" matches /^http:\/\/localhost:80\/v1\/fragments\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
[Captures]
url: header "Location"

# Get the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

HTTP/* 200
Content-Type: application/json; charset=utf-8
Content-Length: 49
`{"status":"ok","fragments":"This is a fragment!"}`