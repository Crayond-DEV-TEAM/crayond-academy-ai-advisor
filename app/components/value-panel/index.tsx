'use client'
import type { FC, ReactNode } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

export interface ITemplateVarPanelProps {
  className?: string
  header: ReactNode
  children?: ReactNode | null
  isFold: boolean
}

const TemplateVarPanel: FC<ITemplateVarPanelProps> = ({
  className,
  header,
  children,
  isFold,
}) => {
  return (
    <div className={cn(
      isFold ? 'border border-white/[0.06]' : 'border border-white/[0.08] shadow-xl shadow-black/20',
      className,
      'rounded-2xl bg-white/[0.02]',
    )}>
      {/* header */}
      <div
        className={cn(isFold && 'rounded-b-2xl', 'rounded-t-2xl px-5 py-4 text-xs')}
      >
        {header}
      </div>
      {/* body */}
      {!isFold && children && (
        <div className='rounded-b-2xl px-5 pb-5'>
          {children}
        </div>
      )}
    </div>
  )
}

export const PanelTitle: FC<{ title: string, className?: string }> = ({
  title,
  className,
}) => {
  return (
    <div className={cn(className, 'flex items-center space-x-1.5 text-[#a89df0]')}>
      <div className="w-1.5 h-1.5 rounded-full bg-[#665cd7]" />
      <span className='text-xs font-medium'>{title}</span>
    </div>
  )
}

export const VarOpBtnGroup: FC<{ className?: string, onConfirm: () => void, onCancel: () => void }> = ({
  className,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation()

  return (
    <div className={cn(className, 'flex mt-4 space-x-2 text-sm')}>
      <button
        type="button"
        className='px-4 py-2 rounded-lg bg-[#665cd7] text-white text-sm font-medium hover:bg-[#5a51c4] transition-colors'
        onClick={onConfirm}
      >
        {t('common.operation.save')}
      </button>
      <button
        type="button"
        className='px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 text-sm hover:text-white hover:bg-white/[0.06] transition-colors'
        onClick={onCancel}
      >
        {t('common.operation.cancel')}
      </button>
    </div >
  )
}

export default React.memo(TemplateVarPanel)
