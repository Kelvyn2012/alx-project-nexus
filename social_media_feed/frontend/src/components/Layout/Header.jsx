import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilePicture from '../Profile/ProfilePicture';
import ThemeToggle from '../Common/ThemeToggle';

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/80 dark:bg-dark-850/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 sticky top-0 z-10 shadow-sm dark:shadow-dark-lg transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 dark:from-blue-500 dark:to-primary rounded-full flex items-center justify-center shadow-md dark:shadow-dark-md group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-secondary dark:text-white hidden sm:block group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
              Social Feed
            </span>
          </Link>

          {/* Search Bar */}
          {onSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-dark-400 hover:bg-white dark:hover:bg-dark-850"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-dark-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Link
              to="/profile"
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-dark-800 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95"
            >
              <ProfilePicture username={user?.username} size="small" />
              <span className="text-sm font-medium text-secondary dark:text-gray-200 hidden sm:block">
                {user?.username}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-all duration-200 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
