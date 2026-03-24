'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import type { AppInfo } from '@/types/app'

export const AppInfoComp: FC<{ siteInfo: AppInfo }> = ({ siteInfo }) => {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-3">
        <div className="absolute inset-0 bg-[#665cd7]/25 blur-xl rounded-full" />
        <div className="relative w-11 h-11 rounded-xl bg-[#665cd7]/15 border border-[#665cd7]/30 flex items-center justify-center shadow-[0_0_20px_rgba(102,92,215,0.25)]">
          <img src="/crayond-icon.svg" alt="Crayond" className="w-6 h-6" />
        </div>
      </div>
      <h2 className="text-lg font-bold font-display mb-1">
        <span className="bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">Crayond Academy </span>
        <span className="bg-gradient-to-b from-[#a89df0] via-[#7b6fe0] to-[#5248c8] bg-clip-text text-transparent">AI Advisor</span>
      </h2>
      {siteInfo.description && (
        <p className="text-xs text-gray-500 max-w-xs mx-auto">{siteInfo.description}</p>
      )}
      <div className="mt-3 w-10 h-px bg-gradient-to-r from-transparent via-[#665cd7]/40 to-transparent mx-auto" />
    </div>
  )
}

export const PromptTemplate: FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className="text-sm text-gray-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const ChatBtn: FC<{ onClick: () => void, className?: string }> = ({
  className,
  onClick,
}) => {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      className={cn(
        'w-full py-3.5 rounded-xl bg-[#665cd7] text-white font-bold text-sm tracking-wide',
        'hover:bg-[#5a51c4] active:scale-[0.99] transition',
        'shadow-lg shadow-[#665cd7]/25',
        'flex items-center justify-center gap-2',
        className,
      )}
      onClick={onClick}
    >
      <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 10.5C18 14.366 14.418 17.5 10 17.5C8.58005 17.506 7.17955 17.1698 5.917 16.52L2 17.5L3.338 14.377C2.493 13.267 2 11.934 2 10.5C2 6.634 5.582 3.5 10 3.5C14.418 3.5 18 6.634 18 10.5ZM7 9.5H5V11.5H7V9.5ZM15 9.5H13V11.5H15V9.5ZM9 9.5H11V11.5H9V9.5Z" fill="white" />
      </svg>
      {t('app.chat.startChat')}
    </button>
  )
}

export const EditBtn = ({ className, onClick }: { className?: string, onClick: () => void }) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn('px-2 flex space-x-1 items-center rounded-md cursor-pointer text-[#a89df0] hover:text-white transition-colors', className)}
      onClick={onClick}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" />
      </svg>
      <span className="text-xs">{t('common.operation.edit')}</span>
    </div>
  )
}
