#!/bin/bash -v
set -e                        # Fail script on error

PROFILE="default"                       # AWS Profile to use for deploy
REGION="us-east-2"                      # Deployment Region

CLIENT="fl-js"
BUCKET="${CLIENT}-builds-${REGION}"     # Artifact Bucket - must be created beforehand

# Computed Parameters
PROJECT="sam-starter"
TIMESTAMP=$(date "+%Y%m%d-%H%M%S")
PREFIX="$PROJECT/$TIMESTAMP"

./build.sh
sam validate -t .aws-sam/build/template.yaml --region $REGION --profile $PROFILE

## Build and Package
sam package \
    -t .aws-sam/build/template.yaml \
    --s3-bucket $BUCKET \
    --s3-prefix $PREFIX \
    --output-template-file .aws-sam/packaged.yaml \
    --region $REGION \
    --profile $PROFILE

aws s3 cp .aws-sam/packaged.yaml s3://$BUCKET/$PREFIX/packaged.yaml --region $REGION --profile $PROFILE

echo s3://$BUCKET/$PREFIX/packaged.yaml

echo DEPLOY USING CloudFormation. S3 Path: https://s3.amazonaws.com/$BUCKET/$PREFIX/packaged.yaml