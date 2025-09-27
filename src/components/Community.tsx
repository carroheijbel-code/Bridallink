import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, MessageCircle, Share2, Camera, Users, Sparkles } from 'lucide-react';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category: string;
}

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=50&h=50&fit=crop&crop=face',
    content: 'Just finalized our wedding venue! The garden at Rosewood Manor is absolutely magical. Looking for advice on outdoor wedding decorations for a spring ceremony. What flowers worked best for your big day?',
    image: 'https://images.unsplash.com/photo-1634507554990-2043ccc61e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBnYXJkZW58ZW58MXx8fHwxNzU2MzMzNzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 24,
    comments: 8,
    timeAgo: '2 hours ago',
    category: 'Venue'
  },
  {
    id: '2',
    author: 'Michael Torres',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    content: 'Wedding planning tip: Create a shared Pinterest board with your partner early! It helped us align on our vision and made vendor meetings so much smoother. What tools are you using to stay organized?',
    likes: 31,
    comments: 12,
    timeAgo: '4 hours ago',
    category: 'Tips'
  },
  {
    id: '3',
    author: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    content: 'Found the perfect wedding dress today! After trying on 20+ dresses, I finally said yes to THE dress. Trust your instincts - you\'ll know when it\'s the one. Now onto shoes!',
    image: 'https://images.unsplash.com/photo-1676132068619-f015a54cee3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZHJlc3MlMjBlbGVnYW50fGVufDF8fHx8MTc1NjM5MjAwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 45,
    comments: 15,
    timeAgo: '6 hours ago',
    category: 'Dress'
  },
  {
    id: '4',
    author: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    content: 'DIY centerpiece success! Made these rustic lantern centerpieces for under $15 each. Mason jars, fairy lights, and some greenery from our garden. Budget-friendly and beautiful!',
    image: 'https://images.unsplash.com/photo-1742442452720-4a5fc0bfe432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VudGVycGllY2UlMjBtYXNvbiUyMGphcnxlbnwxfHx8fDE3NTY0NTI4MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 67,
    comments: 22,
    timeAgo: '1 day ago',
    category: 'DIY'
  },
  {
    id: '5',
    author: 'Lisa & James',
    avatar: 'https://images.unsplash.com/photo-1582737129334-7d5a7c9b5dfe?w=50&h=50&fit=crop&crop=face',
    content: 'Our engagement photos turned out amazing! Our photographer captured our love story beautifully. These will definitely be displayed at our reception. Can\'t wait to share our special day with everyone!',
    image: 'https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2NDUyODIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    likes: 89,
    comments: 28,
    timeAgo: '2 days ago',
    category: 'Photos'
  }
];

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_POSTS);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [showImageOptions, setShowImageOptions] = useState(false);

  const sampleImages = [
    { name: 'Wedding Venue', url: 'https://images.unsplash.com/photo-1634507554990-2043ccc61e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBnYXJkZW58ZW58MXx8fHwxNzU2MzMzNzc1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Wedding Dress', url: 'https://images.unsplash.com/photo-1676132068619-f015a54cee3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZHJlc3MlMjBlbGVnYW50fGVufDF8fHx8MTc1NjM5MjAwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'DIY Centerpiece', url: 'https://images.unsplash.com/photo-1742442452720-4a5fc0bfe432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VudGVycGllY2UlMjBtYXNvbiUyMGphcnxlbnwxfHx8fDE3NTY0NTI4MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Couple Portrait', url: 'https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2NDUyODIxfDA&ixlib=rb-4.1.0&q=80&w=1080' }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: newPost,
      image: newPostImage || undefined,
      likes: 0,
      comments: 0,
      timeAgo: 'Just now',
      category: selectedCategory
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setNewPostImage('');
    setSelectedCategory('General');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const categories = ['General', 'Venue', 'Dress', 'Food', 'Decorations', 'DIY', 'Tips', 'Photos'];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-rose-500" />
          <h1 className="text-3xl text-gray-800">Wedding Community</h1>
          <Sparkles className="h-8 w-8 text-rose-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to the BridalLink Community! Connect with fellow couples, share your wedding journey, and get inspired by real weddings. 
          Share your stories, ask questions, and celebrate together!
        </p>
        
        {/* Member Welcome Banner */}
        <div className="bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-rose-600" />
            <span className="text-amber-800">Thank you for joining our community!</span>
            <Heart className="h-5 w-5 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      <Card className="p-6">
        <h2 className="text-lg mb-4 text-gray-800">Share Your Wedding Story</h2>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your wedding planning experience, ask for advice, or celebrate a milestone..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add photo URL (optional)"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowImageOptions(!showImageOptions)}
                className="px-3"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Share Post
              </Button>
            </div>
            
            {showImageOptions && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sampleImages.map((img, index) => (
                  <div
                    key={index}
                    className="cursor-pointer rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
                    onClick={() => {
                      setNewPostImage(img.url);
                      setShowImageOptions(false);
                    }}
                  >
                    <ImageWithFallback
                      src={img.url}
                      alt={img.name}
                      className="w-full h-16 object-cover"
                    />
                    <p className="text-xs text-center p-1 bg-gray-50">{img.name}</p>
                  </div>
                ))}
              </div>
            )}
            
            {newPostImage && (
              <div className="relative rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={newPostImage}
                  alt="Selected image"
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => setNewPostImage('')}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-70"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Community Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            {/* Post Header */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <ImageWithFallback
                  src={post.avatar}
                  alt={post.author}
                  className="w-full h-full object-cover rounded-full"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-800">{post.author}</h3>
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{post.timeAgo}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt="Wedding photo"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-8">
        <Button variant="outline" className="px-8">
          Load More Posts
        </Button>
      </div>
    </div>
  );
}