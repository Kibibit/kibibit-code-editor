# Testing

We want Kibibit to be used by many people. In order to ensure quality and prevent regressions, all contributions require unit tests proving that the contribution:

1. Fixes a bug
2. Performs new functionality as expected
3. Behaves in a predictable manner when misused (bad input given as an option for example)

In addition, where a contribution is aimed at resolving a bug or implementing a feature that can only be measured in a real browser, an e2e test proving the expected behaviour should be included.

# Link PR and issues

To connect between your PR and a specific Issue, write the following somewhere in your PR: `connects to #{PR number}`

# README

If your PR adds new behaviour or modifies existing behaviour, the README should be updated.

# Coding style

> All code in any code-base should look like a single person typed it, no matter how many people contributed.

You might not agree with our code styling and that's fine, but if you're going to send PRs, treat this [jscs config file](.jscsrc) as a law.
You can always run jscs to check for any lint errors. just run `gulp lint`. For ***some*** automatic fixes, you can also run `gulp format`
