import { useState } from 'react';
import Header from '../components/Layout/Header';
import Feed from '../components/Feed/Feed';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <Header onSearch={handleSearch} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Feed searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Home;
