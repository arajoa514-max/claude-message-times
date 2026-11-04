import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { SentMessage } from '../types'

const PANE = 'message-times'
const TITLE = '내 메시지 시간'
// Change the tag when a message's fields change: it declines what an earlier
// version stored, which outlives a reload.
const sent = atom({ plugin: 'message-times', key: 'sent' } as const, [], {
  shape: 'sent-1',
})

// Messages the person typed; background notices and plugin prompts are left out.
const TYPED = new Set(['composer', 'bridge', 'sdk', 'unclassified'])

// "11/04 09:23" in Korean time, without relying on Intl time zones.
function kst(ms: number): string {
  const d = new Date(ms + 9 * 3600_000)
  const two = (n: number) => String(n).padStart(2, '0')
  return `${two(d.getUTCMonth() + 1)}/${two(d.getUTCDate())} ${two(d.getUTCHours())}:${two(d.getUTCMinutes())}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'message-times',
      description: '이 세션에서 보낸 메시지와 시간을 옆 패널로 보여 줍니다',
    })
    void $.ui.open({ id: PANE, title: TITLE })

    return next(e)
  })

  on('command.run', { command: 'message-times' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })

    return { text: '메시지 시간 패널을 열었어요.' }
  })

  on('prompt.submit', async ($, e, next) => {
    // Recording never holds up the message: a failure only drops this entry.
    try {
      const text = e.text.replace(/\s+/g, ' ').trim().slice(0, 80)
      if (text && !e.isMeta && !e.command && TYPED.has(e.origin.kind)) {
        const at = await $.clock.now()
        await update($, sent, list => [...list, { at, text } as SentMessage].slice(-300))
      }
    } catch {
      // Nothing to undo.
    }

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const list = await read($, sent)
    const room = Math.max(1, (e.viewport?.rows ?? 24) - 2)

    return (
      <Box flexDirection="column">
        {list.length === 0 && <Text dimColor>아직 보낸 메시지가 없어요. 다음 메시지부터 기록됩니다.</Text>}
        {list
          .slice(-room)
          .reverse()
          .map(m => (
            <Text>
              <Text bold>{kst(m.at)}</Text> <Text dimColor>{m.text}</Text>
            </Text>
          ))}
      </Box>
    )
  })
}
