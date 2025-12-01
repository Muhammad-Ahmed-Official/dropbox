import { apiClient } from '@/lib/api-client'
import { asyncHandlerFront } from '@/utils/AsyncHandlerFront'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@heroui/react'
import { AlertTriangle, ArrowRight, FileUp, FolderPlus, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface FileUploadFormProps {
  userId: any,
  currentFolder: string | null,
  onUploadSuccess: () => void
}

export default function FileUploadForm({userId, currentFolder = null, onUploadSuccess} : FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      const selectedFile = e.target.files[0];
      if(selectedFile?.size > 5 * 1014 * 1024){
        setError("File size exceed 5MB limit");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e:React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();

    if(e.dataTransfer?.files && e.dataTransfer?.files[0]){
      const selectedFile = e.dataTransfer?.files[0];
      if(selectedFile?.size > 5 * 1014 * 1024){
        setError("File size exceed 5MB limit");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e:React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if(fileInputRef.current){
      fileInputRef.current.value = ""
    }
  };

  const handleUpload = async() => {
    if(!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if(currentFolder) formData.append("parentId", currentFolder);
    setUploading(true);
    setError(null);

    await asyncHandlerFront(
      async() => {
        await apiClient.uploadFile(formData);
         toast.success("File upload successfully", {
          style: {
            background: "#f0fdf4",    
            color: "#166534",          
            borderRadius: "10px",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontWeight: "500"
          }
        });

        clearFile();

        if(onUploadSuccess){
          onUploadSuccess()
        };
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
    );
    setUploading(false);
  };
  
  const [folderName, setFolderName] = useState<string>('');3
  const [folderModalOpen, setFolderModalOpen] = useState<boolean>(false);
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleCreateFolder = async () => {
    if(!folderName.trim()){
      toast.error("Please enter a valid folder name.", {
        style: {
          background: "#fee2e2", 
          color: "#b91c1c",        
          border: "1px solid #fecaca",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });
      return;
    }
    setCreatingFolder(true)

    await asyncHandlerFront(
      async() => {
        await apiClient.createFolder({
          name: folderName.trim(),
          userId,
          parentId: currentFolder, 
        });
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
        setFolderName("");
        setFolderModalOpen(false);

        if(onUploadSuccess){
          onUploadSuccess()
        };
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
    );
    setCreatingFolder(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button variant="flat" startContent={<FolderPlus className="h-4 w-4" />} className="text-[#006fee] bg-[#132946] flex-1"
          onClick={() => setFolderModalOpen(true)} >
          New Folder
        </Button>
        <Button variant="flat" startContent={<FileUp className="h-4 w-4" />} className="text-[#006fee] bg-[#132946] flex-1"
          onClick={() => fileInputRef.current?.click()} >
          Add Image
        </Button>
      </div>
        
      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? "border-danger/30 bg-danger/5"
            : file
              ? "border-[#103662] bg-[#171d26]"
              : "border-default-300 hover:border-primary/5"
        }`}
      >
        {!file ? (
          <div className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-[#006fee]" />
            <div>
              <p className="text-default-600"> Drag and drop your image here, or{" "}
                <button type="button" className="text-[#006fee] cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                  onClick={() => fileInputRef.current?.click()} >
                  browse
                </button>
              </p>
              <p className="text-xs text-default-500 mt-1">Images up to 5MB</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
         ) : 
         (
          <div className="space-y-3">
            <div className="items-center justify-between space-y-2">
              <div className="flex items-center justify-between">
                <div className='flex space-x-3'>
                  <div className="p-2 bg-primary/10 rounded-md"> <FileUp className="h-5 w-5 text-[#006fee]" /> </div>
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[180px]"> {file.name} </p>
                    <p className="text-xs text-default-500">
                      {file.size < 1024
                        ? `${file.size} B`
                        : file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                      }
                    </p>
                  </div>
                </div>
                <Button isIconOnly variant="light" size="sm" className="text-default-500" onClick={clearFile}> <X className="h-4 w-4" /> </Button>
              </div>

              {error && (
                <div className="bg-danger-5 text-danger-700 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}


              <Button color="primary" startContent={<Upload className="h-4 w-4" />} endContent={!uploading && <ArrowRight 
                className="h-4 w-4" />} className="w-full bg-[#006fee] text-white" isLoading={uploading} isDisabled={!!error} onClick={handleUpload}>
                {uploading ? `Uploading...` : "Upload Image"}
              </Button>
            </div>
          </div>
         )}
      </div>

      <div className="bg-default-100/5 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Tips</h4>
        <ul className="text-xs text-default-600 space-y-1">
          <li>• Images are private and only visible to you</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        backdrop="blur"
        classNames={{
          base: "border border-default-200 bg-default-5",
          header: "border-b border-default-200",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <FolderPlus className="h-5 w-5 text-primary" />
            <span>New Folder</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-default-600">
                Enter a name for your folder:
              </p>
              <Input
                type="text"
                label="Folder Name"
                placeholder="My Images"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
              onClick={() => setFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className='bg-[#006fee] text-white'
              onClick={handleCreateFolder}
              isLoading={creatingFolder}
              isDisabled={!folderName.trim()}
              endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
