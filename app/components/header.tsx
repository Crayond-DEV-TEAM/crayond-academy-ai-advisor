import type { FC } from 'react'
import React from 'react'

export interface IHeaderProps {
  title: string
}

const Header: FC<IHeaderProps> = ({ title }) => {
  return (
    <div className="shrink-0">
      <div className="flex items-center justify-center h-14 px-4 bg-gray-950">
        <div className="flex items-center gap-2.5">
          <img
            src="/crayond-icon.svg"
            alt="Crayond Academy"
            className="h-6 w-6"
          />
          <span className="text-sm font-semibold font-display bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
            {title}
          </span>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#665cd7]/40 to-transparent" />
    </div>
  )
}

export default React.memo(Header)
