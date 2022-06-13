#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
 echo 'terra-submersa.github.io' > CNAME

if [ ! -d .git ]
then
  git init
  git remote add origin git@github.com:terra-submersa/lawnmower.git
  git checkout -b main
  git add -A
  git commit -m 'deploy'
  git push -f git@github.com:terra-submersa/lawnmower.git main:gh-pages
else
  git checkout gh-pages
  git add -A
  git commit -m 'deploy'
  git push
fi

cd -

