'use client'
import classNames from 'classnames'
import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import { createContext, useContext } from 'use-context-selector'

export interface IToastProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  message: string
  children?: ReactNode
  onClose?: () => void
}
interface IToastContext {
  notify: (props: IToastProps) => void
}
const defaultDuring = 3000

export const ToastContext = createContext<IToastContext>({} as IToastContext)
export const useToastContext = () => useContext(ToastContext)

const Toast = ({
  type = 'info',
  duration,
  message,
  children,
}: IToastProps) => {
  // sometimes message is react node array. Not handle it.
  if (typeof message !== 'string') { return null }

  return <div className={classNames(
    'fixed rounded-xl p-4 my-4 mx-4 z-50 shadow-xl shadow-black/30 border backdrop-blur-sm',
    'top-0',
    'right-0',
    type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : '',
    type === 'error' ? 'bg-red-500/10 border-red-500/20' : '',
    type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : '',
    type === 'info' ? 'bg-[#665cd7]/10 border-[#665cd7]/20' : '',
  )}>
    <div className="flex">
      <div className="flex-shrink-0">
        {type === 'success' && <CheckCircleIcon className="w-5 h-5 text-emerald-400" aria-hidden="true" />}
        {type === 'error' && <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />}
        {type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />}
        {type === 'info' && <InformationCircleIcon className="w-5 h-5 text-[#a89df0]" aria-hidden="true" />}
      </div>
      <div className="ml-3">
        <h3 className={
          classNames(
            'text-sm font-medium',
            type === 'success' ? 'text-emerald-300' : '',
            type === 'error' ? 'text-red-300' : '',
            type === 'warning' ? 'text-yellow-300' : '',
            type === 'info' ? 'text-[#a89df0]' : '',
          )
        }>{message}</h3>
        {children && <div className={
          classNames(
            'mt-2 text-sm',
            type === 'success' ? 'text-emerald-400' : '',
            type === 'error' ? 'text-red-400' : '',
            type === 'warning' ? 'text-yellow-400' : '',
            type === 'info' ? 'text-gray-400' : '',
          )
        }>
          {children}
        </div>
        }
      </div>
    </div>
  </div>
}

export const ToastProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const placeholder: IToastProps = {
    type: 'info',
    message: 'Toast message',
    duration: 3000,
  }
  const [params, setParams] = React.useState<IToastProps>(placeholder)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        setMounted(false)
      }, params.duration || defaultDuring)
    }
  }, [mounted])

  return <ToastContext.Provider value={{
    notify: (props) => {
      setMounted(true)
      setParams(props)
    },
  }}>
    {mounted && <Toast {...params} />}
    {children}
  </ToastContext.Provider>
}

Toast.notify = ({
  type,
  message,
  duration,
}: Pick<IToastProps, 'type' | 'message' | 'duration'>) => {
  if (typeof window === 'object') {
    const holder = document.createElement('div')
    const root = createRoot(holder)

    root.render(<Toast type={type} message={message} duration={duration} />)
    document.body.appendChild(holder)
    setTimeout(() => {
      if (holder) { holder.remove() }
    }, duration || defaultDuring)
  }
}

export default Toast
