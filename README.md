# reply-language

A Claude Code Stop hook that keeps replies in Traditional Chinese (Taiwan). When Claude ends a turn with a reply written mostly in English, the hook sends it back once with the instruction to rewrite the same reply in Traditional Chinese with Taiwan terminology, keeping code, commands, paths and identifiers as they are.

## How it decides

- It checks only the last part of the reply: the assistant text after the last user-role entry in the transcript (a prompt, a tool result or a subagent hand-back). English status lines written earlier in the turn do not count.
- Code blocks, inline code, URLs and paths are removed first, so technical terms do not count.
- A reply is English when it has at least 40 letters and Han characters together, and more than twice as many Latin letters as Han characters.
- When Claude is already rewriting because of this hook (`stop_hook_active`), the reply is not checked again.

## Install

From the [claude-hooks](https://github.com/AnnihilationWizard/claude-hooks) marketplace:

```
/plugin marketplace add AnnihilationWizard/claude-hooks
/plugin install reply-language@claude-hooks
```

Or from this repository alone:

```
/plugin marketplace add AnnihilationWizard/reply-language
/plugin install reply-language@reply-language
```

Choose the **user** scope so it runs in every session. If the same script is also registered in `~/.claude/settings.json`, remove that entry, or each reply is checked twice.

Plugins do not load in Claude Code on the web (cloud sessions). To use the hook there, commit a copy of the script to the repository and register it in that repository's `.claude/settings.json`.

## Requirements

Node.js 18 or later on `PATH`.

## Test

```bash
node --test hooks/
```

## License

[MIT License](LICENSE).
