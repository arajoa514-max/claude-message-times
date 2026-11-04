export type SentMessage = { at: number; text: string }

declare module 'claude-code' {
  interface PluginState {
    'message-times': { sent: Shaped<SentMessage[]> }
  }
}
