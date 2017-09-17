#!/bin/bash

git config --global push.default matching
git fetch --tags

LATEST=`cat LATEST`
CURRENT=`git tag --list | grep -v build | sort --version-sort | tail -n 1`

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
  git pull --all
  git push --all && git push --tags
else
  echo "Not deploying new build"
fi
