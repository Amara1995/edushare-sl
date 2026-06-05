// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useLanguageStore from '../store/languageStore';
import { FiLogOut, FiUser, FiUpload, FiHome, FiBookOpen, FiGlobe } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguageStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'krio' : 'english');
  };

  return (
    <nav className="bg-sl-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBookOpen className="h-8 w-8" />
              <span className="text-xl font-bold">Sierra Leone Edu</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-sl-green transition">
              <FiHome />
              <span>{t('home')}</span>
            </Link>
            <Link to="/browse" className="flex items-center space-x-1 hover:text-sl-green transition">
              <FiBookOpen />
              <span>{t('browse')}</span>
            </Link>

            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 hover:text-sl-green transition px-2 py-1 rounded"
              title="Switch Language"
            >
              <FiGlobe />
              <span className="text-sm">{language === 'english' ? 'EN' : 'KR'}</span>
            </button>

            {user ? (
              <>
                {user.role === 'teacher' || user.role === 'admin' ? (
                  <Link to="/upload" className="flex items-center space-x-1 hover:text-sl-green transition">
                    <FiUpload />
                    <span>{t('upload')}</span>
                  </Link>
                ) : null}
                {user.role === 'admin' ? (
                  <Link to="/admin" className="flex items-center space-x-1 hover:text-sl-green transition">
                    <FiUser />
                    <span>{t('admin')}</span>
                  </Link>
                ) : null}
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-sl-green transition">
                  <FiUser />
                  <span>{t('dashboard')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-sl-green transition"
                >
                  <FiLogOut />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-sl-green transition">
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-sl-green hover:bg-green-600 px-4 py-2 rounded-lg transition"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
