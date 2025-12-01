'use client'

import { Card, CardBody, CardHeader, Tab, Tabs } from '@heroui/react'
import { FileText, FileUp, User } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import FileUploadForm from './FileUploadForm';
import FileList from './FileList';
import UserProfile from './UserProfile';
import { useUserContext } from '@/contextApi/UserProvider';
import { useSearchParams } from 'next/navigation';

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>("files");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  const { currentUser } = useUserContext();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-900">
          Hi,{" "}
          <span className="text-[#006fee]">
            { currentUser?.emailAddress ? currentUser.emailAddress.split("@")[0] : "there"}
          </span>!
        </h2>
        <p className="text-[#D4D4D8] mt-2 text-lg">
          Your images are waiting for you.
        </p>
      </div>

      <Tabs
        aria-label="Dashboard Tabs"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        classNames={{
          tabList: "gap-8",
          tab: "py-4 px-2",
          cursor: "bg-blue-600",
        }}
      >
        <Tab
          key="files"
          title={
            <div className={`flex items-center gap-3 ${activeTab === 'files' ? 'text-[#006fee]' : 'text-gray-500'}`}>
              <FileText className="h-5 w-5" />
              <span className="font-semibold">My Files</span>
            </div>
          }
        >
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-default-200 bg-default-50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex gap-3">
                  <FileUp className="h-5 w-5 text-[#006fee]" />
                  <h2 className="text-xl font-semibold">Upload</h2>
                </CardHeader>
                <CardBody>
                  <FileUploadForm
                    userId={currentUser?.id}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border border-default-200 bg-default-50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex gap-3">
                  <FileText className="h-5 w-5 text-[#006fee]" />
                  <h2 className="text-xl font-semibold">Your Files</h2>
                </CardHeader>
                <CardBody>
                  <FileList
                    userId={currentUser?.id}
                    refreshTrigger={refreshTrigger}
                    onFolderChange={handleFolderChange}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </div>
          }
        >
          <div className="mt-8">
            <UserProfile />
          </div>
        </Tab>
      </Tabs>
    </>
  )
}