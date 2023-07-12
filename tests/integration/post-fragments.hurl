# Step 1 - create a new fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`This is a fragment!`

# Response we expect from Step 1
HTTP 201
Content-Type: application/json; charset=utf-8
Content-Length: 254
[Asserts]
# location header verified with Regex
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
jsonpath "$.status" == "ok"
jsonpath "$.fragments" exists
jsonpath "$.fragments.size" == 19
jsonpath "$.fragments.type" == "text/plain"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
#ISO Date 2021-11-08T01:04:46.071Z
jsonpath "$.fragments.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragments.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
[Captures]
url: header "Location"

# Step 2 - Get the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

HTTP 200
Content-Type: text/plain; charset=utf-8
Content-Length: 49
`{"status":"ok","fragments":"This is a fragment!"}`