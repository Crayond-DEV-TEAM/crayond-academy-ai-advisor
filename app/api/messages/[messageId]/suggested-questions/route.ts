import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest, { params }: { params: Promise<{ messageId: string }> }) {
  const { sessionId, user } = getInfo(request)
  const { messageId } = await params
  try {
    const response: any = await client.sendRequest('GET', `messages/${messageId}/suggested`, null, { user })
    const data = response?.data || []
    return NextResponse.json({ data }, {
      headers: setSession(sessionId),
    })
  }
  catch {
    return NextResponse.json({ data: [] }, {
      headers: setSession(sessionId),
    })
  }
}
