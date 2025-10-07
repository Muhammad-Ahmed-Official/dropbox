import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress } from '@heroui/react'
import { AlertTriangle, ArrowRight, FileUp, FolderPlus, Upload, X } from 'lucide-react'
import React from 'react'

export default function FileUploadForm() {
  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 mb-2">
        <Button
          color="primary"
          variant="flat"
          startContent={<FolderPlus className="h-4 w-4" />}
        //   onClick={() => setFolderModalOpen(true)}
          className="flex-1"
        >
          New Folder
        </Button>
        <Button
          color="primary"
          variant="flat"
          startContent={<FileUp className="h-4 w-4" />}
        //   onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          Add Image
        </Button>
      </div>
        
      {/* File drop area */}
      <div
        // onDrop={handleDrop}
        // onDragOver={handleDragOver}
        // className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        //   error
        //     ? "border-danger/30 bg-danger/5"
        //     : file
        //       ? "border-primary/30 bg-primary/5"
        //       : "border-default-300 hover:border-primary/5"
        // }`}
      >
        {/* {!file ? ( */}
          <div className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-primary/70" />
            <div>
              <p className="text-default-600">
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                //   onClick={() => fileInputRef.current?.click()}
                  className="text-primary cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-default-500 mt-1">Images up to 5MB</p>
            </div>
            <Input
              type="file"
            //   ref={fileInputRef}
            //   onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        {/* ) : ( */}
          {/* <d/iv> */}
        {/* )} */}
      </div>

      {/* Upload tips */}
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
        // isOpen={folderModalOpen}
        // onOpenChange={setFolderModalOpen}
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
                // value={folderName}
                // onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
            //   onClick={() => setFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
            //   onClick={handleCreateFolder}
            //   isLoading={creatingFolder}
            //   isDisabled={!folderName.trim()}
            //   endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
