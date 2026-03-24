import type { Metadata } from 'next'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  title: 'Crayond Academy AI Advisor',
  description: 'Chat with our AI Advisor to find the right program for your career goals. Powered by Crayond Academy.',
  icons: {
    icon: '/crayond-icon.svg',
    shortcut: '/crayond-icon.svg',
    apple: '/crayond-icon.svg',
  },
}

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full bg-gray-950 font-body text-gray-300">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
