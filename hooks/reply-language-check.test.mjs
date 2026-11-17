// Runs the hook the way Claude Code does: a transcript file on disk, its path on stdin.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), 'reply-language-check.mjs')
const EN = 'Local has no commits of its own, so this is a fast-forward merge and nothing else needs to happen here at all.'
const ZH = '已經把遠端拉下來並合併：本機 main 快轉到最新提交，跟遠端一致，工作樹乾淨，也沒有留下任何暫存。過程中出了一次狀況，已經處理好了。'

const user = (content) => ({ type: 'user', message: { role: 'user', content } })
const reply = (text) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } })
const toolCall = [
  { type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id: 't1', name: 'Bash', input: {} }] } },
  user([{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }]),
]

function runHook(entries, extra = {}) {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'reply-language-')), 'transcript.jsonl')
  writeFileSync(file, entries.map((entry) => JSON.stringify(entry)).join('\n') + '\n')
  const out = execFileSync('node', [HOOK], { input: JSON.stringify({ transcript_path: file, ...extra }) }).toString()
  return out ? JSON.parse(out).decision : 'pass'
}

test('a Chinese final reply passes even when earlier steps of the turn were in English', () => {
  const turn = [user('拉下遠端合併'), reply(EN), ...toolCall, reply(EN), ...toolCall, reply(EN), ...toolCall, reply(ZH)]
  assert.equal(runHook(turn), 'pass')
})

test('an English final reply is blocked', () => {
  assert.equal(runHook([user('拉下遠端合併'), reply(ZH), ...toolCall, reply(`${EN} ${EN}`)]), 'block')
})

test('a Chinese reply passes', () => {
  assert.equal(runHook([user('拉下遠端合併'), reply(ZH)]), 'pass')
})

test('code, paths and URLs do not count as English', () => {
  const text = `改好了，請執行：\n\`\`\`bash\n${EN}\n${EN}\n\`\`\`\n設定檔在 config/settings/local.json，文件在 https://example.com/${'a'.repeat(80)}。`
  assert.equal(runHook([user('怎麼做'), reply(text)]), 'pass')
})

test('a rewrite already forced by this hook is not checked again', () => {
  assert.equal(runHook([user('拉下遠端合併'), reply(`${EN} ${EN}`)], { stop_hook_active: true }), 'pass')
})
