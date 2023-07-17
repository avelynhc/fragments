# 1. POST a new JSON fragment to http://localhost:8080 as an authorized user.
# The fragment's body should be the JSON value, { "service": "DynamoDB" }
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
avelynhc@gmail.com: Mustard123!
{ "service": "DynamoDB" }

# 2. Confirm that the server returns a 201, and capture the Location header value
# and the fragment's id in variables named fragment1_url and fragment1_id
HTTP 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragments.id"

# 3. GET the fragment info (i.e., metadata) for the fragment you just created
# using the Location URL/info as an authorized user
GET {{fragment1_url}}/info
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# confirm that the server returns a 200 and that all of the metadata properties
# match what you expect.
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" exists
jsonpath "$.fragments.size" == 25
jsonpath "$.fragments.type" == "application/json"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.id" == {{fragment1_id}}
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragments.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

# 4. POST a second Markdown fragment to http://localhost:8080 as the same authorized user.
# The fragment's body should be the Markdown value, DynamoDB is **great**.
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
avelynhc@gmail.com: Mustard123!
`DynamoDB is **great**`

# 5. Confirm that the server returns a 201, and once again
# capture the Location header value and the second id in variables
# named fragment2_url and fragment2_id.
HTTP 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragments.id"

# 6. GET the fragment info (i.e., metadata) you just created using the url/info
# as an authorized user
GET {{fragment2_url}}/info
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# confirm that the server returns a 200 and
# that all of the metadata properties match what you expect.
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" exists
jsonpath "$.fragments.size" == 21
jsonpath "$.fragments.type" == "text/markdown"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.id" == {{fragment2_id}}
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragments.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

# 7. GET all of the fragments for the same authorized user without expanding them
# (i.e., just get back the IDs)
GET http://localhost:8080/v1/fragments
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# confirm that the list of fragments includes the two id values you captured above
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# 8. DELETE the first fragment you created above
DELETE {{fragment1_url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# 9. Confirm that the server returns a 200
HTTP 200

# 10. Try to GET the first fragment again using the url you captured above as the authorized user.
GET {{fragment1_url}}
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# 11. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP 404

# 12. GET all of the fragments for the same authorized user without expanding them
# (i.e., just get back the IDs) a second time
GET http://localhost:8080/v1/fragments
[BasicAuth]
avelynhc@gmail.com: Mustard123!

# confirm that the first id is NOT included but that the second id is
# (i.e., that the second was not deleted).
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}



