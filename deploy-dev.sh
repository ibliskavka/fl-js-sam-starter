#!/bin/bash -v
set -e                        # Fail script on error

PROFILE="default"
REGION="us-east-1"                          # Deployment Region
BUCKET="lsw-serverless-$REGION"             # Build Artifact Bucket - must be created beforehand

ENVIRONMENT="dev"
ADMIN_USER_EMAIL="lsw-apps@outlook.com"

STACK_NAME="fl-js-${ENVIRONMENT}"

. ./deploy.sh
