#!/bin/bash -v
set -e                        # Fail script on error

echo "Install Dependencies"
npm i --prefix backend
npm i --prefix frontend
npm i --prefix export-tool