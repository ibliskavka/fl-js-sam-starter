#!/bin/bash -v
set -e                        # Fail script on error

PROFILE="default"
REGION="us-east-1"                          # Deployment Region
BUCKET="your-bucket-name"             # Build Artifact Bucket - must be created beforehand

ENVIRONMENT="dev"
ADMIN_USER_EMAIL="youremail@test.com"

STACK_NAME="fl-js-${ENVIRONMENT}"

. ./deploy.sh
