// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import useResourceStore from '../store/resourceStore';
import useAuthStore from '../store/authStore';
import { FiUpload, FiX, FiFile, FiImage, FiVideo, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

const Upload = () => {
  const navigate = useNavigate();
  const { uploadResource, isLoading } = useResourceStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    tags: '',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics', 'Other'];
  const levels = ['Primary', 'JSS', 'SSS', 'University', 'Other'];

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mpeg', '.mov', '.quicktime'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="w-12 h-12" />;
    if (fileType.startsWith('video/')) return <FiVideo className="w-12 h-12" />;
    if (fileType === 'application/pdf') return <FiFile className="w-12 h-12" />;
    return <FiFileText className="w-12 h-12" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (fileType) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'document';
    return 'document';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (!formData.title || !formData.description || !formData.subject || !formData.level) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subject', formData.subject);
    data.append('level', formData.level);
    data.append('fileType', getFileType(file.type));
    data.append('tags', formData.tags);

    const result = await uploadResource(data);
    if (result.success) {
      toast.success('Resource uploaded! Pending admin approval');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600">Only teachers and admins can upload resources.</p>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Share Educational Content</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* File Upload Zone */}
              <div className="mb-6">
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                      isDragActive ? 'border-sl-green bg-green-50' : 'border-gray-300 hover:border-sl-green'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Accepts: PDF, images, videos, Word docs (Max 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-sl-green rounded-lg p-6 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sl-green">{getFileIcon(file.type)}</div>
                        <div>
                          <p className="font-semibold text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                    placeholder="Describe your resource..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                      required
                    >
                      <option value="">Select level</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                    placeholder="e.g., math, textbook, jss"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isLoading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sl-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-sl-blue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiUpload />
                    <span>Upload Resource</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Upload;
