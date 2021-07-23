# graphql

This directory contains graphql example based on [howtographql](https://www.howtographql.com/) using `graphql-yoga`.

## Get started

### Using Node

**Clone the repository**

**Install dependencies**

```sh
npm install
```

**Run the app**

```sh
npm run start
```

### Using Docker

```sh
docker-compose up
```

## Testing

Open your browser at [http://localhost:4000](http://localhost:4000) and start sending queries.

**Query sample:**

```graphql
{
  people {
    id
    fullName
    email
  }
}
```

The server returns the following response:

```json
{
  "data": {
    "people": [
      {
        "id": 1,
        "fullName": "Michael Suyama",
        "email": "suyama@wp.co"
      },
      {
        "id": 2,
        "fullName": "Nancy DaVolio",
        "email": "davolio@wp.co"
      },
      {
        "id": 3,
        "fullName": "David Buchanan",
        "email": "buchanan@wp.co"
      }
    ]
  }
}
```