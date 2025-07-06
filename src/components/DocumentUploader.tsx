import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onUpload?: (files: File[]) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      handleUpload(files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleUpload(files);
    }
  }, []);

  const handleUpload = async (files: File[]) => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing time
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus('success');
      onUpload?.(files);
      
      // Reset after success
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);
    }, 2000);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      default:
        return <Upload className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing document...';
      case 'success':
        return 'Document uploaded successfully!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Drop PDF files here or click to browse';
    }
  };

  return (
    <Card className={cn(
      "relative border-2 border-dashed transition-all duration-300 hover:shadow-medium",
      isDragOver 
        ? "border-primary bg-primary/5 shadow-glow" 
        : "border-muted-foreground/25 hover:border-primary/50",
      uploadStatus === 'success' && "border-success bg-success/5"
    )}>
      <div
        className="p-8 text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={handleFileInput}
          disabled={uploadStatus === 'uploading'}
        />
        
        <div className="flex flex-col items-center gap-4">
          {getStatusIcon()}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {getStatusText()}
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports PDF files up to 10MB each
            </p>
          </div>

          {uploadStatus === 'uploading' && (
            <div className="w-full max-w-xs">
              <div className="bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {uploadStatus === 'idle' && (
            <Button variant="outline" size="sm" className="mt-2">
              <FileText className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};