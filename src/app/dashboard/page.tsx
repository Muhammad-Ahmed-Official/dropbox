import DashboardContent from '@/components/DashboardContent';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col bg-default-50">
      <main className="flex-1 container mx-auto py-8 px-6">
        <DashboardContent />
      </main>
    </div>
  )
}