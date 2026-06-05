// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

const Resource = require('../models/Resource');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

const uploadResource = asyncHandler(async (req, res) => {
  const { title, description, subject, level, fileType, tags } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  if (!title || !description || !subject || !level) {
    res.status(400);
    throw new Error('Please provide title, description, subject, and level');
  }

  const result = await cloudinary.uploader.upload_stream(
    {
      folder: 'sierra-leone-edu/resources',
      resource_type: 'auto',
    },
    async (error, result) => {
      if (error) {
        res.status(500);
        throw new Error('Error uploading to Cloudinary');
      }

      const resource = await Resource.create({
        title,
        description,
        subject,
        level,
        fileURL: result.secure_url,
        filePublicId: result.public_id,
        fileType: fileType || getFileType(req.file.mimetype),
        thumbnailURL: result.secure_url,
        uploadedBy: req.user._id,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      });

      res.status(201).json(resource);
    }
  );

  result.end(req.file.buffer);
});

const getFileType = (mimetype) => {
  if (mimetype.includes('pdf')) return 'pdf';
  if (mimetype.includes('video')) return 'video';
  if (mimetype.includes('image')) return 'image';
  return 'document';
};

const getAllResources = asyncHandler(async (req, res) => {
  const { subject, level, search, page = 1, limit = 10 } = req.query;

  let query = {};

  if (subject) query.subject = subject;
  if (level) query.level = level;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  query.isApproved = true;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const resources = await Resource.find(query)
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Resource.countDocuments(query);

  res.json({
    resources,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email profilePicture');

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.views += 1;
  await resource.save();

  res.json(resource);
});

const downloadResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.downloads += 1;
  await resource.save();

  res.json({ fileURL: resource.fileURL });
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  if (resource.filePublicId) {
    await cloudinary.uploader.destroy(resource.filePublicId);
  }

  await resource.deleteOne();

  res.json({ message: 'Resource removed' });
});

const getMyResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ uploadedBy: req.user._id })
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 });

  res.json(resources);
});

const approveResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.isApproved = true;
  await resource.save();

  res.json(resource);
});

const getPendingResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isApproved: false })
    .populate('uploadedBy', 'name email profilePicture')
    .sort({ createdAt: -1 });

  res.json(resources);
});

const getStats = asyncHandler(async (req, res) => {
  const totalResources = await Resource.countDocuments({ isApproved: true });
  const totalUsers = await User.countDocuments();
  const totalDownloads = await Resource.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: null, total: { $sum: '$downloads' } } },
  ]);
  const subjects = await Resource.distinct('subject', { isApproved: true });

  res.json({
    totalResources,
    totalUsers,
    totalDownloads: totalDownloads[0]?.total || 0,
    totalSubjects: subjects.length,
  });
});

const exportResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isApproved: true })
    .populate('uploadedBy', 'name email')
    .select('-__v');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=sierra-leone-edu-resources.json');
  res.json(resources);
});

module.exports = {
  uploadResource,
  getAllResources,
  getResourceById,
  downloadResource,
  deleteResource,
  getMyResources,
  approveResource,
  getPendingResources,
  getStats,
  exportResources,
};
