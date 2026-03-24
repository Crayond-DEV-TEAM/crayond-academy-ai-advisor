'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import ImageGallery from '../../base/image-gallery'
import Thought from '../thought'

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  // Strip model artifacts from displayed text:
  // - <think>...</think> reasoning tags (model thinking out loud)
  // - <call:...> raw tool call syntax leaked by Dify agent
  // - UUID mapping objects leaked into content
  const sanitizeContent = (text: string) => {
    return text
      .replace(/<think>[\s\S]*?<\/think>/g, '') // completed <think>...</think> blocks
      .replace(/<think>[\s\S]*/g, '') // unclosed <think> (still streaming thinking)
      .replace(/<call:[^>]*?\/?>/g, '') // <call:...> or <call:.../>
      .replace(/\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\s*:\s*"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"\s*\}/g, '') // UUID mapping objects
      .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
      .trim()
  }

  // Check if text contains an active (unclosed) <think> tag — model is still reasoning
  const isThinking = (text: string) => {
    const openCount = (text.match(/<think>/g) || []).length
    const closeCount = (text.match(/<\/think>/g) || []).length
    return openCount > closeCount
  }

  const { t } = useTranslation()

  const renderFeedbackRating = (rating: MessageRating | undefined) => {
    if (!rating) { return null }

    const isLike = rating === 'like'
    const ratingIconClassname = isLike ? 'text-[#665cd7] bg-[#665cd7]/20' : 'text-red-400 bg-red-400/20'
    return (
      <Tooltip
        selector={`user-feedback-${randomString(16)}`}
        content={isLike ? 'Remove like' : 'Remove dislike'}
      >
        <div
          className="relative flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white/[0.04] cursor-pointer text-gray-500 hover:text-gray-300 border border-white/[0.06]"
          onClick={async () => {
            await onFeedback?.(id, { rating: null })
          }}
        >
          <div className={`${ratingIconClassname} rounded-lg h-6 w-6 flex items-center justify-center`}>
            <RatingIcon isLike={isLike} />
          </div>
        </div>
      </Tooltip>
    )
  }

  const renderItemOperation = () => {
    const userOperation = () => {
      return feedback?.rating
        ? null
        : (
          <div className="flex gap-1">
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
              <div
                className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.06] cursor-pointer text-gray-500 hover:text-[#665cd7] hover:bg-[#665cd7]/10 transition-colors"
                onClick={() => onFeedback?.(id, { rating: 'like' })}
              >
                <RatingIcon isLike={true} />
              </div>
            </Tooltip>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
              <div
                className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.06] cursor-pointer text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                onClick={() => onFeedback?.(id, { rating: 'dislike' })}
              >
                <RatingIcon isLike={false} />
              </div>
            </Tooltip>
          </div>
        )
    }

    return (
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {userOperation()}
      </div>
    )
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (isThinking(item.thought)
            ? (
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a89df0] animate-pulse-dot" />
                <span className="text-xs">Thinking...</span>
              </div>
            )
            : sanitizeContent(item.thought) && (
              <StreamdownMarkdown content={sanitizeContent(item.thought)} />
            )
          )}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id} className="group">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 shrink-0 rounded-2xl bg-[#665cd7]/15 flex items-center justify-center shadow-[0_0_20px_rgba(102,92,215,0.2)]">
          <img src="/crayond-icon.svg" alt="Crayond" className="w-5 h-5" />
        </div>
        <div className="max-w-[calc(100%-3rem)] min-w-0">
          <div className="relative text-sm text-gray-300">
            <div className={`py-3 px-4 bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm ${workflowProcess && 'min-w-[320px]'}`}>
              {workflowProcess && (
                <WorkflowProcess data={workflowProcess} hideInfo />
              )}
              {(() => {
                const sanitizedContent = content ? sanitizeContent(content) : ''
                const contentIsThinking = content ? isThinking(content) : false
                const hasNoVisibleContent = isAgentMode
                  ? (!sanitizedContent && (agent_thoughts || []).filter(item => (item.thought && sanitizeContent(item.thought)) || !!item.tool).length === 0)
                  : !sanitizedContent

                if (isResponding && (hasNoVisibleContent || contentIsThinking)) {
                  return (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a89df0] animate-pulse-dot" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  )
                }
                if (isAgentMode) { return agentModeAnswer }
                return sanitizedContent ? <StreamdownMarkdown content={sanitizedContent} /> : null
              })()}
              {suggestedQuestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex gap-1.5 flex-wrap">
                    {suggestedQuestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-[#665cd7]/10 border border-[#665cd7]/20 text-[#a89df0] text-xs font-medium hover:bg-[#665cd7]/20 transition-colors cursor-pointer"
                        onClick={() => suggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {!isResponding && (
              <div className="mt-1 flex flex-row justify-start gap-1">
                {!feedbackDisabled && !item.feedbackDisabled && renderItemOperation()}
                {!feedbackDisabled && renderFeedbackRating(feedback?.rating)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Answer)
