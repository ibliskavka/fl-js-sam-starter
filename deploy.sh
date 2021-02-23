#!/bin/bash -v
set -e                        # Fail script on error

# This script expects environment variables. See ./deploy-dev.sh

echo "Building"
./build.sh

cd backend

sam validate -t .aws-sam/build/template.yaml --region $REGION --profile $PROFILE

sam deploy \
    -t .aws-sam/build/template.yaml \
    --stack-name $STACK_NAME \
    --s3-bucket $BUCKET \
    --s3-prefix $STACK_NAME \
    --parameter-overrides \
      ParameterKey=Environment,ParameterValue="${ENVIRONMENT}" \
      ParameterKey=AcmCertArn,ParameterValue="" \
      ParameterKey=AppAlias,ParameterValue="" \
      ParameterKey=AdminUserEmail,ParameterValue="${ADMIN_USER_EMAIL}" \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --region $REGION \
    --profile $PROFILE
