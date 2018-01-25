RESTful API actions

- list: Get all objects. Return a JSON array of serialized objects.
- retrieve: Get a single object by ID. Return a JSON with serialized object.
- create: Create a new object. Return a JSON with newly created serialized object.

Sample URLS

GET http://localhost/read_write/api/list.php
GET http://localhost/read_write/api/list.php?limit=100
GET http://localhost/read_write/api/list.php?lastId=938
GET http://localhost/read_write/api/list.php?lastId=938&limit=100

GET http://localhost/read_write/api/retrieve.php?id=58

POST http://localhost/read_write/api/create.php
{
    "mykey": "john",
    "value": "Hello world!"
}
