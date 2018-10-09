const _exec = require('child_process').exec
const { promisify } = require('util')
const exec = promisify(_exec)

;(async () => {
  const releaseHash = (await exec('git rev-parse HEAD')).stdout
  await exec(`git checkout master`)
  await exec(`git cherry-pick ${releaseHash}`)
})()
