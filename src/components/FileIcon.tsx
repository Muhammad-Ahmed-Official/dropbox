'use client'

import React from 'react'
import type { File as FileType } from "@/lib/db/schema";
import { FileText, Folder } from 'lucide-react';
import { IKImage } from "imagekitio-next";
import Image from 'next/image';

interface FileProp {
  file: FileType
}

export default function FileIcon({file}: FileProp) {
  if (file.isFolder) return <Folder className="h-5 w-5 text-blue-500" />;

  const fileType = file.type.split("/")[0];
  switch (fileType) {
    case "image":
      return(
        <div className="h-12 w-12 relative overflow-hidden rounded bg-gray-100 flex items-center justify-center">
         <img
            src={file.fileUrl} // use your stored file URL
            alt={file.name}
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
            loading="lazy"
          />
        </div>
      )
    case "video":
      return <FileText className="h-5 w-5 text-purple-500" />;
    case "application": 
      if(file.type.includes("pdf")){
        return <FileText className="h-5 w-5 text-red-500" />;
      }
      return <FileText className="h-5 w-5 text-orange-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
}
