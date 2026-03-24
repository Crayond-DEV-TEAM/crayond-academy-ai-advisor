'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { fileUpload, getProcessedFiles, isAllowedFileExtension } from '@/app/components/base/file-uploader-in-attachment/utils'
import { v4 as uuid4 } from 'uuid'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  onStop?: () => void
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  onStop,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (!fileConfig?.enabled || attachmentFiles.length > 0) { return }

    const file = e.dataTransfer.files[0]
    if (!file) { return }

    const allowedTypes = ['document'] as string[]
    const allowedExts = ['.pdf', '.doc', '.docx', '.txt', '.md']
    if (!isAllowedFileExtension(file.name, file.type, allowedTypes, allowedExts)) {
      notify({ type: 'error', message: 'Only PDF, DOC, DOCX, TXT, MD files are supported' })
      return
    }

    const uploadingFile: FileEntity = {
      id: uuid4(),
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0,
      transferMethod: TransferMethod.local_file,
      supportFileType: 'document',
      originalFile: file,
    }
    setAttachmentFiles([uploadingFile])

    fileUpload({
      file,
      onProgressCallback: (progress) => {
        setAttachmentFiles([{ ...uploadingFile, progress }])
      },
      onSuccessCallback: (res) => {
        setAttachmentFiles([{ ...uploadingFile, uploadedId: res.id, progress: 100 }])
      },
      onErrorCallback: () => {
        notify({ type: 'error', message: 'Upload failed' })
        setAttachmentFiles([{ ...uploadingFile, progress: -1 }])
      },
    })
  }

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className='h-full'>
      {/* Chat List */}
      <div className="h-full space-y-5">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isResponding={isResponding && isLast}
              suggestionClick={suggestionClick}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files || []).filter((f: any) => f.type === 'image').map((f: any) => f.url)}
              docFiles={(item.message_files || []).filter((f: any) => f.type !== 'image')}
            />
          )
        })}
      </div>
      {
        !isHideSendInput && (
          <div className='fixed z-10 bottom-0 left-0 right-0 px-3 pb-3 flex justify-center'>
            <div
              className='max-w-xl w-full'
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); if (fileConfig?.enabled) { setIsDragging(true) } }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
              onDrop={handleDropFile}
            >
              {/* Drag overlay */}
              {isDragging && fileConfig?.enabled && (
                <div className='mb-2 flex items-center justify-center py-6 rounded-xl border-2 border-dashed border-[#665cd7]/50 bg-[#665cd7]/10'>
                  <span className='text-sm text-[#a89df0]'>Drop your file here</span>
                </div>
              )}
              {/* Attached file preview — above input */}
              {fileConfig?.enabled && attachmentFiles.length > 0 && !isDragging && (
                <div className='mb-2'>
                  {attachmentFiles.map(file => (
                    <div key={file.id} className='flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04]'>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#a89df0]">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className='text-xs text-gray-300 truncate flex-1'>{file.name}</span>
                      <button
                        type="button"
                        className='w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0'
                        onClick={() => setAttachmentFiles([])}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Input area */}
              <div className='bg-gray-900/80 backdrop-blur-lg border border-white/[0.08] rounded-xl'>
                <div className='flex items-end gap-1 p-1.5'>
                  {/* File upload — paperclip with Dify uploader overlay */}
                  {fileConfig?.enabled && (
                    <div className='relative shrink-0 mb-0.5'>
                      <button
                        type="button"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          attachmentFiles.length > 0
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-white/[0.08] hover:text-[#a89df0] cursor-pointer'
                        }`}
                        disabled={attachmentFiles.length > 0}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {/* Invisible Dify file input on top — handles actual upload to Dify API */}
                      {attachmentFiles.length === 0 && (
                        <div className='absolute inset-0 overflow-hidden opacity-0 cursor-pointer'>
                          <FileUploaderInAttachmentWrapper
                            fileConfig={{
                              ...fileConfig,
                              allowed_file_types: ['document'] as any,
                              allowed_file_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md'],
                              number_limits: 1,
                            }}
                            value={attachmentFiles}
                            onChange={setAttachmentFiles}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {/* Text input */}
                  <div className='flex-1 min-w-0'>
                    <Textarea
                      className='block w-full px-2.5 py-2 leading-5 max-h-[120px] text-sm text-white placeholder-gray-500 outline-none appearance-none resize-none bg-transparent'
                      placeholder="Chat with our Crayond Academy AI Advisor..."
                      value={query}
                      onChange={handleContentChange}
                      onKeyUp={handleKeyUp}
                      onKeyDown={handleKeyDown}
                      autoSize
                    />
                  </div>
                  {/* Send / Stop button */}
                  <div className='shrink-0 mb-0.5'>
                    {isResponding
                      ? (
                        <Tooltip
                          selector='stop-tip'
                          htmlContent={<div className="text-xs">Stop generating</div>}
                        >
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-colors"
                            onClick={onStop}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect x="6" y="6" width="12" height="12" rx="2" fill="#ef4444"/>
                            </svg>
                          </button>
                        </Tooltip>
                      )
                      : (
                        <Tooltip
                          selector='send-tip'
                          htmlContent={
                            <div className="text-xs">
                              <div>{t('common.operation.send')} Enter</div>
                              <div>{t('common.operation.lineBreak')} Shift Enter</div>
                            </div>
                          }
                        >
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#665cd7] hover:bg-[#5a51c4] flex items-center justify-center transition-colors"
                            onClick={handleSend}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </Tooltip>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
