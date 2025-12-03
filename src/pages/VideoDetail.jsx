import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoAPI } from '../context/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [frames, setFrames] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);

  useEffect(() => {
    loadVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadVideo = async () => {
    try {
      const response = await videoAPI.getById(id);
      setVideo(response.data.video);
      
      // Load frames if video is completed
      if (response.data.video.status === 'completed') {
        loadFrames();
      }
    } catch (err) {
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const loadFrames = async () => {
    setLoadingFrames(true);
    try {
      const response = await videoAPI.getFrames(id);
      setFrames(response.data.frames);
    } catch (err) {
      console.log('Frames not available:', err.message);
    } finally {
      setLoadingFrames(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setDeleting(true);
    try {
      await videoAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete video');
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStreamUrl = () => {
    return videoAPI.getStreamUrl(id);
  };
  console.log(videoAPI.getStreamUrl(id));
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 border-2 border-red-200">
          <Alert type="error" message={error} />
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full mt-4 bg-gradient-to-r from-[#796ce7] to-[#3a6cee] hover:from-[#6a5cd6] hover:to-[#2e5cdd] text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group p-3 rounded-xl bg-gradient-to-r from-[#796ce7] to-[#3a6cee] text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#796ce7] to-[#3a6cee] bg-clip-text text-transparent">
                  {video.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Video Details & Analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={video.status} className="text-sm px-4 py-2">
                {video.status}
              </Badge>
              {video.status === 'completed' && (
                <Badge variant={video.sensitivityFlag} className="text-sm px-4 py-2">
                  {video.sensitivityFlag}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Video Player Card */}
        <Card className="overflow-hidden border-2 border-purple-100 shadow-2xl bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#796ce7] to-[#3a6cee] p-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video Player
            </h2>
          </div>
          {video.status === 'completed' ? (
            <div className="relative group">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={getStreamUrl()}
                controlsList="nodownload"
              >
                Your browser does not support video playback.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
              {video.status === 'processing' && (
                <>
                  <div className="relative w-24 h-24 mb-6">
                    <svg className="animate-spin w-24 h-24 text-[#796ce7]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#796ce7]">{video.processProgress || 0}%</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Processing Video...</p>
                  <p className="text-sm text-gray-500">AI Analysis in Progress</p>
                </>
              )}
              {video.status === 'pending' && (
                <>
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Video Pending</p>
                  <p className="text-sm text-gray-500">Processing will begin shortly</p>
                </>
              )}
              {video.status === 'failed' && (
                <>
                  <div className="w-24 h-24 mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Processing Failed</p>
                  {video.errorMessage && (
                    <p className="text-sm text-gray-500 mt-2">{video.errorMessage}</p>
                  )}
                </>
              )}
            </div>
          )}
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Information */}
          <Card className="p-6 border-2 border-purple-100 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-purple-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Video Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File Size</p>
                <p className="text-lg font-bold text-gray-900">{formatSize(video.size)}</p>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Upload Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(video.uploadDate)}</p>
              </div>

              {video.duration > 0 && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                  </p>
                </div>
              )}

              {video.metadata?.resolution && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resolution</p>
                  <p className="text-lg font-bold text-gray-900">{video.metadata.resolution}</p>
                </div>
              )}
            </div>
          </Card>

          {/* User Information */}
          <Card className="p-6 border-2 border-blue-100 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3a6cee] to-[#796ce7] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Uploader Details</h3>
            </div>
            
            <div className="space-y-4">
              {video.userId && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username</p>
                  <p className="text-lg font-bold text-gray-900">{video.userId.username}</p>
                </div>
              )}

              {video.organization && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Organization</p>
                  <p className="text-lg font-bold text-gray-900">{video.organization}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6 border-2 border-green-100 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-green-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Actions</h3>
            </div>
            
            <div className="space-y-3">
              {video.status === 'completed' && (
                <Button
                  className="w-full bg-gradient-to-r from-[#3a6cee] to-[#796ce7] hover:from-[#2e5cdd] hover:to-[#6a5cd6] text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open(getStreamUrl(), '_blank')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </Button>
              )}
              
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Video
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Analyzed Frames Section */}
        {video.status === 'completed' && (
          <Card className="p-6 border-2 border-purple-100 shadow-2xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#796ce7] to-[#3a6cee] bg-clip-text text-transparent">
                    Analyzed Frames
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {frames.length > 0 ? `${frames.length} frames extracted for AI content analysis` : 'Loading frames...'}
                  </p>
                </div>
              </div>
            </div>

            {loadingFrames ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4">Loading analyzed frames...</p>
              </div>
            ) : frames.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {frames.map((frame) => (
                    <div
                      key={frame.id}
                      className="group relative aspect-video rounded-xl overflow-hidden border-2 border-purple-100 hover:border-[#796ce7] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50"
                      onClick={() => setSelectedFrame(frame)}
                    >
                      <img
                        src={frame.data}
                        alt={`Frame ${frame.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-bold">Frame {frame.id}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-[#796ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-900">AI Content Analysis Complete</p>
                      <p className="text-xs text-green-700 mt-1">
                        These frames were analyzed using Hugging Face AI model (Falconsai/nsfw_image_detection) to ensure content safety.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No frames available</p>
                <p className="text-sm text-gray-500 mt-1">Frames may not have been extracted for this video</p>
              </div>
            )}
          </Card>
        )}

        {/* Frame Modal */}
        {selectedFrame && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedFrame(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedFrame(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedFrame.data}
                alt={`Frame ${selectedFrame.id}`}
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
              />
              <div className="mt-4 text-center">
                <p className="text-white text-lg font-bold">Frame {selectedFrame.id}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoDetail;
