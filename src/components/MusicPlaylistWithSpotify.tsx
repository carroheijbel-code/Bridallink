import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Music,
  Plus,
  Edit,
  Trash2,
  Heart,
  Clock,
  User,
  Search,
  Star,
  Users,
  Mic,
  Headphones,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  Disc,
  Radio
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string; // in MM:SS format
  category: 'ceremony' | 'cocktail' | 'dinner' | 'first-dance' | 'party' | 'special';
  occasion: string; // e.g., "Bride's entrance", "Father-daughter dance"
  priority: 'must-have' | 'nice-to-have' | 'maybe';
  notes?: string;
  spotifyUrl?: string;
  spotifyId?: string;
  youtubeUrl?: string;
  isLive?: boolean; // whether it needs live performance
  suggestedBy?: string;
  previewUrl?: string;
  albumCover?: string;
  popularity?: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

const MUSIC_CATEGORIES = {
  ceremony: { name: 'Ceremony', icon: '💒', color: 'bg-purple-100 text-purple-800', description: 'Processional, recessional, unity candle' },
  cocktail: { name: 'Cocktail Hour', icon: '🥂', color: 'bg-blue-100 text-blue-800', description: 'Background music for mingling' },
  dinner: { name: 'Dinner', icon: '🍽️', color: 'bg-green-100 text-green-800', description: 'Ambient music for dining' },
  'first-dance': { name: 'First Dance', icon: '💃', color: 'bg-pink-100 text-pink-800', description: 'Special dance moments' },
  party: { name: 'Reception Party', icon: '🎉', color: 'bg-orange-100 text-orange-800', description: 'Dancing and celebration' },
  special: { name: 'Special Moments', icon: '✨', color: 'bg-yellow-100 text-yellow-800', description: 'Parent dances, cake cutting' }
};

const SONG_OCCASIONS = [
  'Bride\'s processional',
  'Groom\'s entrance',
  'Wedding party entrance',
  'Recessional',
  'First dance',
  'Father-daughter dance',
  'Mother-son dance',
  'Cake cutting',
  'Bouquet toss',
  'Last dance',
  'Cocktail hour',
  'Dinner music',
  'Party dancing'
];

// Sample Spotify search results (simulated)
const SAMPLE_SPOTIFY_RESULTS: SpotifyTrack[] = [
  {
    id: '0tgVpDi06FyKpA1z0VMD4v',
    name: 'Perfect',
    artists: [{ name: 'Ed Sheeran' }],
    album: {
      name: '÷ (Deluxe)',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27373de5dddcf9d6c4e39eddc5d', height: 640, width: 640 }]
    },
    duration_ms: 263400,
    preview_url: 'https://p.scdn.co/mp3-preview/perfect',
    external_urls: {
      spotify: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v'
    },
    popularity: 89
  },
  {
    id: '5K4W6rqBFWDnAN6FQUkS6x',
    name: 'All of Me',
    artists: [{ name: 'John Legend' }],
    album: {
      name: 'Love in the Future',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27393542c3be3be8e7b73dd08ad', height: 640, width: 640 }]
    },
    duration_ms: 269000,
    preview_url: 'https://p.scdn.co/mp3-preview/allofme',
    external_urls: {
      spotify: 'https://open.spotify.com/track/5K4W6rqBFWDnAN6FQUkS6x'
    },
    popularity: 92
  },
  {
    id: '2Z8WuEywRWYTKe1NybPQEW',
    name: 'A Thousand Years',
    artists: [{ name: 'Christina Perri' }],
    album: {
      name: 'The Twilight Saga: Breaking Dawn - Part 1',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273d8cc2281fcd4519ca020926b', height: 640, width: 640 }]
    },
    duration_ms: 285000,
    preview_url: 'https://p.scdn.co/mp3-preview/athousandyears',
    external_urls: {
      spotify: 'https://open.spotify.com/track/2Z8WuEywRWYTKe1NybPQEW'
    },
    popularity: 85
  },
  {
    id: '3CeCwYWvdfXbZLXFhBrbnf',
    name: 'Thinking Out Loud',
    artists: [{ name: 'Ed Sheeran' }],
    album: {
      name: 'x (Deluxe Edition)',
      images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', height: 640, width: 640 }]
    },
    duration_ms: 281000,
    preview_url: 'https://p.scdn.co/mp3-preview/thinkingoutloud',
    external_urls: {
      spotify: 'https://open.spotify.com/track/3CeCwYWvdfXbZLXFhBrbnf'
    },
    popularity: 88
  }
];

export default function MusicPlaylistWithSpotify() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddSong, setShowAddSong] = useState<boolean>(false);
  const [showSpotifySearch, setShowSpotifySearch] = useState<boolean>(false);
  const [spotifyConnected, setSpotifyConnected] = useState<boolean>(false);
  const [spotifySearchTerm, setSpotifySearchTerm] = useState<string>('');
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    category: 'ceremony' as Song['category'],
    occasion: '',
    priority: 'nice-to-have' as Song['priority'],
    notes: '',
    spotifyUrl: '',
    youtubeUrl: '',
    suggestedBy: '',
    isLive: false
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedSongs = localStorage.getItem('weddingSongs');
      const savedSpotifyConnection = localStorage.getItem('spotifyConnected');
      
      if (savedSongs) {
        setSongs(JSON.parse(savedSongs));
      } else {
        // Add some sample songs
        const sampleSongs: Song[] = [
          {
            id: '1',
            title: 'Perfect',
            artist: 'Ed Sheeran',
            duration: '4:23',
            category: 'first-dance',
            occasion: 'First dance',
            priority: 'must-have',
            notes: 'Our song from our first date',
            spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
            albumCover: 'https://i.scdn.co/image/ab67616d0000b27373de5dddcf9d6c4e39eddc5d'
          },
          {
            id: '2',
            title: 'A Thousand Years',
            artist: 'Christina Perri',
            duration: '4:45',
            category: 'ceremony',
            occasion: 'Bride\'s processional',
            priority: 'must-have',
            suggestedBy: 'Maid of Honor'
          }
        ];
        setSongs(sampleSongs);
      }

      if (savedSpotifyConnection === 'true') {
        setSpotifyConnected(true);
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weddingSongs', JSON.stringify(songs));
      localStorage.setItem('spotifyConnected', spotifyConnected.toString());
    } catch (error) {
      console.error('Error saving music data:', error);
    }
  }, [songs, spotifyConnected]);

  const connectSpotify = () => {
    // In a real app, this would initiate OAuth flow
    // For demo purposes, we'll simulate connection
    setSpotifyConnected(true);
    alert('Connected to Spotify! You can now search and add songs from Spotify.');
  };

  const disconnectSpotify = () => {
    setSpotifyConnected(false);
    setSpotifyResults([]);
    setSpotifySearchTerm('');
  };

  const searchSpotify = async () => {
    if (!spotifySearchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter sample results based on search term
      const filtered = SAMPLE_SPOTIFY_RESULTS.filter(track =>
        track.name.toLowerCase().includes(spotifySearchTerm.toLowerCase()) ||
        track.artists[0].name.toLowerCase().includes(spotifySearchTerm.toLowerCase())
      );
      
      // If no matches, show all sample results
      setSpotifyResults(filtered.length > 0 ? filtered : SAMPLE_SPOTIFY_RESULTS);
      setIsSearching(false);
    }, 1000);
  };

  const addSpotifyTrack = (track: SpotifyTrack, category: Song['category'] = 'party', priority: Song['priority'] = 'nice-to-have') => {
    const durationMs = track.duration_ms;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const song: Song = {
      id: Date.now().toString(),
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      duration: duration,
      category: category,
      occasion: category === 'first-dance' ? 'First dance' : 'Party dancing',
      priority: priority,
      spotifyUrl: track.external_urls.spotify,
      spotifyId: track.id,
      previewUrl: track.preview_url,
      albumCover: track.album.images[0]?.url,
      popularity: track.popularity
    };

    setSongs(prev => [...prev, song]);
    alert(`Added "${track.name}" by ${track.artists[0].name} to your playlist!`);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playPreview = (previewUrl: string | null, trackId: string) => {
    if (!previewUrl) return;
    
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
      // In a real app, pause the audio
    } else {
      setCurrentlyPlaying(trackId);
      // In a real app, play the audio
      setTimeout(() => setCurrentlyPlaying(null), 30000); // Auto stop after 30 seconds
    }
  };

  const handleAddSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim()) return;

    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title.trim(),
      artist: newSong.artist.trim(),
      album: newSong.album.trim() || undefined,
      duration: newSong.duration.trim() || '3:00',
      category: newSong.category,
      occasion: newSong.occasion.trim(),
      priority: newSong.priority,
      notes: newSong.notes.trim() || undefined,
      spotifyUrl: newSong.spotifyUrl.trim() || undefined,
      youtubeUrl: newSong.youtubeUrl.trim() || undefined,
      suggestedBy: newSong.suggestedBy.trim() || undefined,
      isLive: newSong.isLive
    };

    setSongs([...songs, song]);
    setNewSong({
      title: '',
      artist: '',
      album: '',
      duration: '',
      category: 'ceremony',
      occasion: '',
      priority: 'nice-to-have',
      notes: '',
      spotifyUrl: '',
      youtubeUrl: '',
      suggestedBy: '',
      isLive: false
    });
    setShowAddSong(false);
  };

  const deleteSong = (id: string) => {
    setSongs(songs.filter(song => song.id !== id));
  };

  // Filter songs
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || song.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Calculate statistics
  const totalSongs = songs.length;
  const mustHaveSongs = songs.filter(song => song.priority === 'must-have').length;
  const totalDuration = songs.reduce((total, song) => {
    const parts = song.duration.split(':');
    if (parts.length === 2) {
      const [minutes, seconds] = parts.map(Number);
      return total + minutes + (seconds / 60);
    }
    return total;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Music className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Music Playlist</h1>
        <p className="text-amber-700">Organize the perfect soundtrack for your wedding day</p>
      </div>

      {/* Spotify Connection */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 rounded-full p-3">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-green-800">Spotify Integration</h3>
              <p className="text-sm text-green-700">
                {spotifyConnected 
                  ? 'Connected to Spotify - Search and add songs directly!'
                  : 'Connect to Spotify to search millions of songs'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {spotifyConnected ? (
              <>
                <Button
                  onClick={() => setShowSpotifySearch(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Spotify
                </Button>
                <Button
                  variant="outline"
                  onClick={disconnectSpotify}
                  className="text-green-600 border-green-600"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={connectSpotify}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Radio className="h-4 w-4 mr-2" />
                Connect Spotify
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-700">Total Songs</span>
            </div>
            <div className="text-2xl text-purple-800">{totalSongs}</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-pink-600" />
              <span className="text-sm text-pink-700">Must-Have Songs</span>
            </div>
            <div className="text-2xl text-pink-800">{mustHaveSongs}</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Total Duration</span>
            </div>
            <div className="text-2xl text-blue-800">{Math.round(totalDuration)}m</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">From Spotify</span>
            </div>
            <div className="text-2xl text-green-800">
              {songs.filter(song => song.spotifyUrl).length}
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 w-64"
            />
          </div>

          {/* Filters */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">All Categories</option>
            {Object.entries(MUSIC_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">All Priorities</option>
            <option value="must-have">Must Have</option>
            <option value="nice-to-have">Nice to Have</option>
            <option value="maybe">Maybe</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddSong(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🎵</div>
          <p className="text-gray-600 mb-4">No songs found</p>
          <div className="flex justify-center gap-2">
            <Button 
              onClick={() => setShowAddSong(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add Your First Song
            </Button>
            {spotifyConnected && (
              <Button
                onClick={() => setShowSpotifySearch(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Search Spotify
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSongs.map((song) => {
            const category = MUSIC_CATEGORIES[song.category];
            
            return (
              <Card key={song.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {song.albumCover ? (
                      <img 
                        src={song.albumCover} 
                        alt={`${song.album} cover`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-amber-800">{song.title}</h3>
                        <span className="text-amber-600">by {song.artist}</span>
                        {song.isLive && (
                          <Badge className="bg-red-100 text-red-800">
                            <Mic className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                        {song.spotifyUrl && (
                          <Badge className="bg-green-100 text-green-800">
                            <Radio className="h-3 w-3 mr-1" />
                            Spotify
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                        <Badge className={`${
                          song.priority === 'must-have' ? 'bg-red-100 text-red-800' :
                          song.priority === 'nice-to-have' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {song.priority}
                        </Badge>
                        {song.occasion && (
                          <Badge variant="outline">
                            {song.occasion}
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Duration: {song.duration}</span>
                          </div>
                          {song.album && (
                            <div className="flex items-center gap-2">
                              <Disc className="h-4 w-4" />
                              <span>Album: {song.album}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {song.suggestedBy && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>Suggested by: {song.suggestedBy}</span>
                            </div>
                          )}
                          {song.popularity && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <span>Popularity: {song.popularity}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {song.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{song.notes}</p>
                        </div>
                      )}

                      {/* External Links and Preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {song.previewUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playPreview(song.previewUrl!, song.id)}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            {currentlyPlaying === song.id ? (
                              <Pause className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            Preview
                          </Button>
                        )}
                        {song.spotifyUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(song.spotifyUrl, '_blank')}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Radio className="h-3 w-3 mr-1" />
                            Spotify
                          </Button>
                        )}
                        {song.youtubeUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(song.youtubeUrl, '_blank')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            YouTube
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSong(song.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Spotify Search Dialog */}
      <Dialog open={showSpotifySearch} onOpenChange={setShowSpotifySearch}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Radio className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl text-amber-800">Search Spotify</DialogTitle>
              <p className="text-amber-600 text-sm">Find and add songs from Spotify's catalog</p>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for songs, artists, or albums..."
                  value={spotifySearchTerm}
                  onChange={(e) => setSpotifySearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && searchSpotify()}
                />
              </div>
              <Button
                onClick={searchSpotify}
                disabled={isSearching || !spotifySearchTerm.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Results */}
            {spotifyResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg text-amber-800">Search Results</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {spotifyResults.map((track) => (
                    <div key={track.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <img 
                        src={track.album.images[0]?.url} 
                        alt={`${track.album.name} cover`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-amber-800">{track.name}</h4>
                          <span className="text-amber-600 text-sm">by {track.artists[0].name}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {track.album.name} • {formatDuration(track.duration_ms)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{track.popularity}% popularity</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {track.preview_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playPreview(track.preview_url, track.id)}
                            className="text-purple-600"
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        
                        <select
                          onChange={(e) => {
                            const [category, priority] = e.target.value.split('|');
                            addSpotifyTrack(track, category as Song['category'], priority as Song['priority']);
                          }}
                          className="text-sm px-2 py-1 border rounded"
                          defaultValue=""
                        >
                          <option value="" disabled>Add to...</option>
                          <option value="ceremony|must-have">Ceremony (Must Have)</option>
                          <option value="first-dance|must-have">First Dance (Must Have)</option>
                          <option value="cocktail|nice-to-have">Cocktail Hour</option>
                          <option value="dinner|nice-to-have">Dinner</option>
                          <option value="party|nice-to-have">Party</option>
                          <option value="special|nice-to-have">Special Moments</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Searching Spotify...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Song Dialog */}
      <Dialog open={showAddSong} onOpenChange={setShowAddSong}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <DialogTitle className="text-xl text-amber-800">Add Song Manually</DialogTitle>
              <p className="text-amber-600 text-sm">Add a song to your wedding playlist</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-amber-700">Song Title</Label>
                <Input
                  id="title"
                  value={newSong.title}
                  onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Song title"
                />
              </div>
              <div>
                <Label htmlFor="artist" className="text-amber-700">Artist</Label>
                <Input
                  id="artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                  placeholder="Artist name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-amber-700">Category</Label>
                <Select value={newSong.category} onValueChange={(value: Song['category']) => 
                  setNewSong(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MUSIC_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-amber-700">Priority</Label>
                <Select value={newSong.priority} onValueChange={(value: Song['priority']) => 
                  setNewSong(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maybe">Maybe</SelectItem>
                    <SelectItem value="nice-to-have">Nice to Have</SelectItem>
                    <SelectItem value="must-have">Must Have</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="spotify-url" className="text-amber-700">Spotify URL (Optional)</Label>
              <Input
                id="spotify-url"
                type="url"
                value={newSong.spotifyUrl}
                onChange={(e) => setNewSong(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                placeholder="https://open.spotify.com/..."
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-amber-700">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newSong.notes}
                onChange={(e) => setNewSong(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this song"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddSong(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddSong}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!newSong.title.trim() || !newSong.artist.trim()}
              >
                Add Song
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}