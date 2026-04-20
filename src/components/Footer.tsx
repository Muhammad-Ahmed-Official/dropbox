import { CloudUpload } from 'lucide-react'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-default-50 border-t border-b-[0.5px] border-default-200 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CloudUpload className="h-5 w-5 text-[#006fee]" />
              <h2 className="text-lg font-bold">Droply</h2>
            </div>
            <p className="text-default-500 text-sm">
              &copy; {new Date().getFullYear()} Droply
            </p>
          </div>
        </div>
      </footer>
  )
}