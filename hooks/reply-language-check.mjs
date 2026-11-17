#!/usr/bin/env node
// Stop hook: blocks a reply written mostly in English and asks for Traditional Chinese (Taiwan).
// Code blocks, inline code, URLs and paths are ignored, so technical terms do not count.
import { readFileSync } from 'node:fs'

const MIN_CHARS = 40
const LATIN_TO_HAN_RATIO = 2

function lastReplyText(transcriptPath) {
  const lines = readFileSync(transcriptPath, 'utf8').trim().split('\n')
  const texts = []
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    let entry
    try {
      entry = JSON.parse(lines[i])
    } catch {
      continue
    }
    // Any user-role entry (a prompt, a tool result, a subagent hand-back) ends the last reply segment.
    if (entry?.type === 'user') break
    const content = entry?.message?.content
    if (entry?.type === 'assistant' && Array.isArray(content))
      for (const block of content) if (block.type === 'text') texts.unshift(block.text)
  }
  return texts.join('\n')
}

export function languageVerdict(text) {
  const prose = text
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/`[^`\n]*`/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/(?:[\w.-]+\/)+[\w.-]+/gu, ' ')
  const han = (prose.match(/\p{Script=Han}/gu) ?? []).length
  const latin = (prose.match(/[A-Za-z]/gu) ?? []).length
  return { han, latin, english: han + latin >= MIN_CHARS && latin > han * LATIN_TO_HAN_RATIO }
}

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
if (!input.stop_hook_active && input.transcript_path) {
  const { english } = languageVerdict(lastReplyText(input.transcript_path))
  if (english)
    process.stdout.write(
      JSON.stringify({
        decision: 'block',
        reason:
          'The reply to the user is mostly in English. Rewrite the same reply in Traditional Chinese with Taiwan terminology, keeping code, commands, paths and identifiers as they are.',
      }),
    )
}
