import type { NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  let {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body
  const { user } = getInfo(request)

  // Dify requires form inputs on every request. If client sends empty inputs
  // on follow-up messages, fetch the original inputs from the conversation.
  if (conversationId && (!inputs || Object.keys(inputs).length === 0)) {
    try {
      const res = await client.getConversations(user, undefined, 100)
      const conversations = res.data?.data || res.data || []
      const conv = conversations.find((c: any) => c.id === conversationId)
      if (conv?.inputs) { inputs = conv.inputs }
    }
    catch {}
  }

  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
  return new Response(res.data as any)
}
