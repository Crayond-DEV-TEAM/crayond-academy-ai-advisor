'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IAppUnavailableProps {
  isUnknownReason: boolean
  errMessage?: string
}

const AppUnavailable: FC<IAppUnavailableProps> = ({
  isUnknownReason,
  errMessage,
}) => {
  const { t } = useTranslation()
  let message = errMessage
  if (!errMessage) { message = (isUnknownReason ? t('app.common.appUnkonwError') : t('app.common.appUnavailable')) as string }

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-950'>
      <h1 className='mr-5 h-[50px] leading-[50px] pr-5 text-[24px] font-medium text-gray-300'
        style={{
          borderRight: '1px solid rgba(255,255,255,.1)',
        }}>{(errMessage || isUnknownReason) ? 500 : 404}</h1>
      <div className='text-sm text-gray-500'>{message}</div>
    </div>
  )
}
export default React.memo(AppUnavailable)
