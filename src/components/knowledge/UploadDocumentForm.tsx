import React, { useState } from 'react';
import { X, Upload, File } from 'lucide-react';
import { uploadFiles } from './Upload';


interface UploadDocumentFormProps {
  knowledgeId: number
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: any) => void;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({ knowledgeId, isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const newDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name,
        type: documentType || 'Unknown',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString().split('T')[0]
      };


      uploadFiles([selectedFile], knowledgeId.toString())
      
      onUpload(newDocument);
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue"
              required
            >
              <option value="">Select Type</option>
              <option value="PDF">PDF</option>
              <option value="Word">Word Document</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="Text">Text Document</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue"
              rows={3}
              placeholder="Enter document description..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-center">
                    <File className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-intelQEDarkBlue hover:text-sky-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileSelect}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, Word, Excel up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn1"
              disabled={!selectedFile || !documentType}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentForm;