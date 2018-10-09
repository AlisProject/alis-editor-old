git branch -D release
git checkout -b release
mv .gitignore ._gitignore
git add -A
rm -rf dist
yarn build
git commit -m 'build'
yarn standard-version
node getHash.js
