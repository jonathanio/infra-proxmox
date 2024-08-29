# n3t.uk Terraform Cloud {{configuration-name}} Configuration

{{description}}

## Usage

This Terraform configuration is not designed to be run locally, and will instead
by run through it's [Terraform Cloud][terraform-cloud] [Workspace][workspace];
it is here all state and resources will be managed. All [Taskfile][taskfile]
tasks below run with an empty backend to prevent accidental triggering or
connecting with the remote workspace.

[terraform-cloud]: https://app.terraform.io
[workspace]: https://app.terraform.io/app/n3tuk/workspaces

## Testing and Validation

This Terraform Module uses both [Taskfile][taskfile] and
[`pre-commit`][pre-commit] to manage this repository through testing and
committing stages.

[taskfile]: https://taskfile.dev/
[pre-commit]: https://pre-commit.com/

### Taskfile

To use [Taskfile][taskfile], you can run `task` from the command-line:

```sh
# task --list
task: Available tasks for this project:
* checkov:                      Analyise the Terraform configuration
* clean:                        Clean the Terraform configuration
* default:                      Run the default tasks
* docs:                         Update README.md files for the Terraform configuration
* fmt:                          Reformat the syntax of the Terraform configuration using terraform
* lint:                         Lint the Terraform configuration
* validate:                     Validate the Terraform configuration
* configuration:checkov:        Statically analyise the Terraform configuration
* configuration:clean:          Remove all temporary files from this configuration
* configuration:default:        Run the standard validation check and documentation generation      (aliases: configuration)
* configuration:docs:           Update the README.md file for this Terraform configuration
* configuration:fmt:            Reformat the syntax of the Terraform configuration using terraform
* configuration:lint:           Run initial validation of the run-time configuration
* configuration:validate:       Validate the Terraform configuration
```

Normally `validate`, `docs`, and `checkov` are the usual calls:

```sh
# task validate
task: Task "configuration:init" is up to date
task: Task "configuration:fmt" is up to date
task: Task "configuration:validate" is up to date
```

In this example, `validate` depends on other tasks being run first (such as
`init` and `fmt`), and also manages the downstream calls, if set up.

A useful set-up is with `--watch`, which allows `task` to run and constantly
monitor the files that are sources for each task, and if the contents change on
any one of them, run all the required dependencies and tasks associated with
that file automatically. For example, which allows for constant updates of the
documentation for Terraform as you write the Terraform configuration.

```sh
# task --watch
task: Started watching for tasks: default
task: Task "configuration:fmt" is up to date
  (snip...)
```

### pre-commit

The [`pre-commit`][pre-commit] tool needs to first be installed, after which it
checks every commit to see if it's valid, that it doesn't have any bad links,
large files, incorrect JSON documents, badly formatted YAML files, and issues
with Markdown documentation and Terraform configurations.

```sh
# pre-commit install
pre-commit installed at .git/hooks/pre-commit
```
