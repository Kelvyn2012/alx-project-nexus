import Header from '../components/Layout/Header';
import Profile from './Profile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Profile />
      </main>
    </div>
  );
};

export default ProfilePage;
