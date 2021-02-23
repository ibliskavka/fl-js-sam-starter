# FloridaJS Serverless Starter

Please review the presentation and notes for an overview of this project.

[Presentation](https://prezi.com/view/xTv8rPh2vNpNNmyt7thX/)

[Presentation Notes](presentation.md)

## Developer Environment Setup

### Prerequisites

1. AWS Account
2. AWS CLI
3. SAM CLI
4. Node JS
5. Visual Studio Code
    - You can use other IDEs, but this repo assumes VS Code
6. Mac, Linux or Windows Subsystem for Linux
    - You can run this on Windows, but the deploy scripts use bash

### Install Dependencies

```bash
# Install Dependencies
npm i --prefix backend
npm i --prefix frontend
```

### Build & Deploy

Review and modify the `deploy-dev.sh` script variables.

- PROFILE: Your AWS CLI Profile
- REGION: Your AWS Deployment Region
- BUCKET: Your Artifact Bucket name. Must be created beforehand.
- ENVIRONMENT: Used for naming and tagging
- ADMIN_USER_EMAIL: Change this to your email account
- STACK_NAME: This will be your CloudFormation stack name. Prefer lower case.

```bash
# Deploy the stack
chomd +x deploy.sh
chomd +x deploy-dev.sh
./deploy-dev.sh
```

1. Check your Email for the Invite from Cognito
2. Check the CloudFormation stack output for your CloudFront App URL

Also see:

- [Backend Readme](backend/README.md)
- [Frontend Readme](frontend/README.md)

## P.S. - VoiceFoundry is Hiring AWS Engineers

DM me your Resume

https://linkedin.com/in/ibliskavka