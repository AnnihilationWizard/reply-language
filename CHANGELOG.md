# Changelog

## [1.0.0] - 2026-11-17

- First release as a plugin. Before, the script lived only in `~/.claude/hooks/`.
- Only the last part of a reply is checked: the walk back through the transcript stops at any user-role entry, including tool results and subagent hand-backs. Before, it stopped only at entries holding text, so English status lines from earlier steps of a turn were counted and a Chinese final reply was blocked ([englishLearning#14](https://github.com/AnnihilationWizard/englishLearning/issues/14)).
