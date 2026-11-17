# Contributing

Thank you for helping improve reply-language. It is a small Claude Code plugin with one Stop hook. Start with the [README](README.md).

## Report a bug

Use the [issue tracker](https://github.com/AnnihilationWizard/reply-language/issues). Include:

- The reply-language version, Claude Code version (`claude --version`) and operating system.
- Whether a reply was sent back when you expected it to pass, or passed when you expected it to be sent back.
- The final reply text, or a shortened version that still shows the problem, with private content removed.
- Whether the turn had tool calls or subagents before the final reply.

Never paste source code, file contents or paths you are not allowed to share. For security concerns, follow [SECURITY.md](SECURITY.md).

## Propose a change

Open an issue that describes the problem and the intended behavior before a broad change. Keep changes focused: the hook should only decide whether the final reply goes back to Claude, never edit the transcript or settings.

## Develop and verify

Run from the repository root:

```bash
claude plugin validate --strict .
node --test hooks/
```

For behavior changes, add or update a test in `hooks/reply-language-check.test.mjs`.

## Submit a pull request

- Explain the problem and the resulting behavior.
- List the checks you ran and their results.
- Update the README and CHANGELOG when behavior changes, and raise `version` in `.claude-plugin/plugin.json`.
- Use a Conventional Commit message, such as `fix: ignore quoted error messages`.
