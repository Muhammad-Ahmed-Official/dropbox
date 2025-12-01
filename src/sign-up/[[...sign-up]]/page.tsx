import { SignUpForm } from '@/components/SignUpForm'

export default function page() {
  return (
    <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignUpForm />
    </section>
  )
}