// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import Spinner from '../components/Spinner';
import useResourceStore from '../store/resourceStore';
import { FiBookOpen, FiUpload, FiUsers, FiDownload, FiStar, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { getAllResources, resources, isLoading } = useResourceStore();
  const [stats, setStats] = useState(null);

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
    { name: 'English', icon: '📚', color: 'bg-purple-500' },
    { name: 'History', icon: '🏛️', color: 'bg-yellow-500' },
    { name: 'Geography', icon: '🌍', color: 'bg-teal-500' },
    { name: 'ICT', icon: '💻', color: 'bg-indigo-500' },
    { name: 'Biology', icon: '🧬', color: 'bg-pink-500' },
    { name: 'Chemistry', icon: '⚗️', color: 'bg-orange-500' },
    { name: 'Physics', icon: '⚛️', color: 'bg-red-500' },
  ];

  useEffect(() => {
    getAllResources({ limit: 6 });
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/resources/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sl-green via-white to-sl-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Free Educational Resources for Sierra Leone
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering students and teachers across Sierra Leone with quality educational materials. 
              Supporting SDG 4: Quality Education and bridging the education gap in our communities.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/browse"
                className="bg-sl-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center space-x-2"
              >
                <FiBookOpen />
                <span>Browse Resources</span>
              </Link>
              <Link
                to="/upload"
                className="bg-sl-green hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center space-x-2"
              >
                <FiUpload />
                <span>Share Your Knowledge</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-sl-green/10 to-sl-green/5 rounded-xl">
                <FiBookOpen className="h-12 w-12 mx-auto text-sl-green mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.totalResources}</h3>
                <p className="text-gray-600">Total Resources</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-sl-blue/10 to-sl-blue/5 rounded-xl">
                <FiUsers className="h-12 w-12 mx-auto text-sl-blue mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl">
                <FiDownload className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.totalDownloads}</h3>
                <p className="text-gray-600">Total Downloads</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl">
                <FiStar className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stats.totalSubjects}</h3>
                <p className="text-gray-600">Subjects Covered</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Resources</h2>
            <Link to="/browse" className="text-sl-blue hover:text-blue-700 font-semibold flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.slice(0, 6).map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                to={`/browse?subject=${subject.name}`}
                className={`${subject.color} hover:opacity-90 text-white p-6 rounded-xl text-center transition`}
              >
                <div className="text-4xl mb-2">{subject.icon}</div>
                <h3 className="font-semibold">{subject.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-sl-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Register</h3>
              <p className="text-gray-600">Create your free account as a student or teacher</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-sl-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload or Browse</h3>
              <p className="text-gray-600">Share your knowledge or discover resources</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Learn & Grow</h3>
              <p className="text-gray-600">Download materials and enhance your education</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
