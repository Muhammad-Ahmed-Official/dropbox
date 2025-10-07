import { Card, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@heroui/react';
import { ExternalLink, Folder, Star } from 'lucide-react';
import React from 'react'
import FileActions from './FileActions';
import FileTabs from './FileTabs';
import FolderNavigation from './FolderNavigation';
import FileActionButtons from './FileActionButtons';
import FileEmptyState from './FileEmptyState';
import FileLoadingState from './FileLoadingState';
import FileIcon from './FileIcon';

export default function FileList() {
//   if (loading) {
    // return <FileLoadingState />;
//   }
  return (
    <div className="space-y-6">
      {/* Tabs for filtering files */}
      <FileTabs
        // activeTab={activeTab}
        // onTabChange={setActiveTab}
        // files={files}
        // starredCount={starredCount}
        // trashCount={trashCount}
      />

      {/* Folder navigation */}
      {/* {activeTab === "all" && ( */}
        <FolderNavigation
        //   folderPath={folderPath}
        //   navigateUp={navigateUp}
        //   navigateToPathFolder={navigateToPathFolder}
        />
      {/* )} */}

      {/* Action buttons */}
      <FileActionButtons
        // activeTab={activeTab}
        // trashCount={trashCount}
        // folderPath={folderPath}
        // onRefresh={fetchFiles}
        // onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      <Divider className="my-4" />

      {/* Files table */}
      {/* {filteredFiles.length === 0 ? ( */}
        <FileEmptyState  />
        {/* FileEmptyState */}
      {/* ) : ( */}
        <Card
          shadow="sm"
          className="border border-default-200 bg-default-50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table
              aria-label="Files table"
              isStriped
              color="default"
              selectionMode="none"
              classNames={{
                base: "min-w-full",
                th: "bg-default-100 text-default-800 font-medium text-sm",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn className="hidden sm:table-cell">Type</TableColumn>
                <TableColumn className="hidden md:table-cell">Size</TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Added
                </TableColumn>
                <TableColumn width={240}>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {/* {filteredFiles.map((file) => ( */}
                  <TableRow
                    // key={file.id}
                    // className={`hover:bg-default-100 transition-colors ${
                    //   file.isFolder || file.type.startsWith("image/")
                    //     ? "cursor-pointer"
                    //     : ""
                    // }`}
                    // onClick={() => handleItemClick(file)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileIcon />
                        <div>
                          <div className="font-medium flex items-center gap-2 text-default-800">
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {/* {file.name} */}
                            </span>
                            {/* {file.isStarred && (
                              <Tooltip content="Starred">
                                <Star
                                  className="h-4 w-4 text-yellow-400"
                                  fill="currentColor"
                                />
                              </Tooltip>
                            )} */}
                            {/* {file.isFolder && (
                              <Tooltip content="Folder">
                                <Folder className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )}
                            {file.type.startsWith("image/") && (
                              <Tooltip content="Click to view image">
                                <ExternalLink className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )} */}
                          </div>
                          <div className="text-xs text-default-500 sm:hidden">
                            {/* {formatDistanceToNow(new Date(file.createdAt), {
                              addSuffix: true,
                            })} */}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-xs text-default-500">
                        {/* {file.isFolder ? "Folder" : file.type} */}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-default-700">
                        {/* {file.isFolder
                          ? "-"
                          : file.size < 1024
                            ? `${file.size} B`
                            : file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`} */}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-default-700">
                          {/* {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })} */}
                        </div>
                        <div className="text-xs text-default-500 mt-1">
                          {/* {format(new Date(file.createdAt), "MMMM d, yyyy")} */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell 
                    onClick={(e) => e.stopPropagation()}>
                      <FileActions
                        // file={file}
                        // onStar={handleStarFile}
                        // onTrash={handleTrashFile}
                        // onDelete={(file) => {
                        //   setSelectedFile(file);
                        //   setDeleteModalOpen(true);
                        // }}
                        // onDownload={handleDownloadFile}
                      />
                    </TableCell>
                  </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </div>
        </Card>
      {/* )} */}

    </div>
  )
}
