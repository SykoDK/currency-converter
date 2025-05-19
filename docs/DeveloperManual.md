# Developer Manual

## 1. Getting the code
```
# clone the repo 
$ git clone https://github.com/SykoDK/currency-converter
$ cd currency-converter
```

## Download Node.JS
```
https://nodejs.org/dist/v22.15.1/node-v22.15.1-x64.msi
```

## 2. Local Setup
```
# install front-end development dependencies
nvm install lts
npm install
```

### 3. Run everything locally
```
# 1. Run vercel dev server
vercel dev
# or
npm start
# site => HTTP://localhost:3000
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
  2. Set the .env in Vercel (Supabase url and key, Exchange Rate API key, and IPStack API Key) under enviornment variables in project settings.
  3. Then Deploy site.
