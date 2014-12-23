Movies List
=========

Request
-------

```js
GET /api/v1/movies
GET /api/v1/movies?actor=al%20pacino // Search by actor
GET /api/v1/movies?title=arfa // Search by title

```

Response
----

```js
{
    "movies" :[
        {
            "title": "Scarface",
            "format": "VHS",
            "releaseYear": 1983,
            "id": "53ac04f6d9bfbb0714741a24",
            "actors": ["Al Pacino"]
        },
        {
            "title": "Matrix",
            "format": "CD",
            "releaseYear": 1999,
            "id": "53ac04f6d9bfb34714741a51",
            "actors": ["Neo"]
        },
    ]
}
```