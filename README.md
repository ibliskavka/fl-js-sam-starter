# FloridaJS AWS Serverless Demo

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ibliskavka_fl-js-sam-starter&metric=bugs)](https://sonarcloud.io/dashboard?id=ibliskavka_fl-js-sam-starter)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ibliskavka_fl-js-sam-starter&metric=code_smells)](https://sonarcloud.io/dashboard?id=ibliskavka_fl-js-sam-starter)

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ibliskavka_fl-js-sam-starter&metric=security_rating)](https://sonarcloud.io/dashboard?id=ibliskavka_fl-js-sam-starter)

This project demonstrates how to create installable serverless web applications in AWS

- [Presentation Video](https://youtu.be/pqcSUxIXYb4)
- [Presentation Slides](https://prezi.com/view/xTv8rPh2vNpNNmyt7thX/)
- [Presentation Notes](presentation.md)
- [FloridaJS Meetup Event](https://www.meetup.com/floridajs/events/275711268)

## Developer Environment Setup

### Prerequisites

1. [AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
3. [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
4. [Node JS](https://nodejs.org/en/download/)
5. [Visual Studio Code](https://code.visualstudio.com/)
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
