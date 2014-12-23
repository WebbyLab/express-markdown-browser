Movies Create
=========



Request
----
```js
POST /api/v1/movies
```
```js
{
    "movies":[{
        "title":"Scarface",
        "format":"VHS",
        "releaseYear":1983,
        "actors":["Al Pacino"]
    }]
}
```

Response
----

```js
{
    "movies":[{
        "title": "Scarface",
        "format": "VHS",
        "releaseYear": 1983,
        "id": "53ac04f6d9bfbb0714741a24",
        "actors": ["Al Pacino"]
    }]
}
```