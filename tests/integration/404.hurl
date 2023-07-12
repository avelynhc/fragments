# non-existence route test
GET http://localhost:8080/no-such-route

# We should get back an HTTP 1.1 404 response
HTTP 404