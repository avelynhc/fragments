POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
avelynhc@gmail.com: Mustard123!
{ "route": "put" }

HTTP 201
[Captures]
location: header "Location"
id: jsonpath "$.fragments.id"

GET {{location}}/info
[BasicAuth]
avelynhc@gmail.com: Mustard123!

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" exists
jsonpath "$.fragments.size" == 18
jsonpath "$.fragments.type" == "application/json"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.id" == {{id}}
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragments.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

PUT {{location}}
Content-Type: application/json
[BasicAuth]
avelynhc@gmail.com: Mustard123!
{ "updated route": "updated put" }

HTTP 200

GET {{location}}/info
[BasicAuth]
avelynhc@gmail.com: Mustard123!

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" exists
jsonpath "$.fragments.size" == 34
jsonpath "$.fragments.type" == "application/json"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.id" == {{id}}
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragments.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/