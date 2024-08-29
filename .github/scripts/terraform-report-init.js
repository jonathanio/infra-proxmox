const fs = require('fs')

module.exports = ({github, core, inputs}) => {
  core.summary
    .addRaw('- The terraform init Step outcome was: ' + inputs.init).addEOL()
    .write()

  // Put out notices based the state of the init job
  if (inputs.init != 'success') {
    if (inputs.init == 'failure') {
      var log = fs.readFileSync('/tmp/terraform.init.log','utf8').toString()

      message = '## Terraform Status Report\n\n' +
        'GitHub Actions has run the `terraform-validate` workflow against your Pull Request, but has **failed** to run ' +
        '[`terraform init -backend=false`](https://www.terraform.io/cli/commands/init) against the Configuration ' +
        'in `' + inputs.path + '`. Expand on the following summary to see the results from this command:\n\n' +
        '<details>\n' +
        '<summary><code>terraform init</code> Log</summary>\n\n' +
        '```\n' +
        log + '\n' +
        '```\n' +
        '</details>\n\n'

      // Add HTML comment to allow the comment to be hidden if the Action is
      // re-run so that only the latest comment can be shown, but we retain the
      // history of all the runs for this Pull Request
      message += '<!-- terraform-ci-report -->'

      github.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        body: message
      })

      core.summary
        .addRaw('**Error**: terraform init Failed. Stopping further processing.').addEOL()
        .write()
      core.setFailed('terraform init Failed. Stopping further processing.')
    } else {
      core.info('terraform init Step outcome was ' + inputs.init)
    }
  }
}
