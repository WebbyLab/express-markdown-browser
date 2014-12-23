# USER CREATE
--------------

## Request

    POST /api/v1/users

```javascript
{
    "users": [{
        "name":       "Ivan Petrov"
    }]
}
```

## Response

```javascript
{
    "users": [{
        "id":         "123e456cca426655440000",
        "name":       "Ivan Petrov",
    }]
}
```
