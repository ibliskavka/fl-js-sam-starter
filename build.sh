#!/bin/bash -v
set -e                        # Fail script on error

echo "Building Back End"
npm run build --prefix backend
sam validate -t backend/.aws-sam/build/template.yaml

# Comment out the build step to speed up deploys without UI update
echo "Building Apps"
npm run build --prefix frontend

echo "Create ZIP files of build directories"
cd frontend/build/
zip -r ../../backend/.aws-sam/build/CustomResourceFunction/app.zip .
