// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link } from 'react-router-dom';
import { FiDownload, FiEye, FiStar, FiUser } from 'react-icons/fi';

const ResourceCard = ({ resource }) => {
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'image':
        return '🖼️';
      case 'document':
        return '📝';
      default:
        return '📁';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
      <Link to={`/resource/${resource._id}`}>
        <div className="h-48 bg-gradient-to-br from-sl-green to-sl-blue flex items-center justify-center text-6xl">
          {getFileIcon(resource.fileType)}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/resource/${resource._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate hover:text-sl-blue transition">
            {resource.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-sl-green/10 text-sl-green px-2 py-1 rounded text-xs">
            {resource.subject}
          </span>
          <span className="bg-sl-blue/10 text-sl-blue px-2 py-1 rounded text-xs">
            {resource.level}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <FiUser className="w-4 h-4" />
            <span className="truncate">{resource.uploadedBy?.name || 'Unknown'}</span>
          </div>
          <span className="text-xs">{formatDate(resource.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <FiEye />
              <span>{resource.views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiDownload />
              <span>{resource.downloads}</span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <FiStar className="text-yellow-500" />
            <span>{resource.averageRating?.toFixed(1) || 'N/A'}</span>
          </span>
        </div>
        <Link
          to={`/resource/${resource._id}`}
          className="block w-full bg-sl-blue hover:bg-blue-700 text-white text-center py-2 rounded-lg transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
