'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
  docFiles?: any[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs, docFiles }) => {
  return (
    <div className='flex items-start justify-end' key={id}>
      <div className='max-w-[85%]'>
        <div className='relative text-sm'>
          <div className='ml-2 py-3 px-4 bg-[#665cd7]/20 border border-[#665cd7]/20 rounded-2xl rounded-tr-sm text-white'>
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            {docFiles && docFiles.length > 0 && (
              <div className='mb-2 flex flex-col gap-1.5'>
                {docFiles.map((file: any, i: number) => (
                  <div key={i} className='flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.08] border border-white/[0.1]'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#a89df0]">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className='text-xs text-gray-300 truncate'>{file.name || file.filename || 'Attachment'}</span>
                  </div>
                ))}
              </div>
            )}
            <StreamdownMarkdown content={content} />
          </div>
        </div>
      </div>
      <div className='w-8 h-8 shrink-0 ml-2 rounded-full bg-[#665cd7]/30 flex items-center justify-center'>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#a89df0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

export default React.memo(Question)
