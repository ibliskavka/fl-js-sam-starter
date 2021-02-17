#!/bin/bash -v
set -e                        # Fail script on error

PROFILE="default"
REGION="us-east-1"                          # Deployment Region
BUCKET="lsw-serverless-$REGION"             # Build Artifact Bucket - must be created beforehand

ENVIRONMENT="demo"

STACK_NAME="fl-js-${ENVIRONMENT}"

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
      ParameterKey=AdminUserEmail,ParameterValue="ibliskavka@live.com" \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --region $REGION \
    --profile $PROFILE
