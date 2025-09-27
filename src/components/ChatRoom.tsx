import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Star,
  Users,
  Smile,
  Image,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { toast } from '../utils/toast';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'announcement';
  reactions: { emoji: string; count: number; users: string[] }[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  weddingDate: string;
  location: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  weddingDate?: string;
}

interface ChatRoomProps {
  user: AuthUser | null;
}

export function ChatRoom({ user }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah M.',
      userAvatar: '👰',
      content: 'Hi everyone! Just joined BridalLink and so excited to connect with other brides planning their Mallorca weddings! 💕',
      timestamp: '2024-01-20T10:30:00Z',
      type: 'text',
      reactions: [
        { emoji: '❤️', count: 5, users: ['user2', 'user3', 'user4', 'user5', 'user6'] },
        { emoji: '🎉', count: 3, users: ['user2', 'user7', 'user8'] }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Emma K.',
      userAvatar: '👸',
      content: 'Welcome Sarah! I had my wedding in Mallorca last summer and it was absolutely magical. The sunset ceremonies are incredible! 🌅',
      timestamp: '2024-01-20T10:45:00Z',
      type: 'text',
      reactions: [
        { emoji: '😍', count: 4, users: ['user1', 'user3', 'user5', 'user7'] }
      ]
    },
    {
      id: '3',
      userId: 'admin',
      userName: 'BridalLink Team',
      userAvatar: '💎',
      content: 'Welcome to the Mallorca Brides community! 🏝️ Don\'t forget to book your free 10-minute consultation with our wedding experts. We have local planners who know all the best venues!',
      timestamp: '2024-01-20T11:00:00Z',
      type: 'announcement',
      reactions: []
    },
    {
      id: '4',
      userId: 'user3',
      userName: 'Jessica L.',
      userAvatar: '👸',
      content: 'Has anyone worked with photographers in Palma? I\'m looking for someone who specializes in beach ceremonies. Any recommendations? 📸',
      timestamp: '2024-01-20T11:15:00Z',
      type: 'text',
      reactions: [
        { emoji: '📷', count: 2, users: ['user1', 'user2'] }
      ]
    },
    {
      id: '5',
      userId: 'user4',
      userName: 'Maria R.',
      userAvatar: '👰',
      content: 'Jessica, I highly recommend Island Moments Photography! They did our engagement shoot and the photos were stunning. They know all the hidden gems in Mallorca ✨',
      timestamp: '2024-01-20T11:30:00Z',
      type: 'text',
      reactions: [
        { emoji: '⭐', count: 3, users: ['user1', 'user3', 'user5'] }
      ]
    }
  ]);

  const [onlineUsers] = useState<User[]>([
    { id: 'user1', name: 'Sarah M.', avatar: '👰', status: 'online', weddingDate: '2024-08-15', location: 'London, UK' },
    { id: 'user2', name: 'Emma K.', avatar: '👸', status: 'online', weddingDate: '2024-07-20', location: 'Manchester, UK' },
    { id: 'user3', name: 'Jessica L.', avatar: '👸', status: 'online', weddingDate: '2024-09-10', location: 'Dublin, Ireland' },
    { id: 'user4', name: 'Maria R.', avatar: '👰', status: 'offline', weddingDate: '2024-06-05', location: 'Barcelona, Spain' },
    { id: 'user5', name: 'Lisa T.', avatar: '👸', status: 'online', weddingDate: '2024-10-12', location: 'Amsterdam, Netherlands' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(onlineUsers.filter(u => u.status === 'online'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      userName: user?.name || 'You',
      userAvatar: '👰',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      reactions: []
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          const hasUserReacted = existingReaction.users.includes(user?.id || 'guest');
          if (hasUserReacted) {
            // Remove reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(id => id !== (user?.id || 'guest')) }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, user?.id || 'guest'] }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...message,
            reactions: [...message.reactions, { emoji, count: 1, users: [user?.id || 'guest'] }]
          };
        }
      }
      return message;
    }));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReactions = ['❤️', '😍', '🎉', '👏', '😊', '💕', '⭐', '🔥'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-pink-500" />
            <span>Bride Chat</span>
          </h1>
          <p className="text-gray-600 mt-1">Connect with other brides planning their Mallorca weddings</p>
        </div>
        <Badge variant="outline" className="text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          {activeUsers.length} online
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Mallorca Brides Community</span>
                <Badge variant="secondary">{messages.length} messages</Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex space-x-3 ${
                      message.type === 'announcement' ? 'justify-center' : ''
                    }`}>
                      {message.type !== 'announcement' && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
                            {message.userAvatar}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex-1 ${
                        message.type === 'announcement' ? 'max-w-md' : ''
                      }`}>
                        {message.type === 'announcement' ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <span className="text-xl">{message.userAvatar}</span>
                              <span className="font-medium text-blue-800">{message.userName}</span>
                            </div>
                            <p className="text-blue-700 text-sm">{message.content}</p>
                            <p className="text-xs text-blue-600 mt-2">{formatTime(message.timestamp)}</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{message.userName}</span>
                              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-800">{message.content}</p>
                            </div>
                            
                            {/* Reactions */}
                            <div className="flex items-center space-x-2 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-gray-100"
                                  onClick={() => handleReaction(message.id, reaction.emoji)}
                                >
                                  <span className="mr-1">{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </Button>
                              ))}
                              
                              {/* Quick reactions */}
                              <div className="flex space-x-1">
                                {quickReactions.slice(0, 3).map((emoji) => (
                                  <Button
                                    key={emoji}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-xs hover:bg-gray-100"
                                    onClick={() => handleReaction(message.id, emoji)}
                                  >
                                    {emoji}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick reactions for new messages */}
                <div className="flex space-x-2 mt-2">
                  {quickReactions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setNewMessage(newMessage + emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Online Users Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Online Brides</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onlineUsers.map((onlineUser) => (
                  <div key={onlineUser.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        {onlineUser.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        onlineUser.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{onlineUser.name}</p>
                      <p className="text-xs text-gray-500">{onlineUser.location}</p>
                      <p className="text-xs text-pink-600">
                        👰 {new Date(onlineUser.weddingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Guidelines */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-gray-600">
                <p>• Be kind and supportive to fellow brides</p>
                <p>• Share tips and experiences</p>
                <p>• Keep discussions wedding-related</p>
                <p>• No spam or promotional content</p>
                <p>• Respect privacy and confidentiality</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Report Issue
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Wedding Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                💡 <strong>Pro tip:</strong> Book your Mallorca wedding venue at least 12 months in advance, especially for summer dates. Popular beachfront locations fill up quickly!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}