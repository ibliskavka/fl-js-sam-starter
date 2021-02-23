# Frontend

React + AWS Amplify

## Running the Frontend Locally

The app reads runtime configuration from `public/config.json`

This file is configured automatically during the CloudFormation deploy, but must be configured manually for local starts.

The easiest way to get your dev configuration is to copy the file from https://your-cloudfront-url/config.json


```bash
npm i
npm start
```