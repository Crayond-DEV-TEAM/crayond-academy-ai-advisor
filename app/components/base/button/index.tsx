import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export interface IButtonProps {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
}) => {
  let style = 'cursor-pointer'
  switch (type) {
    case 'link':
      style = disabled ? 'border border-white/[0.06] bg-white/[0.02] cursor-not-allowed text-gray-500' : 'border border-white/[0.08] cursor-pointer text-[#a89df0] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.12]'
      break
    case 'primary':
      style = (disabled || loading) ? 'bg-[#665cd7]/50 cursor-not-allowed text-white/70' : 'bg-[#665cd7] hover:bg-[#5a51c4] cursor-pointer text-white shadow-lg shadow-[#665cd7]/25'
      break
    default:
      style = disabled ? 'border border-white/[0.06] bg-white/[0.02] cursor-not-allowed text-gray-500' : 'border border-white/[0.08] cursor-pointer text-gray-400 bg-white/[0.04] hover:bg-white/[0.06] hover:text-white'
      break
  }

  return (
    <div
      className={`flex justify-center items-center content-center h-9 leading-5 rounded-lg px-4 py-2 text-base transition-colors ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </div>
  )
}

export default React.memo(Button)
