#!/bin/bash -v
set -e                        # Fail script on error

PROFILE=${1}                               # AWS Profile to use for deploy
REGION=${2}                                # Deployment Region
BUCKET=${3}                                # Artifact Bucket - must be created beforehand
DISTRIBUTION_ID=${4}

# Can I call this dynamically some how??
npm run build:dev 

aws s3 sync build s3://$BUCKET --delete --profile $PROFILE --region $REGION
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths / --profile $PROFILE --region $REGION