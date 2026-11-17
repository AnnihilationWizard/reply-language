# Security Notes

reply-language only decides whether Claude Code sends a finished reply back to Claude for a rewrite. These notes describe what it can reach; they do not establish a support SLA.

## What the hook does

- Claude Code runs it as a Stop hook, with `node`, as your user, when Claude ends a turn.
- It reads the hook input from stdin and the session transcript file whose path that input names.
- It counts characters in the last reply and, when the reply is mostly English, prints a `block` decision with a fixed instruction for Claude.
- It does not write files, run other programs, make network requests or change settings. It sends nothing outside Claude Code.

The transcript holds the whole session, including tool output. The hook keeps only the text of the last reply in memory while it runs.

## Report a security concern

If this repository offers GitHub private vulnerability reporting, use the **Report a vulnerability** option on its [Security page](https://github.com/AnnihilationWizard/reply-language/security). This document does not assume that the option is enabled.

If no private reporting option is available, open a minimal issue asking the maintainer to arrange a private channel. Do not publish exploit details, credentials or private code in that issue.

Include the affected version, Claude Code version, environment, steps to reproduce and impact. No response-time or supported-version guarantee is currently stated.
