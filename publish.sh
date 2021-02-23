#!/bin/bash -v
set -e                                            # Fail script on error

REGION="us-east-1"                                # SAR Region (apps must be deployed per region)

PROFILE="default"                                 # AWS Profile to use for deploy
PUBLIC_BUCKET="my-sar-builds-$REGION-public"      # Public Bucket - Hosts readme files/assets. Can be shared by region

echo "Building"
./build.sh

cd backend
sam validate -t .aws-sam/build/template.yaml --region $REGION --profile $PROFILE

SAM_BUCKET="my-sar-builds-$REGION"                # Artifact Bucket - must be created beforehand. Per region.
echo "Deploying to $REGION"

sam package -t .aws-sam/build/template.yaml --output-template-file .aws-sam/build/packaged.yaml --s3-bucket ${SAM_BUCKET} --region ${REGION} --profile ${PROFILE} 
sam publish -t .aws-sam/build/packaged.yaml --region ${REGION} --profile ${PROFILE}
