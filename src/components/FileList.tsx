import { Card, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@heroui/react';
import { ExternalLink, Folder, Star, Trash, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import FileActions from './FileActions';
import FileTabs from './FileTabs';
import FolderNavigation from './FolderNavigation';
import FileActionButtons from './FileActionButtons';
import FileEmptyState from './FileEmptyState';
import FileLoadingState from './FileLoadingState';
import FileIcon from './FileIcon';
import { asyncHandlerFront } from '@/utils/AsyncHandlerFront';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import type { File as FileType } from "@/lib/db/schema";
import { formatDistanceToNow, format } from "date-fns";
import ConfirmationModal from './ui/ConfirmationModal';

interface FilePropList {
  userId: any;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({userId, refreshTrigger=0, onFolderChange} : FilePropList) {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [folderPath, setFolderPath] = useState<Array<{id: string; name: string}>>([])

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    await asyncHandlerFront(
      async() => {
        const params: any = { userId };
        if (currentFolder) {
          params.parentId = currentFolder;
        }

        const response: any = await apiClient.getFiles(params);
        setFiles(response?.data)
      },
      (error) => {
        toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
    setLoading(false);
  };

  useEffect(() => {
    userId && fetchFiles();
  }, [userId, currentFolder, refreshTrigger])

  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case 'starred':
        return files.filter((file) =>  file.isStarred && !file.isTrash);
      
      case 'trash':
        return files.filter((file) => file.isTrash);
    
      default:
        return files.filter((file) => !file.isTrash)
    }
  }, [files, activeTab])


  const starredCount = useMemo(() => {
    return files.filter((file) => file?.isStarred && !file.isTrash).length
  }, [files])

  const trashCount = useMemo(() => {
    return files.filter((file) => file?.isTrash).length
  }, [files])

  const handleDownloadFile = async(file:FileType) => {
    await asyncHandlerFront(
      async() => {
        toast.loading("Downloading...");
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file.name; 
        document.body.appendChild(a);
        a.click();
        // cleanup
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.dismiss(); 

        toast.success("Download Completed!", {
          style: {
            background: "#f0fdf4",    
            color: "#166534",          
            borderRadius: "10px",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontWeight: "500"
          }
        });
      },
      (error) => {
        toast.dismiss();
        toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
  }

  const handleTrashFile = async(fileId: string) => {
    await asyncHandlerFront(
      async() => {
        const responseData:any = await apiClient.trashFile(fileId);
        setFiles(files.map((file) => file.id === fileId ? {...file, isTrash: !file.isTrash} : file))
        toast.success(responseData.data.isTrash ? "Moved to Trash" : "Restored from Trash", {
          style: {
            background: "#f0fdf4",    
            color: "#166534",          
            borderRadius: "10px",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontWeight: "500"
          }
        });
      },
      (error) => {
        toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
  }

  const handleStarFile = async(fileId:string) => {
    await asyncHandlerFront(
      async() => {
        await apiClient.starFiles(fileId);
        setFiles(files.map((file) => file?.id === fileId  ? {...file, isStarred: !file.isStarred} : file))
      },
      (error) => {
        toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
  }

  const handleDeleteFile = async(fileId:string) => {
    await asyncHandlerFront(
      async() => {
        await apiClient.delFiles(fileId);
        setFiles(files.filter((file) => file?.id !== fileId));
      },
      (error) => {
        toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
    setDeleteModalOpen(false);
  }

  const handleEmptyTrash = async() => {
    await asyncHandlerFront(
      async() => {
        await apiClient.emptyTrash()
        setFiles(files.filter((file) => !file.isTrash))
        toast.success("Folder created successfully", {
        style: {
            background: "#f0fdf4",    
            color: "#166534",          
            borderRadius: "10px",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontWeight: "500"
          }
        });
      },
      (error) => {
         toast.error(error?.message || "Something went wrong", {
          style: {
            background: "#fee2e2", 
            color: "#b91c1c",        
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });
      }
    )
  }

  const handleItemClick = (file:FileType) => {
    if(file.isFolder){
      navigateToFolder(file?.id, file?.name)
    } else if(file.type.startsWith("image/")) {
      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file?.path}`;
      window.open(optimizedUrl, "_blank")
    }
  }

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);

    // Notify parent component about folder change
    if (onFolderChange) {
      onFolderChange(folderId);
    }
  } 

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(null);
      }
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      setCurrentFolder(newFolderId);

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      const newFolderId =
        newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolder(newFolderId);

      // Notify parent component about folder change
      if (onFolderChange) {
        onFolderChange(newFolderId);
      }
    }
  }
  

  if (loading) {
    return <FileLoadingState />;
  };

  return (
    <div className="space-y-4">
      {/* Tabs for filtering files */}
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      {/* Folder navigation */}
      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      {/* Action buttons */}
      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      <Divider className="my-4" />

      {/* Files table */}
      {filteredFiles?.length === 0 ? (
        <FileEmptyState  />
       ) : ( 
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
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className={`hover:bg-default-100 transition-colors ${
                      file.isFolder || file.type.startsWith("image/")
                        ? "cursor-pointer"
                        : ""
                    }`}
                    onClick={() => handleItemClick(file)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileIcon file={file} />
                        <div>
                          <div className="font-medium flex items-center gap-2 text-default-800">
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {file.name}
                            </span>
                            {file.isStarred && (
                              <Tooltip content="Starred">
                                <Star
                                  className="h-4 w-4 text-yellow-400"
                                  fill="currentColor"
                                />
                              </Tooltip>
                            )}
                            {file.isFolder && (
                              <Tooltip content="Folder">
                                <Folder className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )}
                            {file.type.startsWith("image/") && (
                              <Tooltip content="Click to view image">
                                <ExternalLink className="h-3 w-3 text-default-400" />
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-xs text-default-500 sm:hidden">
                            {formatDistanceToNow(new Date(file.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-xs text-default-500">
                        {file.isFolder ? "Folder" : file.type}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-default-700">
                        {file.isFolder
                          ? "-"
                          : file.size < 1024
                            ? `${file.size} B`
                            : file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-default-700">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="text-xs text-default-500 mt-1">
                          {format(new Date(file.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell 
                    onClick={(e) => e.stopPropagation()}>
                      <FileActions
                        file={file}
                        onStar={handleStarFile}
                        onTrash={handleTrashFile}
                        onDelete={(file) => {
                          setSelectedFile(file);
                          setDeleteModalOpen(true);
                        }}
                        onDownload={handleDownloadFile}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description={`Are you sure you want to permanently delete this file?`}
        icon={X}
        iconColor="text-danger"
        confirmText="Delete Permanently"
        confirmColor="danger"
        onConfirm={() => {
          if (selectedFile) {
            handleDeleteFile(selectedFile.id);
          }
        }}
        isDangerous={true}
        warningMessage={`You are about to permanently delete "${selectedFile?.name}". This file will be permanently removed from your account and cannot be recovered.`}
      />

      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description={`Are you sure you want to empty the trash?`}
        icon={Trash}
        iconColor="text-danger"
        confirmText="Empty Trash"
        confirmColor="danger"
        onConfirm={handleEmptyTrash}
        isDangerous={true}
        warningMessage={`You are about to permanently delete all ${trashCount} items in your trash. These files will be permanently removed from your account and cannot be recovered.`}
      />

    </div>
  )
}
