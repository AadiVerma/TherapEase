import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Filter, 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  X 
} from 'lucide-react';

// Constants for tags
const TAG_OPTIONS = [
  'Mental Health', 
  'Personal Growth', 
  'Relationships', 
  'Career', 
  'Self-Care', 
  'Challenges', 
  'Inspiration'
];

const AllAnonymousPosts = () => {
  // State Management
  const [anonymousPosts, setAnonymousPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    article: '',
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch Posts
  useEffect(() => {
    fetchAnonymousPosts();
  }, []);

  // Filter Posts
  useEffect(() => {
    let result = anonymousPosts;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.article.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(post => 
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedTags, anonymousPosts]);

  // Fetch Anonymous Posts
  const fetchAnonymousPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/anonymousPosts');
      setAnonymousPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Error fetching anonymous posts:', error);
    }
  };

  // Create New Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/anonymousPosts', newPost);
      setAnonymousPosts([...anonymousPosts, response.data]);
      resetPostForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Reset Post Form
  const resetPostForm = () => {
    setNewPost({
      title: '',
      article: '',
      tags: []
    });
  };

  // Toggle Tag Selection
  const toggleTag = (tag) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Toggle Filter Tag
  const toggleFilterTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Render Post Modal
  const renderPostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Anonymous Post</h2>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleCreatePost}>
          <input 
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <textarea 
            placeholder="What's on your mind?"
            value={newPost.article}
            onChange={(e) => setNewPost(prev => ({...prev, article: e.target.value}))}
            className="w-full p-2 border rounded mb-4 h-40"
            required
          />
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Select Tags</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1 rounded-full text-sm 
                    ${newPost.tags.includes(tag) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'}
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Post Anonymously
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Anonymous Community</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-full px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
            >
              <Plus className="mr-2" /> Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilterTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm 
                  ${selectedTags.includes(tag) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div 
              key={post._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {post.title}
                  </h3>
                  {post.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  {post.article}
                </p>
                <div className="flex justify-between items-center border-t pt-4">
                  <div className="flex space-x-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3 text-gray-500">
                    <button className="hover:text-red-500 flex items-center">
                      <Heart size={18} className="mr-1" /> {post.likes || 0}
                    </button>
                    <button className="hover:text-blue-500 flex items-center">
                      <MessageCircle size={18} className="mr-1" /> {post.comments || 0}
                    </button>
                    <button className="hover:text-green-500">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {isModalOpen && renderPostModal()}
    </div>
  );
};

export default AllAnonymousPosts;