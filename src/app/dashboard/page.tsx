// import DashboardContent from '@/components/DashboardContent'
// import Navbar from '@/components/Navbar'
import DashboardContent from '@/components/DashboardContent'
import { CloudUpload } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen flex flex-col bg-default-50">
      {/* <Navbar user={serializedUser} /> */}
      <main className="flex-1 container mx-auto py-8 px-6">
        <DashboardContent />
      </main>

    </div>
  )
}
