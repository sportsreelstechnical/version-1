import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Globe, 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  Edit, 
  Save, 
  X,
  Upload,
  Star,
  Shield,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface ClubData {
  id: string;
  name: string;
  shortName: string;
  founded: string;
  location: string;
  stadium: string;
  capacity: number;
  website: string;
  email: string;
  phone: string;
  league: string;
  division: string;
  logo: string;
  coverImage: string;
  description: string;
  achievements: string[];
  socialMedia: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  stats: {
    totalPlayers: number;
    averageAge: number;
    nationalityCount: number;
    seasonsPlayed: number;
  };
}

const ClubProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [clubData, setClubData] = useState<ClubData>({
    id: '1',
    name: 'Manchester City FC',
    shortName: 'MCFC',
    founded: '1880',
    location: 'Manchester, England',
    stadium: 'Etihad Stadium',
    capacity: 55000,
    website: 'https://www.mancity.com',
    email: 'info@mancity.com',
    phone: '+44 161 444 1894',
    league: 'Premier League',
    division: 'Professional',
    logo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Manchester City Football Club is an English football club based in Manchester that competes in the Premier League, the top flight of English football.',
    achievements: [
      'Premier League Champions 2023-24',
      'UEFA Champions League Winners 2023',
      'FA Cup Winners 2023',
      'EFL Cup Winners 2024'
    ],
    socialMedia: {
      twitter: '@ManCity',
      facebook: 'manchestercity',
      instagram: '@mancity'
    },
    stats: {
      totalPlayers: 25,
      averageAge: 26.8,
      nationalityCount: 12,
      seasonsPlayed: 144
    }
  });

  const [editData, setEditData] = useState<ClubData>(clubData);

  const handleEdit = () => {
    setEditData(clubData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setClubData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(clubData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({ ...prev, coverImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Club Profile</h1>
              <p className="text-gray-400">Manage your club information and settings</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Edit size={20} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <X size={20} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="relative">
            <div className="h-64 bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={isEditing ? editData.coverImage : clubData.coverImage}
                alt="Club Cover"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <label className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center space-x-2">
                    <Upload size={16} />
                    <span>Change Cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Club Logo */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={isEditing ? editData.logo : clubData.logo}
                  alt="Club Logo"
                  className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-pink-600 rounded-full p-2 cursor-pointer hover:bg-pink-700 transition-colors">
                    <Upload size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Club Info */}
          <div className="pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Club Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Club Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white text-lg font-semibold">{clubData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Short Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.shortName}
                          onChange={(e) => handleInputChange('shortName', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.shortName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Founded</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.founded}
                          onChange={(e) => handleInputChange('founded', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.founded}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Stadium</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.stadium}
                          onChange={(e) => handleInputChange('stadium', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.stadium}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Capacity</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.capacity}
                          onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.capacity.toLocaleString()}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">League</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.league}
                          onChange={(e) => handleInputChange('league', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.league}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Division</label>
                      {isEditing ? (
                        <select
                          value={editData.division}
                          onChange={(e) => handleInputChange('division', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        >
                          <option value="professional">Professional</option>
                          <option value="semi-professional">Semi-Professional</option>
                          <option value="amateur">Amateur</option>
                          <option value="youth">Youth</option>
                        </select>
                      ) : (
                        <p className="text-white">{clubData.division}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                      />
                    ) : (
                      <p className="text-gray-300">{clubData.description}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <a href={clubData.website} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                          {clubData.website}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="text-white">{clubData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Twitter</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.socialMedia.twitter}
                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                            placeholder="@username"
                          />
                        ) : (
                          <p className="text-white">{clubData.socialMedia.twitter}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Facebook</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.socialMedia.facebook}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                            placeholder="username"
                          />
                        ) : (
                          <p className="text-white">{clubData.socialMedia.facebook}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Instagram</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                            placeholder="@username"
                          />
                        ) : (
                          <p className="text-white">{clubData.socialMedia.instagram}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Club Stats */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Club Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Players</span>
                      <span className="text-white font-semibold">{clubData.stats.totalPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Age</span>
                      <span className="text-white font-semibold">{clubData.stats.averageAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nationalities</span>
                      <span className="text-white font-semibold">{clubData.stats.nationalityCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seasons Played</span>
                      <span className="text-white font-semibold">{clubData.stats.seasonsPlayed}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Trophy className="text-yellow-400" size={20} />
                    <span>Recent Achievements</span>
                  </h3>
                  <div className="space-y-3">
                    {clubData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Award className="text-yellow-400 mt-1" size={16} />
                        <span className="text-gray-300 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors text-sm">
                      View Public Profile
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm">
                      Download Club Info
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm">
                      Share Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;