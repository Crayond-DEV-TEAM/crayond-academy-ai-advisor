'use client'
import type { FC } from 'react'
import React from 'react'
import type { ToolInfoInThought } from '../type'
import type { Emoji } from '@/types/tools'

interface Props {
  payload: ToolInfoInThought
  allToolIcons?: Record<string, string | Emoji>
}

const TOOL_LABELS: Record<string, string> = {
  get_profile: 'Checking our previous discussions...',
  save_profile: 'Saving our discussion...',
  current_time: 'Checking latest info...',
}

function getToolLabel(toolName: string): string {
  if (toolName.startsWith('dataset-')) { return 'Searching program details...' }
  return TOOL_LABELS[toolName] || 'Working on it...'
}

const Tool: FC<Props> = ({ payload }) => {
  const { name, isFinished } = payload
  const label = getToolLabel(name)

  if (isFinished) { return null }

  return (
    <div className="flex items-center gap-1.5 py-1 text-[#a89df0]">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a89df0] animate-pulse-dot" />
      <span className="text-xs">{label}</span>
    </div>
  )
}

export default React.memo(Tool)
