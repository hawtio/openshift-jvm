#!/bin/bash

git config --global push.default matching
git fetch --tags

echo "Deploying new build"
git config --global user.email "circleci@mail.com" && \
git config --global user.name "circleci" && \
echo "Cleaning and rebuilding" && \
rm -Rf site/* && \
gulp bower path-adjust && \
gulp build && \
gulp site && \
gulp deploy
