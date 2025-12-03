import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { videoAPI } from '../context/api';
import Modal from './ui/Modal';


const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { socket, subscribeToVideo } = useSocket();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a video file.');
        return;
      }
      
      // Validate file size (500MB max)
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('File too large. Maximum size is 500MB.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      // Auto-fill title from filename
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setError('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      const response = await videoAPI.upload(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      const uploadedVideoId = response.data.video.id;
      setUploading(false);
      setProcessing(true);

      // Subscribe to video processing updates
      subscribeToVideo(uploadedVideoId);

      // Listen for processing updates
      if (socket) {
        socket.on('video-processing-progress', (data) => {
          console.log(data.progress);
          if (data.videoId === uploadedVideoId) {
            setProcessProgress(data.progress);
          }
        });
     
        socket.on('video-processing-complete', (data) => {
          if (data.videoId === uploadedVideoId) {
            setProcessing(false);
            setSuccess(true);
            onUploadComplete?.();
            
            // Auto-close after 2 seconds
            setTimeout(() => {
              handleClose();
            }, 2000);
          }
        });

        socket.on('video-processing-error', (data) => {
          if (data.videoId === uploadedVideoId) {
            setProcessing(false);
            setError('Video processing failed: ' + data.error);
          }
        });
      }

    } catch (err) {
      setUploading(false);
      setError(err.message || 'Upload failed');
    }
  };

  const handleClose = () => {
    if (!uploading && !processing) {
      setFile(null);
      setTitle('');
      setUploadProgress(0);
      setProcessProgress(0);
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Video" size="md">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">Video uploaded and processed successfully!</p>
          </div>
        )}

        {!uploading && !processing && !success && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#796ce7] focus:ring-4 focus:ring-[#796ce7]/10 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Video File
              </label>
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#796ce7] hover:bg-purple-50/50 transition-all">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#796ce7] to-[#3a6cee] rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#796ce7] to-[#3a6cee] rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">Click to select or drag and drop</p>
                      <p className="text-sm text-gray-500">MP4, MOV, AVI, MKV, WebM (max 500MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || !title}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#796ce7] to-[#3a6cee] text-white font-semibold rounded-xl hover:from-[#6a5cd6] hover:to-[#2e5cdd] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                Upload Video
              </button>
            </div>
          </>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="py-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#796ce7] to-[#3a6cee] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="text-center text-lg font-semibold text-gray-800 mb-2">Uploading Video</p>
            <p className="text-center text-sm text-gray-600 mb-6">{file?.name}</p>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#796ce7] to-[#3a6cee] h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-2xl font-bold bg-gradient-to-r from-[#796ce7] to-[#3a6cee] bg-clip-text text-transparent mt-3">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Processing Progress */}
        {processing && (
          <div className="py-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-[#3a6cee] rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="absolute inset-0 w-20 h-20 animate-spin" viewBox="0 0 50 50">
                  <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
                  <circle className="opacity-75" cx="25" cy="25" r="20" stroke="url(#gradient)" strokeWidth="4" fill="none" strokeDasharray="80" strokeDashoffset="20" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#796ce7" />
                      <stop offset="100%" stopColor="#3a6cee" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-center text-lg font-semibold text-gray-800 mb-2">Processing Video with AI</p>
            <p className="text-center text-sm text-gray-600 mb-6">Analyzing content sensitivity and extracting metadata</p>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-[#3a6cee] h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${processProgress}%` }}
                />
              </div>
              <p className="text-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-[#3a6cee] bg-clip-text text-transparent mt-3">{processProgress}%</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UploadModal;
