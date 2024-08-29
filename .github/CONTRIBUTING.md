# Contributing to this Repository

This guide provides help on how to work with and develop for this repository,
including the tooling needed and expected practices around naming, files,
variables, etc..

## pre-commit Tooling

This repository uses the [`pre-commit`][pre-commit] tooling to provide a set of
common and specific steps which should be run before any code is committed to
this repository:

[pre-commit]: https://pre-commit.com

```sh
$ brew install pre-commit
$ pre-commit --install
pre-commit installed at .git/hooks/pre-commit
```

This includes:

- Checking that the file names are compatible with multiple operating systems by
  avoiding case clashes;
- Checking that large files are not accidentally added to the history;
- Checking that files are correctly formatting without trailing spaces and new
  lines at the end of the file; and
- That Terraform configuration is valid; etc.

We **strongly** recommend using it as it provides useful fast feedback on your
changes before committing and pushing them up to the repository branch.

## task Tooling

This repository also uses the [`task`][taskfile] tooling from
[Taskfile][taskfile] to provide the automation of standard tasks and checks:

[taskfile]: https://taskfile.dev/

```sh
$ task --list
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

Running `task docs` or `task validate` are useful options for checking all the
docs are up-to-date, or that all the configurations are valid.

A recommended command is with the `--watch` command:

```sh
$ task --watch
task: Started watching for tasks: default
task: Task "configuration:fmt" is up to date
task: Task "configuration:validate" is up to date
  (...)
```

Here, [taskfile][taskfile] will sit in the background and monitor the files for
changes. If the contents of any file change, then the appropriate tasks will be
done. In this case it'll continually check the configurations are valid, and
that the docs are up-to-date.

Running `task docs validate checkov --watch` will also ensure that `checkov` is
run on changes too providing static analysis of the Terraform code as well as
any GitHub Actions configured, and general JSON, YAML, and secrets checks.

## Terraform Docs

This repository makes use of [`terraform-docs`][terraform-docs] to manage the
various `README.md` files for each of the Terraform configurations and modules.
Both [`task`] and GitHub Workflows will update these if it detects any changes
between what is documented and what is configured inside Terraform.

[terraform-docs]: https://terraform-docs.io/

However, the GitHub Workflow does have an issue when it comes to checking and
committing these changes: [Those changes cannot trigger GitHub Workflows
themselves][token-in-workflow], as to prevent infinite loops. Although a full
Personal Access Token can support this, creating PATs for each repo and managing
scope is difficult and it presents an overall security risk.

[token-in-workflow]: https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow

As such, this repository is configured to allow forcing a CI run using a label:
`force-ci-run`. So, for example, if [`dependabot`][dependabot] makes an update
to a module or provider, there will be a change to the documentation via
`terraform-docs`. However, as `terraform-docs` is not run by dependabot, that
the GitHub Workflow will see that change and commit it back, but without
re-running any of the CI, which means any enforced checks are no longer valid.

[dependabot]: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

By adding the label `force-ci-run` (which in turn will immediately removed by
the GitHub Workflow), you can forcefully run all the CI workflows and get the
results without having to commit anything yourself.

## Naming Conventions

The requirements for the naming of resources is as follows. In all cases the
naming should only be in lower-case.

| Resource&nbsp;Identifier&nbsp;Name | Use&nbsp;Case&nbsp;Type    | Notes                                                                                                                                                                     |
| :--------------------------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{terraform-filename}`             | [`kebab-case`][kebab-case] | (None)                                                                                                                                                                    |
| `{terraform-resource}`             | [`snake-case`][snake-case] | (None)                                                                                                                                                                    |
| `{terraform-variables}`            | [`snake-case`][snake-case] | (None)                                                                                                                                                                    |
| `{terraform-outputs}`              | [`snake-case`][snake-case] | (None)                                                                                                                                                                    |
| `{aws-resource}`                   | [`kebab-case`][kebab-case] | Although many services support many ranges of characters and cases, bar some very small edge-cases, the most common case which works across all services is `kebab-case`. |
| `{tfc-resource}`                   | [`kebab-case`][kebab-case] | (None)                                                                                                                                                                    |

[kebab-case]: https://en.wikipedia.org/wiki/Letter_case#Kebab_case
[snake-case]: https://en.wikipedia.org/wiki/Snake_case

### Resources, Parameters and Variable Names

The naming of parameters, variables, rules, and outputs in Terraform generally
follow the same pattern: Everything in should be in [Snake Case][snake-case].
This prevents misinterpreting the dash (`-`) as a mathematical operator rather
than a word separator in a resource name.

It keeps the naming aligned with how resources, providers, data sources, and
arguments and attributes are named in Terraform too.

#### Terraform Resource

```hcl
# terraform/main.tf

#                       "{terraform-resource}"
resource "aws_instance" "good_instance" {
  ami           = "ami-00000abc123456789"
  instance_type = "t2.micro"

  credit_specification {
    cpu_credits = "unlimited"
  }

  tags = {
    #     "{aws-resource}"
    Name = "ec2-instance-name"
  }
}
```
