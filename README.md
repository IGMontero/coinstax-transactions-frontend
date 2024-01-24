# Coinstax Cryptoview

## Deployment notes:

Node version: v18.17.0

### 1. Install the project dependencies by running:

`npm install`

### 2. Add a file called .env in the root of the project with the following content:

```
REACT_APP_API_URL_BASE = http://localhost:8034/api/v1
```

- Replace REACT_APP_API_URL_BASE with the desired API URL.

### 3. Build the project by running:

`npm run build`

### 4. Deploy

- Copy the contents of the build folder to the desired location.
- Configure the web server to serve index.html as the default page.

## Local setup

Do the same as above, but instead of step 4, run:
npm start
