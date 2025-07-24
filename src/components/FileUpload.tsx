import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File;
  accept?: string;
}

const FileUpload = ({ onFileSelect, selectedFile, accept = ".riv" }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.riv')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Rive File
        </CardTitle>
        <CardDescription className="text-brand-300">
          Drag and drop a .riv file or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedFile ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <File className="w-5 h-5 text-green-600" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-sm text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              onClick={removeFile}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {dragActive ? "Drop your Rive file here" : "Upload a Rive file"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports .riv files only
            </p>
            <Button asChild>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileInput}
                  className="hidden"
                />
                Choose File
              </label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload; 