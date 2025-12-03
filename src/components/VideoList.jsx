import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../context/api';
import Card from './ui/Card';
import  Badge  from './ui/Badge';
import LoadingSpinner  from './ui/LoadingSpinner';
import Button  from './ui/Button';


const VideoList = ({ onVideoUploaded }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  useEffect(() => {
    if (onVideoUploaded) {
      loadVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onVideoUploaded]);

  const loadVideos = async () => {
    try {
      const params = { page, limit: 12 };
      if (filter !== 'all') {
        if (['safe', 'flagged', 'pending'].includes(filter)) {
          params.sensitivityFlag = filter;
        } else {
          params.status = filter;
        }
      }

      const response = await videoAPI.getAll(params);
      setVideos(response.data.videos);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'processing', 'completed', 'safe', 'flagged'].map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 text-lg">No videos found</p>
          <p className="text-gray-500 text-sm mt-1">Upload your first video to get started</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video._id} 
                className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-purple-100 hover:border-[#796ce7] bg-white"
                onClick={() => handleVideoClick(video._id)}
              >
                {/* Video Thumbnail with Gradient Overlay */}
                <div className="relative bg-gradient-to-br from-[#796ce7]/20 via-[#5b4cb8]/20 to-[#3a6cee]/20 aspect-video flex items-center justify-center overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-purple-200 opacity-50" />
                  
                  {/* Play Icon */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge 
                      variant={video.status}
                      className="shadow-lg backdrop-blur-sm"
                    >
                      {video.status}
                    </Badge>
                    {video.status === 'completed' && (
                      <Badge 
                        variant={video.sensitivityFlag}
                        className="shadow-lg backdrop-blur-sm"
                      >
                        {video.sensitivityFlag}
                      </Badge>
                    )}
                  </div>

                  {/* Duration Badge */}
                  {video.duration > 0 && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                      {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </div>
                  )}

                  {/* Processing Progress Bar */}
                  {video.status === 'processing' && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/50 backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-[#796ce7] to-[#3a6cee] transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${video.processProgress || 0}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Video Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3 truncate text-lg group-hover:text-[#796ce7] transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <span className="font-medium">{formatSize(video.size)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{formatDate(video.uploadDate)}</span>
                    </div>
                  </div>

                  {video.userId && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#796ce7] to-[#3a6cee] flex items-center justify-center text-white font-bold text-xs">
                        {video.userId.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium">{video.userId.username || 'Unknown'}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600 px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoList;
