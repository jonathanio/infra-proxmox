const fs = require('fs')

module.exports = ({core, inputs}) => {
  const version_re = new RegExp(/^\d+\.\d+\.\d+$/)

  // Do some pre-work to prepare the job summary, and as this is fetching the
  // version for Terraform, it is the first step run, so add the heading too
  core.summary
    .addRaw(
      'Preparing to initilise and validate the Terraform configuration in `' +
      inputs.path + '/` as part of the `terraform-ci` Workflow').addEOL()

  var version_file = '.terraform-version'
  if (fs.existsSync(inputs.path + '/.terraform-version')) {
    version_file = inputs.path + '/.terraform-version'
  }

  try {
    var version = fs.readFileSync(version_file,'utf8').toString().trim()
  } catch (e) {
    core.summary
      .addRaw('**Error**: The .terraform-version file does not exist. Cannot set version.').addEOL()
      .write()
    core.setFailed('The .terraform-version file does not exist. Cannot set version.')
    return
  }

  if (!version_re.test(version)) {
    core.summary
      .addRaw('**Error**: The .terraform-version file does not contain a valid value').addEOL()
      .write()
    core.setFailed('The .terraform-version file does not contain a valid value: ' + version)
    return
  }

  core.info('Terraform version set to v' + version)
  core.summary
    .addRaw('- Terraform version set to `v' + version + '`').addEOL()
    .write()
  core.setOutput('version', version)
}
