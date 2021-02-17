# CloudFormation Custom Resource

A CloudFormation Custom Resource is Lambda code that is executed by CloudFormation during the deploy process.

This custom resource extracts the frontend application from a zip file into an S3 folder, and updates config.json

All related assets are in 1 folder because this code is only relevant to the application deployment.
