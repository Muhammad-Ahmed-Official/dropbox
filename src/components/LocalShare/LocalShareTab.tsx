'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Select,
  SelectItem,
} from '@heroui/react';
import {
  Download,
  FileText,
  ImageIcon,
  Send,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC, ReceivedFile } from '@/hooks/useWebRTC';
import { useUserContext } from '@/contextApi/UserProvider';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LocalShareTab() {
  const { currentUser } = useUserContext();
  const { socket, nearbyUsers, isConnected } = useSocket(currentUser);

  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileReceived = useCallback((file: ReceivedFile) => {
    setReceivedFiles((prev) => [file, ...prev]);
    toast.success(`Files received from ${file.fromUserName}!`);
  }, []);

  const { sendFile, isSending, sendProgress } = useWebRTC(
    socket,
    currentUser?.id ?? null,
    handleFileReceived
  );

  // Revoke preview URL when file changes
  useEffect(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      previewUrlRef.current = null;
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Revoke all received file URLs on unmount
  useEffect(() => {
    return () => {
      receivedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SHAREABLE_TYPES = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const isShareable = (file: File) => SHAREABLE_TYPES.some((t) => t.endsWith('/') ? file.type.startsWith(t) : file.type === t);

  const pickFile = (file: File) => {
    if (!isShareable(file)) {
      toast.error('Only images, PDFs, and Word documents can be shared.');
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) pickFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickFile(file);
  };

  const handleSend = async () => {
    if (!selectedFile || !selectedUserId) {
      toast.error('Select a recipient and an file first.');
      return;
    }
    await sendFile(selectedFile, selectedUserId);
    toast.success('File sent!');
    setSelectedFile(null);
    setSelectedUserId('');
  };

  const removeReceived = (id: string) => {
    setReceivedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const downloadFile = (file: ReceivedFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Send Panel ─────────────────────────────────────────── */}
      <Card className="border border-default-200 bg-default-50 shadow-md">
        <CardHeader className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-[#006fee]" />
            <h2 className="text-xl font-semibold">Send Files</h2>
          </div>
          <Chip
            size="sm"
            color={isConnected ? 'success' : 'default'}
            variant="dot"
            classNames={{ base: 'border-none' }}
          >
            {isConnected ? 'Connected' : 'Connecting…'}
          </Chip>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          {/* Status banner when no peers */}
          {isConnected && nearbyUsers.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-default-100 px-4 py-3 text-sm text-default-500">
              <Wifi className="h-4 w-4 shrink-0" />
              No other users on this network yet. Ask someone to open the app on the same WiFi.
            </div>
          )}

          {!isConnected && (
            <div className="flex items-center gap-2 rounded-lg bg-default-100 px-4 py-3 text-sm text-default-500">
              <WifiOff className="h-4 w-4 shrink-0" />
              Connecting to local network…
            </div>
          )}

          {/* Recipient select */}
          <Select
            label="Send to"
            placeholder="Select a nearby user"
            selectedKeys={selectedUserId ? new Set([selectedUserId]) : new Set()}
            onSelectionChange={(keys) => setSelectedUserId([...keys][0] as string)}
            isDisabled={nearbyUsers.length === 0 || isSending}
            classNames={{ trigger: 'bg-default-100 border-default-200' }}
          >
            {nearbyUsers.map((u) => (
              <SelectItem key={u.userId}>{u.userName}</SelectItem>
            ))}
          </Select>

          {/* Drop zone */}
          <div
            onClick={() => !isSending && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative flex min-h-45 cursor-pointer flex-col items-center justify-center
              rounded-xl border-2 border-dashed transition-colors
              ${isDragging ? 'border-[#006fee] bg-blue-950/20' : 'border-default-300 bg-default-100'}
              ${isSending ? 'cursor-not-allowed opacity-60' : 'hover:border-[#006fee] hover:bg-default-200/50'}
            `}
          >
            {selectedFile ? (
              <>
                {selectedFile.type.startsWith('image/') && previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-40 rounded-lg object-contain"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-default-400" />
                )}
                <p className="mt-2 text-xs text-default-400">
                  {selectedFile?.name} · {formatBytes(selectedFile?.size ?? 0)}
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-default-400" />
                <p className="mt-3 text-sm font-medium text-default-500">
                  Drop a file here or click to select
                </p>
                <p className="mt-1 text-xs text-default-400">Images, PDF, DOC, DOCX…</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Progress */}
          {isSending && (
            <Progress
              size="sm"
              value={sendProgress}
              color="primary"
              label="Sending…"
              showValueLabel
              classNames={{ base: 'mt-1' }}
            />
          )}

          <Button
            color="primary"
            isDisabled={!selectedFile || !selectedUserId || isSending}
            isLoading={isSending}
            onPress={handleSend}
            startContent={isSending ? undefined : <Send className="h-4 w-4" />}
            className="w-full"
          >
            {isSending ? `Sending… ${sendProgress}%` : 'Send File'}
          </Button>
        </CardBody>
      </Card>

      {/* ── Received Panel ─────────────────────────────────────── */}
      <Card className="border border-default-200 bg-default-50 shadow-md">
        <CardHeader className="flex items-center gap-3">
          <Download className="h-5 w-5 text-[#006fee]" />
          <h2 className="text-xl font-semibold">Received Files</h2>
          {receivedFiles.length > 0 && (
            <Chip size="sm" color="primary" variant="flat">
              {receivedFiles.length}
            </Chip>
          )}
        </CardHeader>

        <CardBody>
          {receivedFiles.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-default-400">
              <Download className="h-10 w-10" />
              <p className="text-sm">Files shared with you will appear here.</p>
              <p className="text-xs">They are stored only in your browser — not in the cloud.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {receivedFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative rounded-xl border border-default-200 bg-default-100 overflow-hidden"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeReceived(file.id)}
                    className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>

                  {file.type?.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="h-36 w-full flex items-center justify-center bg-default-200">
                      <FileText className="h-14 w-14 text-default-400" />
                    </div>
                  )}

                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-medium text-default-700">{file.name}</p>
                    <p className="text-xs text-default-400">
                      from <span className="text-[#006fee]">{file.fromUserName}</span>
                      {' · '}{formatBytes(file.size)}
                    </p>

                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<Download className="h-3 w-3" />}
                      onPress={() => downloadFile(file)}
                      className="mt-2 w-full"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
