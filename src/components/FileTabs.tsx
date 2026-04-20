import { File, Star, Trash } from 'lucide-react'
import React from 'react'
import type { File as FileType } from "@/lib/db/schema";
import { Tab, Tabs } from '@heroui/react';
import Badge from './ui/Badge';

interface FileTabProp {
  files: FileType[];
  starredCount: number;
  trashCount: number;
  activeTab: string
  onTabChange: (key:string) => void
}

export default function FileTabs({files, starredCount, trashCount, activeTab, onTabChange}:FileTabProp) {
  return (
     <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(key as string)}
      variant="underlined"
      classNames={{
        base: "w-full overflow-x-auto",
        tabList: "gap-2 sm:gap-4 md:gap-6 flex-nowrap min-w-full",
        tab: "py-3 whitespace-nowrap",
        cursor: "bg-[#006fee]",
      }}
    >
      <Tab
        key="all"
        title={
           <div className={`flex items-center gap-2 sm:gap-3 ${activeTab === 'all' ? 'text-[#006fee] font-semibold' : 'text-gray-500'}`}>
            <File className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">All Files</span>
            <Badge
              variant="flat"
              color="default"
              size="sm"
              aria-label={`${files.filter((file) => !file.isTrash).length} files`}
            >
              {files.filter((file) => !file.isTrash).length}
            </Badge>
          </div>
        }
      />
      <Tab
        key="starred"
        title={
           <div className={`flex items-center gap-2 sm:gap-3 ${activeTab === 'starred' ? 'text-[#006fee] font-semibold' : 'text-gray-500'}`}>
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">Starred</span>
            <Badge
              variant="flat"
              color="warning"
              size="sm"
              aria-label={`${starredCount} starred files`}
            >
              {starredCount}
            </Badge>
          </div>
        }
      />
      <Tab
        key="trash"
        title={
           <div className={`flex items-center gap-2 sm:gap-3 ${activeTab === 'trash' ? 'text-[#006fee] font-semibold' : 'text-gray-500'}`}>
            <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">Trash</span>
            <Badge
              variant="solid"
              color="danger"
              size="sm"
              aria-label={`${trashCount} files in trash`}
            >
              {trashCount}
            </Badge>
          </div>
        }
      />
    </Tabs>
  )
}