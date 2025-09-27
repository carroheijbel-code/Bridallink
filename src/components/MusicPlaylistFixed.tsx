// This file has been moved to MusicPlaylistWithSpotify.tsx
// Keeping this as placeholder to avoid import conflicts

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
  youtubeUrl?: string;
  isLive?: boolean; // whether it needs live performance
  suggestedBy?: string;
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

const POPULAR_WEDDING_SONGS = [
  { title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23' },
  { title: 'All of Me', artist: 'John Legend', duration: '4:29' },
  { title: 'A Thousand Years', artist: 'Christina Perri', duration: '4:45' },
  { title: 'Marry Me', artist: 'Train', duration: '4:18' },
  { title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41' },
  { title: 'Make You Feel My Love', artist: 'Adele', duration: '3:32' },
  { title: 'At Last', artist: 'Etta James', duration: '3:02' },
  { title: 'Can\'t Help Myself', artist: 'Four Tops', duration: '2:56' },
  { title: 'I Want to Dance with Somebody', artist: 'Whitney Houston', duration: '4:52' },
  { title: 'September', artist: 'Earth, Wind & Fire', duration: '3:35' }
];

export default function MusicPlaylist() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddSong, setShowAddSong] = useState<boolean>(false);
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
            spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v'
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
          },
          {
            id: '3',
            title: 'September',
            artist: 'Earth, Wind & Fire',
            duration: '3:35',
            category: 'party',
            occasion: 'Party dancing',
            priority: 'nice-to-have',
            notes: 'Great for getting everyone on the dance floor!'
          }
        ];
        setSongs(sampleSongs);
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weddingSongs', JSON.stringify(songs));
    } catch (error) {
      console.error('Error saving music data:', error);
    }
  }, [songs]);

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

  const addPopularSong = (popularSong: typeof POPULAR_WEDDING_SONGS[0]) => {
    const song: Song = {
      id: Date.now().toString(),
      title: popularSong.title,
      artist: popularSong.artist,
      duration: popularSong.duration,
      category: 'party',
      occasion: 'Party dancing',
      priority: 'nice-to-have'
    };
    setSongs([...songs, song]);
  };

  // Filter songs
  const filteredSongs = songs.filter(song => {
    try {
      const matchesSearch = (song.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (song.artist || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (song.occasion || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || song.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    } catch (error) {
      console.error('Error filtering song:', song, error);
      return false;
    }
  });

  // Calculate statistics
  const totalSongs = songs.length;
  const mustHaveSongs = songs.filter(song => song.priority === 'must-have').length;
  const totalDuration = songs.reduce((total, song) => {
    try {
      if (!song.duration || typeof song.duration !== 'string') return total;
      const parts = song.duration.split(':');
      if (parts.length !== 2) return total;
      const [minutes, seconds] = parts.map(Number);
      if (isNaN(minutes) || isNaN(seconds)) return total;
      return total + minutes + (seconds / 60);
    } catch (error) {
      console.error('Error calculating duration for song:', song, error);
      return total;
    }
  }, 0);

  const songsByCategory = Object.keys(MUSIC_CATEGORIES).map(category => {
    const categoryData = MUSIC_CATEGORIES[category as keyof typeof MUSIC_CATEGORIES];
    return {
      category,
      count: songs.filter(song => song.category === category).length,
      name: categoryData?.name || category,
      icon: categoryData?.icon || '🎵',
      color: categoryData?.color || 'bg-gray-100 text-gray-800',
      description: categoryData?.description || ''
    };
  });

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
              <Headphones className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Live Performance</span>
            </div>
            <div className="text-2xl text-green-800">
              {songs.filter(song => song.isLive).length}
            </div>
          </div>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="p-6">
        <h3 className="text-lg text-amber-800 mb-4">Songs by Category</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {songsByCategory.map((categoryData) => (
            <div key={categoryData.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{categoryData.icon}</span>
                <div>
                  <div className="text-sm text-amber-800">{categoryData.name}</div>
                  <div className="text-xs text-amber-600">{categoryData.description}</div>
                </div>
              </div>
              <Badge className={categoryData.color}>
                {categoryData.count}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

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

        <Button
          onClick={() => setShowAddSong(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Song
        </Button>
      </div>

      {/* Popular Songs Section */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-lg text-amber-800 mb-4">Popular Wedding Songs</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {POPULAR_WEDDING_SONGS.map((song, index) => (
            <div key={`popular-${index}`} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <div className="text-sm text-amber-800">{song.title}</div>
                <div className="text-xs text-amber-600">{song.artist} • {song.duration}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addPopularSong(song)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🎵</div>
          <p className="text-gray-600 mb-4">No songs found</p>
          <Button 
            onClick={() => setShowAddSong(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Your First Song
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSongs.map((song) => {
            const category = MUSIC_CATEGORIES[song.category] || { 
              name: song.category, 
              icon: '🎵', 
              color: 'bg-gray-100 text-gray-800' 
            };
            
            return (
              <Card key={song.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{category.icon}</div>
                    
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
                              <Music className="h-4 w-4" />
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
                        </div>
                      </div>

                      {song.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{song.notes}</p>
                        </div>
                      )}

                      {/* External Links */}
                      {(song.spotifyUrl || song.youtubeUrl) && (
                        <div className="mt-3 flex gap-2">
                          {song.spotifyUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(song.spotifyUrl, '_blank')}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <span className="text-sm">♪</span>
                              <span className="ml-1">Spotify</span>
                            </Button>
                          )}
                          {song.youtubeUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(song.youtubeUrl, '_blank')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <span className="text-sm">▶</span>
                              <span className="ml-1">YouTube</span>
                            </Button>
                          )}
                        </div>
                      )}
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

      {/* Add Song Modal */}
      {showAddSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl text-amber-800">Add Song</h3>
                <p className="text-amber-600">Add a song to your wedding playlist</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Song Title</label>
                  <input
                    type="text"
                    value={newSong.title}
                    onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Song title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Artist</label>
                  <input
                    type="text"
                    value={newSong.artist}
                    onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Artist name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Album (Optional)</label>
                  <input
                    type="text"
                    value={newSong.album}
                    onChange={(e) => setNewSong(prev => ({ ...prev, album: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Album name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newSong.duration}
                    onChange={(e) => setNewSong(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="3:45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Category</label>
                  <select
                    value={newSong.category}
                    onChange={(e) => setNewSong(prev => ({ ...prev, category: e.target.value as Song['category'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {Object.entries(MUSIC_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-amber-700 mb-2">Priority</label>
                  <select
                    value={newSong.priority}
                    onChange={(e) => setNewSong(prev => ({ ...prev, priority: e.target.value as Song['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="maybe">Maybe</option>
                    <option value="nice-to-have">Nice to Have</option>
                    <option value="must-have">Must Have</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Occasion</label>
                <input
                  list="occasions"
                  value={newSong.occasion}
                  onChange={(e) => setNewSong(prev => ({ ...prev, occasion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g. First dance, Processional"
                />
                <datalist id="occasions">
                  {SONG_OCCASIONS.map((occasion, index) => (
                    <option key={`occasion-${index}`} value={occasion} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Suggested By (Optional)</label>
                <input
                  type="text"
                  value={newSong.suggestedBy}
                  onChange={(e) => setNewSong(prev => ({ ...prev, suggestedBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Who suggested this song?"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Spotify URL (Optional)</label>
                <input
                  type="url"
                  value={newSong.spotifyUrl}
                  onChange={(e) => setNewSong(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="https://open.spotify.com/..."
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newSong.notes}
                  onChange={(e) => setNewSong(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Any special notes about this song"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLive"
                  checked={newSong.isLive}
                  onChange={(e) => setNewSong(prev => ({ ...prev, isLive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isLive" className="text-sm text-amber-700">
                  Requires live performance
                </label>
              </div>

              <div className="flex gap-3">
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
          </div>
        </div>
      )}

      {/* Music Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-lg text-amber-800 mb-4">🎵 Music Planning Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-amber-700 mb-2">Ceremony Music:</h4>
            <ul className="text-sm space-y-1">
              <li>• Choose meaningful songs for processional/recessional</li>
              <li>• Consider live musicians for ceremony</li>
              <li>• Plan 15-20 minutes of prelude music</li>
              <li>• Have backup tracks ready</li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-700 mb-2">Reception Music:</h4>
            <ul className="text-sm space-y-1">
              <li>• Mix genres to keep everyone dancing</li>
              <li>• Plan special moment songs (first dance, etc.)</li>
              <li>• Create do-not-play list for DJ</li>
              <li>• Consider guests' age range and preferences</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}