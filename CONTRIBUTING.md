# Style Guide

## Branches

* Choose *short* and *descriptive* names:

  ```shell
  # good
  $ git checkout -b oauth-migration

  # bad - too vague
  $ git checkout -b login_fix
  ```

* **Use *dashes* to separate words.**

* Delete your branch from the upstream repository after it's merged, unless
  there is a specific reason not to.

## Commits

* Each commit should be a single *logical change*. Don't make several
  *logical changes* in one commit. For example, if a patch fixes a bug and
  optimizes the performance of a feature, split it into two separate commits.

* Don't split a single *logical change* into several commits. For example,
  the implementation of a feature and the corresponding tests should be in the
  same commit.

* Commit *early* and *often*. Small, self-contained commits are easier to
  understand and revert when something goes wrong.

* Commits should be ordered *logically*. For example, if *commit X* depends
  on changes done in *commit Y*, then *commit Y* should come before *commit X*.

Note: While working alone on a local branch that *has not yet been pushed*, it's
fine to use commits as temporary snapshots of your work. However, it still
holds true that you should apply all of the above *before* pushing it.

### Messages

* Use `ungit` or your favorite code editor, not the terminal, when writing a commit message:

  ```shell
  # good
  $ git commit

  # bad
  $ git commit -m "Quick fix"
  ```

  Committing from the terminal encourages a mindset of having to fit everything
  in a single line which usually results in non-informative, ambiguous commit
  messages.

* The summary line (ie. the first line of the message) should be
  *descriptive* yet *succinct*. Ideally, it should be no longer than
  *50 characters*. It should be capitalized and written in imperative present
  tense. It should not end with a period since it is effectively the commit
  *title*:

  ```shell
  # good - imperative present tense, capitalized, fewer than 50 characters
  Mark huge records as obsolete when clearing hinting faults

  # bad
  fixed ActiveModel::Errors deprecation messages failing when AR was used outside of Rails.
  ```

# Testing

We want Kibibit to be used by many people. In order to ensure quality and prevent regressions, all contributions require unit tests proving that the contribution:

1. Fixes a bug
2. Performs new functionality as expected
3. Behaves in a predictable manner when misused (bad input given as an option for example)

In addition, where a contribution is aimed at resolving a bug or implementing a feature that can only be measured in a real browser, an e2e test proving the expected behaviour should be included.

# Link PRs and issues

To connect between your PR and a specific Issue, write the following somewhere in your PR: `connects to #{PR number}`

# README

If your PR adds new behaviour or modifies existing behaviour, the README should be updated.

# Coding style

> All code in any code-base should look like a single person typed it, no matter how many people contributed.

You might not agree with our code styling and that's fine, but if you're going to send PRs, treat this [jscs config file](.jscsrc) as a law.
You can always run jscs to check for any lint errors. just run `gulp lint`. For ***some*** automatic fixes, you can also run `gulp format`
