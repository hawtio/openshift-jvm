#!/bin/bash

git config --global push.default matching
git fetch --tags

LATEST=`cat LATEST`
CURRENT="1.0.62"

echo "Latest on disk: $LATEST"
echo "Latest in repo: $CURRENT"

if [ "$CURRENT" != "$LATEST" ]
then
  echo "Deploying new build"
  git config --global user.email "circleci@mail.com" && \
  git config --global user.name "circleci" && \
  echo "Cleaning and rebuilding" && \
  rm -Rf site/* && \
  gulp bower path-adjust && \
  gulp build && \
  gulp site && \
  gulp deploy && \
  echo $CURRENT > LATEST && \
  git add LATEST && \
  git commit -m "[ci skip] Updating latest tag" && \
  git push && git push --tags
else
  echo "Not deploying new build"
fi
