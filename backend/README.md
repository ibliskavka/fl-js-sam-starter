# Backend

## Testing

```bash
cd spec/lambda
npx jest starterLambda.spec.ts
```

## Build

`npm run build`

## Deploy

Modify parameters and execute `deploy.sh`

- PROFILE: AWS Account Profile
- REGION: Deploy
- BUCKET: Build artifact S3 bucket
- ENVIRONMENT: Used for tagging and naming
