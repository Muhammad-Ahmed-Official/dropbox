import SignInForm from '@/components/SignInForm'
import React from 'react'

export default function page() {
  return (
    <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignInForm />
    </section>

  )
}
