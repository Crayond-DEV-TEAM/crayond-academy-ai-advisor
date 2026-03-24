import React from 'react'

import './style.css'

interface ILoadingProps {
  type?: 'area' | 'app'
}
const Loading = (
  { type = 'area' }: ILoadingProps = { type: 'area' },
) => {
  return (
    <div className={`flex w-full justify-center items-center ${type === 'app' ? 'h-full' : ''}`}>
      <div className='crayond-loader'>
        <div className='crayond-loader-glow' />
        <img src="/crayond-icon.svg" alt="" className='crayond-loader-icon' />
        <span className='crayond-loader-text'>
          <span className='crayond-loader-text-brand'>Crayond Academy</span>
        </span>
      </div>
    </div>
  )
}

export default Loading
