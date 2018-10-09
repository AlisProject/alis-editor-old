git branch -D release
git checkout -b release
mv .gitignore ._gitignore
rm -rf dist
yarn build
git add -A
git commit -m 'build'
yarn standard-version
node getHash.js
