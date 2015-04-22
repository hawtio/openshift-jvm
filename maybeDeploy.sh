#!/bin/bash

LATEST=`cat LATEST`
CURRENT=`git tag --list | tail -n 1`

if [ "$CURRENT" != "$LATEST" ]
then
  echo "Deploying new build"
  git config --global user.email "circleci@mail.com" && \
  git config --global user.name "circleci" && \
  gulp build && \
  gulp site && \
  gulp deploy && \
  pushd .publish && \
  git tag ${CURRENT}-build && \
  git push && git push --tags && \
  popd && \
  echo $CURRENT > LATEST && \
  git commit -m "Updating latest tag" && \
  git push
else
  echo "Not deploying new build"
fi

