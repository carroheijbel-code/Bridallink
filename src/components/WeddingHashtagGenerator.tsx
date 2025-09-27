import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface HashtagQuality {
  score: number;
  rating: 'excellent' | 'good' | 'okay' | 'needs work';
  reasons: string[];
}

export default function WeddingHashtagGenerator() {
  const [coupleNames, setCoupleNames] = useState({ person1: '', person2: '' });
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState<'romantic' | 'fun' | 'elegant' | 'modern' | 'rustic'>('romantic');
  const [customWords, setCustomWords] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Improved hashtag templates by style
  const hashtagTemplates = {
    romantic: {
      formats: [
        '{person1}And{person2}',
        '{person1}Loves{person2}',
        'Forever{person1}{person2}',
        '{person1}Hearts{person2}',
        'Eternal{person1}{person2}',
        '{person1}Adores{person2}',
        'Soulmate{person1}{person2}',
        '{person1}Cherishes{person2}',
        'Beloved{person1}{person2}',
        'Devoted{person1}{person2}'
      ],
      suffixes: ['Forever', 'Always', 'Love', 'Hearts', 'Romance', 'Bliss', 'Dreams', 'Magic', 'Destiny', 'Soulmates']
    },
    fun: {
      formats: [
        '{person1}And{person2}Party',
        '{person1}{person2}Fun',
        'Party{person1}{person2}',
        '{person1}Gets{person2}',
        '{person1}{person2}Bash',
        '{person1}{person2}Fiesta',
        'Celebrate{person1}{person2}',
        '{person1}{person2}Rocks',
        '{person1}{person2}Woohoo',
        'Epic{person1}{person2}'
      ],
      suffixes: ['Party', 'Fun', 'Bash', 'Fiesta', 'Joy', 'Woohoo', 'Rocks', 'Epic', 'Awesome', 'Amazing']
    },
    elegant: {
      formats: [
        '{person1}And{person2}Union',
        'The{person1}{person2}Wedding',
        '{person1}{person2}Elegance',
        '{person1}{person2}Affair',
        'Mr{person2}Mrs{person1}',
        '{person1}{person2}Grace',
        '{person1}{person2}Classic',
        '{person1}{person2}Timeless',
        'Refined{person1}{person2}',
        'Distinguished{person1}{person2}'
      ],
      suffixes: ['Elegance', 'Grace', 'Classic', 'Timeless', 'Refined', 'Luxury', 'Style', 'Chic', 'Divine', 'Exquisite']
    },
    modern: {
      formats: [
        '{person1}x{person2}',
        '{person1}Plus{person2}',
        'Team{person1}{person2}',
        '{person1}{person2}Vibes',
        '{person1}{person2}Goals',
        '{person1}{person2}Squad',
        '{person1}{person2}Life',
        'Power{person1}{person2}',
        '{person1}{person2}Mode',
        'Next{person1}{person2}'
      ],
      suffixes: ['Vibes', 'Goals', 'Squad', 'Life', 'Mode', 'Fresh', 'Next', 'Power', 'Strong', 'Bold']
    },
    rustic: {
      formats: [
        '{person1}And{person2}Country',
        '{person1}{person2}Barn',
        '{person1}{person2}Farm',
        '{person1}{person2}Countryside',
        '{person1}{person2}Vintage',
        '{person1}{person2}Cozy',
        '{person1}{person2}Natural',
        'Homegrown{person1}{person2}',
        'Country{person1}{person2}',
        'Rustic{person1}{person2}'
      ],
      suffixes: ['Country', 'Barn', 'Farm', 'Vintage', 'Cozy', 'Natural', 'Simple', 'Homespun', 'Earthy', 'Wild']
    }
  };

  // Helper functions for better name processing
  const processName = (name: string) => {
    const cleaned = name.replace(/\s+/g, '').toLowerCase();
    return {
      original: name.trim(),
      cleaned: cleaned,
      capitalized: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      firstPart: cleaned.slice(0, Math.ceil(cleaned.length / 2)),
      lastPart: cleaned.slice(Math.ceil(cleaned.length / 2)),
      vowels: cleaned.match(/[aeiou]/g) || [],
      consonants: cleaned.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
    };
  };

  const createRhymes = (name1: any, name2: any) => {
    const rhymes = [];
    
    // Common rhyming patterns
    const rhymePatterns = [
      { ending: 'ing', words: ['ring', 'bring', 'sing', 'thing'] },
      { ending: 'ed', words: ['wed', 'said', 'red', 'bed'] },
      { ending: 'ay', words: ['day', 'way', 'say', 'play'] },
      { ending: 'ove', words: ['love', 'dove', 'above'] },
      { ending: 'art', words: ['heart', 'start', 'part'] },
      { ending: 'ight', words: ['night', 'light', 'bright', 'sight'] }
    ];

    // Check if names end with common rhyming sounds
    rhymePatterns.forEach(pattern => {
      if (name1.cleaned.endsWith(pattern.ending.slice(1)) || name2.cleaned.endsWith(pattern.ending.slice(1))) {
        pattern.words.forEach(word => {
          rhymes.push(`${name1.capitalized}${name2.capitalized}${word.charAt(0).toUpperCase() + word.slice(1)}`);
          rhymes.push(`${word.charAt(0).toUpperCase() + word.slice(1)}${name1.capitalized}${name2.capitalized}`);
        });
      }
    });

    return rhymes;
  };

  const createWordplay = (name1: any, name2: any) => {
    const wordplay = [];
    
    // Portmanteau combinations (blend names)
    if (name1.cleaned.length >= 3 && name2.cleaned.length >= 3) {
      wordplay.push(name1.firstPart + name2.lastPart);
      wordplay.push(name2.firstPart + name1.lastPart);
      wordplay.push(name1.cleaned.slice(0, 2) + name2.cleaned.slice(-2));
      wordplay.push(name2.cleaned.slice(0, 2) + name1.cleaned.slice(-2));
    }

    // Sound-based combinations
    if (name1.cleaned.length >= 4 && name2.cleaned.length >= 4) {
      wordplay.push(name1.cleaned.slice(0, 3) + name2.cleaned.slice(2));
      wordplay.push(name2.cleaned.slice(0, 3) + name1.cleaned.slice(2));
    }

    // Unique combinations with common wedding words
    const weddingWords = ['Love', 'Heart', 'Soul', 'Unity', 'Bond', 'Tie', 'Knot', 'Ring', 'Vow'];
    weddingWords.forEach(word => {
      if (name1.cleaned.length + word.length <= 15) {
        wordplay.push(name1.capitalized + word);
        wordplay.push(word + name1.capitalized);
      }
      if (name2.cleaned.length + word.length <= 15) {
        wordplay.push(name2.capitalized + word);
        wordplay.push(word + name2.capitalized);
      }
    });

    return wordplay.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).filter(w => w.length <= 20);
  };

  const createPuns = (name1: any, name2: any) => {
    const puns = [];
    
    // Name-based puns
    const punPatterns = [
      { pattern: 'Meant2Be', names: [name1.capitalized, name2.capitalized] },
      { pattern: 'Perfect2gether', names: [name1.capitalized, name2.capitalized] },
      { pattern: 'Better2gether', names: [name1.capitalized, name2.capitalized] },
      { pattern: 'Happily4Ever', names: [name1.capitalized, name2.capitalized] },
      { pattern: '2Become1', names: [name1.capitalized, name2.capitalized] }
    ];

    punPatterns.forEach(pun => {
      puns.push(`${pun.names[0]}${pun.names[1]}${pun.pattern}`);
      puns.push(`${pun.pattern}${pun.names[0]}${pun.names[1]}`);
    });

    // Letter/sound play
    if (name1.cleaned[0] === name2.cleaned[0]) {
      puns.push(`Double${name1.cleaned[0].toUpperCase()}Love`);
      puns.push(`${name1.cleaned[0].toUpperCase()}Squared`);
    }

    return puns.filter(p => p.length <= 25);
  };

  // Rate hashtag quality
  const rateHashtag = (hashtag: string): HashtagQuality => {
    let score = 100;
    let reasons = [];
    
    // Length scoring
    if (hashtag.length <= 12) {
      score += 20;
      reasons.push('Short & memorable');
    } else if (hashtag.length <= 18) {
      score += 10;
    } else if (hashtag.length > 25) {
      score -= 30;
      reasons.push('Too long');
    }
    
    // Readability
    const wordCount = (hashtag.match(/[A-Z]/g) || []).length;
    if (wordCount >= 2 && wordCount <= 4) {
      score += 15;
      reasons.push('Good readability');
    } else if (wordCount > 5) {
      score -= 10;
      reasons.push('Hard to read');
    }
    
    // No numbers (except years)
    if (/\d{4}/.test(hashtag)) {
      score += 5;
    } else if (/\d/.test(hashtag)) {
      score -= 15;
      reasons.push('Contains numbers');
    }
    
    // Creativity bonus
    if (hashtag.includes('Love') || hashtag.includes('Heart') || hashtag.includes('Forever')) {
      score += 5;
      reasons.push('Romantic');
    }
    
    if (hashtag.includes('And') || hashtag.includes('Plus') || hashtag.includes('X')) {
      score += 3;
    }
    
    // Penalize generic patterns
    if (hashtag.includes('Wedding') && hashtag.length > 15) {
      score -= 5;
    }
    
    // Cap the score
    score = Math.max(0, Math.min(100, score));
    
    return { 
      score, 
      rating: score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'okay' : 'needs work',
      reasons: reasons.slice(0, 2) // Show top 2 reasons
    };
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'okay': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'excellent': return '🌟';
      case 'good': return '👍';
      case 'okay': return '👌';
      default: return '⚠️';
    }
  };

  // Generate hashtags based on inputs
  const generateHashtags = () => {
    if (!coupleNames.person1 || !coupleNames.person2) {
      alert('Please enter both names to generate hashtags!');
      return;
    }

    const name1 = processName(coupleNames.person1);
    const name2 = processName(coupleNames.person2);
    
    const templates = hashtagTemplates[style];
    const newHashtags: string[] = [];

    // 1. Enhanced template-based hashtags
    templates.formats.forEach(format => {
      const hashtag = format
        .replace(/{person1}/g, name1.capitalized)
        .replace(/{person2}/g, name2.capitalized);
      newHashtags.push(`#${hashtag}`);
    });

    // 2. Creative combinations
    const rhymes = createRhymes(name1, name2);
    rhymes.forEach(rhyme => newHashtags.push(`#${rhyme}`));

    const wordplay = createWordplay(name1, name2);
    wordplay.forEach(play => newHashtags.push(`#${play}`));

    const puns = createPuns(name1, name2);
    puns.forEach(pun => newHashtags.push(`#${pun}`));

    // 3. Modern variations
    newHashtags.push(`#${name1.capitalized}X${name2.capitalized}`);
    newHashtags.push(`#${name1.capitalized}Plus${name2.capitalized}`);
    newHashtags.push(`#${name1.capitalized}And${name2.capitalized}Forever`);
    newHashtags.push(`#Team${name1.capitalized}${name2.capitalized}`);
    newHashtags.push(`#${name1.capitalized}${name2.capitalized}Adventure`);
    newHashtags.push(`#${name1.capitalized}${name2.capitalized}Story`);
    newHashtags.push(`#${name1.capitalized}${name2.capitalized}Journey`);

    // 4. Short and memorable options
    if (name1.cleaned.length <= 4 && name2.cleaned.length <= 4) {
      newHashtags.push(`#${name1.capitalized}${name2.capitalized}`);
      newHashtags.push(`#${name1.capitalized}And${name2.capitalized}`);
      newHashtags.push(`#${name1.capitalized}Love${name2.capitalized}`);
    }

    // 5. Suffix variations (improved)
    const shortSuffixes = templates.suffixes.slice(0, 5); // Use fewer, better suffixes
    shortSuffixes.forEach(suffix => {
      if ((name1.cleaned + name2.cleaned + suffix).length <= 20) {
        newHashtags.push(`#${name1.capitalized}${name2.capitalized}${suffix}`);
      }
    });

    // 6. Date-based hashtags (improved)
    if (weddingDate) {
      const date = new Date(weddingDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      newHashtags.push(`#${name1.capitalized}${name2.capitalized}${year}`);
      newHashtags.push(`#${name1.capitalized}${name2.capitalized}${month}${year}`);
      if ((name1.cleaned + name2.cleaned).length <= 12) {
        newHashtags.push(`#${name1.capitalized}${name2.capitalized}${month}${day}${year}`);
      }
    }

    // 7. Location-based hashtags (improved)
    if (location.trim()) {
      const locationClean = location.replace(/\s+/g, '').toLowerCase();
      const locationCap = locationClean.charAt(0).toUpperCase() + locationClean.slice(1);
      if ((name1.cleaned + name2.cleaned + locationClean).length <= 20) {
        newHashtags.push(`#${name1.capitalized}${name2.capitalized}${locationCap}`);
        newHashtags.push(`#${name1.capitalized}${name2.capitalized}In${locationCap}`);
      }
      newHashtags.push(`#${locationCap}Wedding`);
      newHashtags.push(`#${locationCap}Love`);
    }

    // 8. Theme-based hashtags (improved)
    if (theme.trim()) {
      const themeClean = theme.replace(/\s+/g, '').toLowerCase();
      const themeCap = themeClean.charAt(0).toUpperCase() + themeClean.slice(1);
      if ((name1.cleaned + name2.cleaned + themeClean).length <= 20) {
        newHashtags.push(`#${name1.capitalized}${name2.capitalized}${themeCap}`);
      }
      newHashtags.push(`#${themeCap}Wedding`);
      newHashtags.push(`#${themeCap}Love`);
    }

    // 9. Custom words (improved)
    if (customWords.trim()) {
      const words = customWords.split(',').map(w => w.trim()).filter(w => w);
      words.forEach(word => {
        const wordClean = word.replace(/\s+/g, '').toLowerCase();
        const wordCap = wordClean.charAt(0).toUpperCase() + wordClean.slice(1);
        if ((name1.cleaned + name2.cleaned + wordClean).length <= 20) {
          newHashtags.push(`#${name1.capitalized}${name2.capitalized}${wordCap}`);
        }
        newHashtags.push(`#${wordCap}Wedding`);
        newHashtags.push(`#${name1.capitalized}${wordCap}`);
        newHashtags.push(`#${name2.capitalized}${wordCap}`);
      });
    }

    // Remove duplicates, filter length, and sort by quality
    const uniqueHashtags = [...new Set(newHashtags)]
      .filter(tag => tag.length >= 4 && tag.length <= 30) // Reasonable length limits
      .sort((a, b) => {
        // Prioritize shorter, more memorable hashtags
        const scoreA = rateHashtag(a).score;
        const scoreB = rateHashtag(b).score;
        return scoreB - scoreA;
      });
    
    setGeneratedHashtags(uniqueHashtags.slice(0, 40)); // Limit to 40 best hashtags
  };

  // Toggle hashtag selection
  const toggleHashtagSelection = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  // Copy selected hashtags to clipboard
  const copyToClipboard = () => {
    if (selectedHashtags.length === 0) {
      alert('Please select some hashtags first!');
      return;
    }

    const hashtagText = selectedHashtags.join(' ');
    navigator.clipboard.writeText(hashtagText).then(() => {
      alert(`📋 Copied ${selectedHashtags.length} hashtags to clipboard!\n\nReady to paste into your social media posts.`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = hashtagText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`📋 Copied ${selectedHashtags.length} hashtags to clipboard!`);
    });
  };

  // Share hashtags
  const shareHashtags = () => {
    if (selectedHashtags.length === 0) {
      alert('Please select some hashtags first!');
      return;
    }

    const hashtagText = selectedHashtags.join(' ');
    const shareText = `Check out our wedding hashtags: ${hashtagText}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Hashtags',
        text: shareText
      });
    } else {
      copyToClipboard();
    }
  };

  // Get style color
  const getStyleColor = (currentStyle: string) => {
    const colors = {
      romantic: 'bg-pink-100 text-pink-800',
      fun: 'bg-yellow-100 text-yellow-800',
      elegant: 'bg-purple-100 text-purple-800',
      modern: 'bg-blue-100 text-blue-800',
      rustic: 'bg-green-100 text-green-800'
    };
    return colors[currentStyle as keyof typeof colors] || colors.romantic;
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-2xl">#️⃣</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-800">Wedding Hashtag Generator</h1>
          <p className="text-amber-700">Create memorable, unique hashtags for your wedding social media posts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Tell Us About Your Wedding</h2>
              
              <div className="space-y-4">
                {/* Couple Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={coupleNames.person1}
                      onChange={(e) => setCoupleNames({...coupleNames, person1: e.target.value})}
                      placeholder="e.g., Sarah"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Second Name *</label>
                    <input
                      type="text"
                      value={coupleNames.person2}
                      onChange={(e) => setCoupleNames({...coupleNames, person2: e.target.value})}
                      placeholder="e.g., Tom"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                {/* Wedding Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Style</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {Object.keys(hashtagTemplates).map((styleOption) => (
                      <button
                        key={styleOption}
                        onClick={() => setStyle(styleOption as any)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          style === styleOption 
                            ? getStyleColor(styleOption)
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{showAdvanced ? '🔽' : '▶️'}</span>
                  <span>Advanced Options</span>
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 pt-2 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Mallorca, Paris, Beach"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                      <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="e.g., Vintage, Garden, Boho"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Words</label>
                      <input
                        type="text"
                        value={customWords}
                        onChange={(e) => setCustomWords(e.target.value)}
                        placeholder="e.g., Adventure, Forever, Destiny (comma separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Add special words that are meaningful to your relationship
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateHashtags}
                  disabled={!coupleNames.person1 || !coupleNames.person2}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  ✨ Generate Smart Hashtags
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">💡 Hashtag Best Practices</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Keep it under 20 characters - easier to remember and type</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Avoid numbers unless they're meaningful (like your wedding year)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Test how it sounds when spoken aloud - guests will share it verbally</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Check uniqueness on Instagram, Twitter, and TikTok before finalizing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Include it on save-the-dates, invitations, and wedding signage</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Choose 1-2 primary hashtags - too many confuses guests</span>
                </div>
              </div>
            </div>

            {/* Uniqueness Checker */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">🔍 Check Hashtag Uniqueness</h3>
              <div className="space-y-3 text-sm text-yellow-700">
                <div>Before finalizing your hashtag, search for it on these platforms:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.open('https://www.instagram.com/explore/tags/', '_blank')}
                    className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-2"
                  >
                    <span>📸</span>
                    <span>Instagram</span>
                  </button>
                  <button
                    onClick={() => window.open('https://twitter.com/search', '_blank')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <span>🐦</span>
                    <span>Twitter/X</span>
                  </button>
                  <button
                    onClick={() => window.open('https://www.tiktok.com/search', '_blank')}
                    className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <span>📱</span>
                    <span>TikTok</span>
                  </button>
                  <button
                    onClick={() => window.open('https://www.facebook.com/hashtag/', '_blank')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <span>👥</span>
                    <span>Facebook</span>
                  </button>
                </div>
                <div className="text-xs italic">
                  💡 A good wedding hashtag should have few or no existing posts on social media
                </div>
              </div>
            </div>
          </div>

          {/* Generated Hashtags */}
          <div className="space-y-6">
            {generatedHashtags.length > 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-amber-800">Your Smart Wedding Hashtags</h2>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedHashtags.length} selected
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Action Buttons */}
                  {selectedHashtags.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <span>📋</span>
                        Copy Selected
                      </button>
                      <button
                        onClick={shareHashtags}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <span>📤</span>
                        Share
                      </button>
                      <button
                        onClick={() => setSelectedHashtags([])}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Hashtag Grid with Quality Ratings */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {generatedHashtags.map((hashtag, index) => {
                        const quality = rateHashtag(hashtag);
                        return (
                          <button
                            key={index}
                            onClick={() => toggleHashtagSelection(hashtag)}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              selectedHashtags.includes(hashtag)
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{hashtag}</span>
                                  <span className="text-sm">{getRatingIcon(quality.rating)}</span>
                                  <span className={`text-xs font-medium ${getRatingColor(quality.rating)}`}>
                                    {quality.rating.toUpperCase()}
                                  </span>
                                </div>
                                {quality.reasons.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {quality.reasons.join(' • ')}
                                  </div>
                                )}
                              </div>
                              {selectedHashtags.includes(hashtag) && (
                                <span className="text-blue-600">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select All/None */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedHashtags([...generatedHashtags])}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedHashtags([])}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Select None
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {generatedHashtags.length === 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">#️⃣</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Create Amazing Hashtags!</h3>
                <p className="text-gray-600 mb-4">
                  Enter your names and click "Generate Smart Hashtags" to create personalized, high-quality wedding hashtags
                </p>
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold mb-2">Our AI creates hashtags with:</div>
                    <div className="flex flex-wrap gap-2 justify-center text-xs">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Creative wordplay</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Quality ratings</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Memorable combinations</span>
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Perfect length</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Guide */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
              <h3 className="font-semibold text-pink-800 mb-3">📱 Using Your Hashtags</h3>
              <div className="space-y-3 text-sm text-pink-700">
                <div>
                  <div className="font-semibold mb-1">📸 Instagram & Facebook</div>
                  <div>Perfect for engagement photos, wedding prep, and the big day</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">🐦 Twitter/X</div>
                  <div>Great for live updates and quick announcements</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">📺 TikTok</div>
                  <div>Use in wedding prep videos and ceremony highlights</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">📌 Pinterest</div>
                  <div>Tag inspiration boards and wedding planning pins</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Hashtags Preview */}
        {selectedHashtags.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">Selected Hashtags Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-700 mb-2">Ready to copy and paste:</div>
              <div className="font-mono text-sm bg-white border rounded p-3 break-all">
                {selectedHashtags.join(' ')}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              💡 These hashtags are sorted by quality - the best ones are at the top!
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}