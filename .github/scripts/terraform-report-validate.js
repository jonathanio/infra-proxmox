const fs = require('fs')

module.exports = ({github, core, inputs}) => {
  core.summary
    .addRaw('- The terraform validate Step outcome was: ' + inputs.validate).addEOL()
    .addRaw('- The terraform fmt Step outcome was: ' + inputs.fmt).addEOL()
    .write()

  // Put out notices based the state of the valiate and format jobs
  if (inputs.validate == 'failure' || inputs.fmt == 'failure') {
    message = '### Terraform Status Report\n\n' +
      'GitHub Actions has run the `terraform-ci` workflow against your Pull Request, and, after a successful ' +
      '[`init`](https://www.terraform.io/cli/commands/init) step, it has **failed** when running '

    if (inputs.validate == 'failure') {
      message += '[`terraform validate`](https://www.terraform.io/cli/commands/validate) '
    }

    if (inputs.fmt == 'failure') {
      if (inputs.validate == 'failure') {
        message += 'and '
      }
      message += '[`terraform fmt`](https://www.terraform.io/cli/commands/fmt) '
    }

    message += 'against the Configuration in `' + inputs.path + '`. Expand on the following '

    if (inputs.validate == 'failure' && inputs.fmt == 'failure') {
      message += 'summaries '
    } else {
      message += 'summary'
    }

    message += 'to see the results from '

    if (inputs.validate == 'failure' && inputs.fmt == 'failure') {
      message += 'these commands:\n\n'
    } else {
      message += 'this command:\n\n'
    }

    if (inputs.validate == 'failure') {
      message += '<details>\n' +
        '<summary><code>terraform validate</code> Output</summary>\n\n' +
        '```\n' +
        fs.readFileSync('/tmp/terraform.validate.log','utf8').toString() + '\n' +
        '```\n' +
        '</details>\n\n'
    }

    if (inputs.fmt == 'failure') {
      message += '<details>\n' +
        '<summary><code>terraform fmt</code> Output</summary>\n\n' +
        '```diff\n' +
        fs.readFileSync('/tmp/terraform.fmt.log','utf8').toString() + '\n' +
        '```\n' +
        '</details>\n\n'
    }

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
  }

  // Add notices to the action output as well
  if (inputs.validate == 'failure') {
    core.summary
      .addRaw('**Error**: terraform validate Failed. Stopping further processing.')
      .addEOL()
      .write()
    core.setFailed('terraform validate Failed. Stopping further processing.')
  } else if (inputs.validate != 'success') {
    core.info('terraform validate Step outcome was ' + inputs.validate)
  }

  if (inputs.fmt === 'failure') {
    core.summary
      .addRaw('**Error**: terraform fmt Failed. Stopping further processing.')
      .addEOL()
      .write()
    core.setFailed('terraform fmt Failed. Stopping further processing.')
  } else if (inputs.fmt != 'success') {
    core.info('terraform fmt Step output was ' + inputs.fmt)
  }
}
