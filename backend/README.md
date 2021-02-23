# Backend

__NOTE__: When debugging, you are accessing the Express App directly. This means that API GW is NOT validating the Authorization header. This helps speed up the development is some cases, but it may not be ideal for your environment.

## Debugging the API

The API is an Express app, so it can be ran locally, but it depends on DynamoDB and S3, which is why you should run the deploy first.

The local Express configuration is defined in `backend/src/server.ts`. For simplicity, some environment variables are hard-coded.

1. Open the `backend` project in VS Code
2. Open `backend/src/server.ts`
    - This is the local Express entry point. It has some hard-coded environment variables to keep things simple
3. Update process.env.DATA_TABLE_NAME
    - This should be the name of the DynamoDB Table created by `deploy-dev.sh`
4. Launch the `Debug Express` debug configuration

Your app is now running with the debugger attached, add break points as needed.

### Integration Test

This test is hard-coded for `http://localhost:5000` for simplicity.

```bash
cd backend/spec/integration
npx jest api.spec.ts
```

You can also run your tests by using the `Run Current Jest File` launch configuration

## Running the API Locally

```bash
cd backend
npm run start
```