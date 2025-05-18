# Developer Manual

## 1. Getting the code

```
# clone the repo 
$ git clone https://https://github.com/SykoDK/currency-converter
$ cd currency-converter
```

## 2. Local Setup
```
# install front-end development dependencies
npm install
```

### 3. Run everything locally
```
# 1. Run vercel dev server
# site => HTTP://localhost:3000
```

### 4. Run Tests
```
test
```

## API Reference
End points are under /api and are backed by serverless functions in Vercel


| Method   | Path | Description |
| -------- | ------- | ------- |
| Post  | /api/convert   | Logs a User conversion to the Supabase conversion table |
| GET | /api/convert/popular     | Returns top N most-requested currency pairs |

## Known issues

| ID   | Description |
| -------- | ------- |
| #1 | Exchange Rate API sometimes returns null values for weekends; current fix is to forward-fill. |
| #2 | Rates and charts don't always load when server starts up, could not figure out issue, but will load after page is refreshed a couple of times. |

## Deploying to production
  1. Connect GitHub repository to Vercel.
  2. Set the .env in Vercel (Supabase url and key) under enviornment variables in project settings.
  3. Then Deploy site.
