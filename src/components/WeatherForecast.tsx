import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Umbrella,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitationChance: number;
    windSpeed: number;
  }>;
  weddingDayForecast?: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitationChance: number;
    windSpeed: number;
    detailed: {
      morning: { temp: number; condition: string; chance: number };
      afternoon: { temp: number; condition: string; chance: number };
      evening: { temp: number; condition: string; chance: number };
    };
  };
}

interface WeatherRecommendation {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  tips: string[];
}

export default function WeatherForecast() {
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [weddingLocation, setWeddingLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<WeatherRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load wedding data from localStorage
  useEffect(() => {
    try {
      const savedWeddingDate = localStorage.getItem('weddingDate');
      if (savedWeddingDate) {
        setWeddingDate(savedWeddingDate);
      }
      
      // Try to get venue location from existing data
      const savedDocuments = localStorage.getItem('weddingDocuments');
      if (savedDocuments) {
        const documents = JSON.parse(savedDocuments);
        const venueDoc = documents.find((doc: any) => doc.category === 'venue');
        if (venueDoc && venueDoc.notes) {
          // Extract location from venue notes or name
          setWeddingLocation(venueDoc.vendorName || venueDoc.notes.split(',')[0] || '');
        }
      }
    } catch (error) {
      console.error('Error loading wedding data:', error);
    }
  }, []);

  // Mock weather data (in real app, this would call a weather API)
  const fetchWeatherData = async () => {
    if (!weddingLocation) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock weather data based on date proximity
    const daysUntilWedding = weddingDate ? 
      Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const isWeddingSoon = daysUntilWedding <= 14;
    
    // Generate realistic mock data
    const baseTemp = 18; // Base temperature in Celsius
    const seasonal = Math.sin((new Date().getMonth() - 3) * Math.PI / 6) * 10;
    
    const mockData: WeatherData = {
      location: weddingLocation,
      current: {
        temperature: Math.round(baseTemp + seasonal + (Math.random() - 0.5) * 6),
        condition: ['sunny', 'partly-cloudy', 'cloudy', 'light-rain'][Math.floor(Math.random() * 4)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        visibility: Math.round(8 + Math.random() * 7),
        uvIndex: Math.round(3 + Math.random() * 6)
      },
      forecast: Array.from({ length: 14 }, (_, i) => {
        const tempVar = (Math.random() - 0.5) * 8;
        return {
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          high: Math.round(baseTemp + seasonal + tempVar + 3),
          low: Math.round(baseTemp + seasonal + tempVar - 3),
          condition: ['sunny', 'partly-cloudy', 'cloudy', 'light-rain', 'rain'][Math.floor(Math.random() * 5)],
          precipitationChance: Math.round(Math.random() * 60),
          windSpeed: Math.round(5 + Math.random() * 15)
        };
      })
    };

    // Add detailed wedding day forecast if date is within range
    if (isWeddingSoon && weddingDate) {
      const weddingDayData = mockData.forecast.find(day => day.date === weddingDate);
      if (weddingDayData) {
        mockData.weddingDayForecast = {
          ...weddingDayData,
          detailed: {
            morning: {
              temp: weddingDayData.low + 2,
              condition: weddingDayData.condition,
              chance: Math.max(0, weddingDayData.precipitationChance - 20)
            },
            afternoon: {
              temp: weddingDayData.high,
              condition: weddingDayData.condition,
              chance: weddingDayData.precipitationChance
            },
            evening: {
              temp: weddingDayData.high - 4,
              condition: weddingDayData.condition === 'rain' ? 'cloudy' : weddingDayData.condition,
              chance: Math.max(0, weddingDayData.precipitationChance - 10)
            }
          }
        };
      }
    }

    setWeatherData(mockData);
    setLastUpdated(new Date().toLocaleTimeString());
    generateRecommendations(mockData);
    setIsLoading(false);
  };

  const generateRecommendations = (data: WeatherData) => {
    const recs: WeatherRecommendation[] = [];
    
    if (data.weddingDayForecast) {
      const wedding = data.weddingDayForecast;
      
      // Rain recommendations
      if (wedding.precipitationChance > 60) {
        recs.push({
          type: 'warning',
          title: 'High Chance of Rain',
          message: `${wedding.precipitationChance}% chance of rain on your wedding day`,
          tips: [
            'Consider renting a covered venue or tent',
            'Provide umbrellas for guests',
            'Plan indoor photo locations as backup',
            'Choose waterproof makeup and hairstyles',
            'Have a rain contingency plan for outdoor ceremonies'
          ]
        });
      } else if (wedding.precipitationChance > 30) {
        recs.push({
          type: 'info',
          title: 'Possible Light Rain',
          message: `${wedding.precipitationChance}% chance of light rain`,
          tips: [
            'Keep a few umbrellas handy',
            'Consider a backup indoor location',
            'Waterproof your makeup',
            'Beautiful rain photos can be romantic!'
          ]
        });
      }

      // Temperature recommendations
      if (wedding.high > 25) {
        recs.push({
          type: 'info',
          title: 'Warm Weather Expected',
          message: `High of ${wedding.high}°C - perfect for outdoor celebrations`,
          tips: [
            'Provide fans or cooling stations for guests',
            'Consider lighter fabric choices',
            'Ensure adequate shade for outdoor areas',
            'Plan for extra hydration stations',
            'Schedule photos during cooler morning/evening hours'
          ]
        });
      } else if (wedding.low < 10) {
        recs.push({
          type: 'info',
          title: 'Cool Weather Expected',
          message: `Low of ${wedding.low}°C - consider warmth for guests`,
          tips: [
            'Provide blankets or pashminas for guests',
            'Consider heating options for outdoor areas',
            'Plan for jacket/wrap storage',
            'Hot beverages would be appreciated',
            'Indoor backup locations are advisable'
          ]
        });
      }

      // Wind recommendations
      if (wedding.windSpeed > 20) {
        recs.push({
          type: 'warning',
          title: 'Windy Conditions',
          message: `Wind speeds up to ${wedding.windSpeed} km/h expected`,
          tips: [
            'Secure all outdoor decorations',
            'Choose wind-resistant hairstyles',
            'Consider weighted tablecloths',
            'Have backup plans for outdoor elements',
            'Be prepared for hair touch-ups'
          ]
        });
      }

      // Perfect weather
      if (wedding.precipitationChance < 20 && wedding.high > 18 && wedding.high < 26 && wedding.windSpeed < 15) {
        recs.push({
          type: 'success',
          title: 'Perfect Wedding Weather!',
          message: 'Ideal conditions for your outdoor celebration',
          tips: [
            'Perfect for outdoor photos all day',
            'Great weather for garden parties',
            'Comfortable for all guests',
            'Ideal for outdoor ceremonies'
          ]
        });
      }
    }

    setRecommendations(recs);
  };

  const getWeatherIcon = (condition: string, size: string = 'h-6 w-6') => {
    switch (condition) {
      case 'sunny': return <Sun className={`${size} text-yellow-500`} />;
      case 'partly-cloudy': return <Cloud className={`${size} text-gray-400`} />;
      case 'cloudy': return <Cloud className={`${size} text-gray-500`} />;
      case 'light-rain': return <CloudDrizzle className={`${size} text-blue-500`} />;
      case 'rain': return <CloudRain className={`${size} text-blue-600`} />;
      case 'thunderstorm': return <CloudLightning className={`${size} text-purple-600`} />;
      case 'snow': return <CloudSnow className={`${size} text-blue-300`} />;
      default: return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getConditionText = (condition: string) => {
    const conditions: Record<string, string> = {
      'sunny': 'Sunny',
      'partly-cloudy': 'Partly Cloudy',
      'cloudy': 'Cloudy',
      'light-rain': 'Light Rain',
      'rain': 'Rain',
      'thunderstorm': 'Thunderstorm',
      'snow': 'Snow'
    };
    return conditions[condition] || 'Unknown';
  };

  const daysUntilWedding = weddingDate ? 
    Math.max(0, Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Sun className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Weather Forecast</h1>
        <p className="text-amber-700">Plan your perfect day with accurate weather predictions</p>
      </div>

      {/* Setup Section */}
      <Card className="p-6">
        <h3 className="text-lg text-amber-800 mb-4">Wedding Details</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-amber-700 mb-2">Wedding Date</label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm text-amber-700 mb-2">Wedding Location</label>
            <input
              type="text"
              value={weddingLocation}
              onChange={(e) => setWeddingLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="City or venue name"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={fetchWeatherData}
              disabled={!weddingLocation || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Cloud className="h-4 w-4 mr-2" />
              )}
              Get Forecast
            </Button>
          </div>
        </div>

        {daysUntilWedding !== null && (
          <div className="bg-rose-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-600" />
              <span className="text-rose-800">
                {daysUntilWedding === 0 ? 'Your wedding is today!' :
                 daysUntilWedding === 1 ? 'Your wedding is tomorrow!' :
                 `${daysUntilWedding} days until your wedding`}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Current Weather */}
      {weatherData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Current Weather</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{weatherData.location}</span>
              {lastUpdated && (
                <span className="text-xs">• Updated {lastUpdated}</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getWeatherIcon(weatherData.current.condition, 'h-12 w-12')}
              </div>
              <div className="text-3xl text-gray-800 mb-1">{weatherData.current.temperature}°C</div>
              <div className="text-sm text-gray-600">{getConditionText(weatherData.current.condition)}</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Humidity: {weatherData.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Wind: {weatherData.current.windSpeed} km/h</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Visibility: {weatherData.current.visibility} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-orange-500" />
                <span className="text-sm">UV Index: {weatherData.current.uvIndex}</span>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm" onClick={fetchWeatherData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Wedding Day Detailed Forecast */}
      {weatherData?.weddingDayForecast && (
        <Card className="p-6 border-2 border-rose-200 bg-rose-50">
          <h3 className="text-lg text-amber-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Wedding Day Forecast - {new Date(weatherData.weddingDayForecast.date).toLocaleDateString()}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <h4 className="text-amber-700 mb-2">Morning</h4>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(weatherData.weddingDayForecast.detailed.morning.condition, 'h-8 w-8')}
              </div>
              <div className="text-xl text-gray-800">{weatherData.weddingDayForecast.detailed.morning.temp}°C</div>
              <div className="text-sm text-gray-600">{weatherData.weddingDayForecast.detailed.morning.chance}% rain</div>
            </div>

            <div className="text-center">
              <h4 className="text-amber-700 mb-2">Afternoon</h4>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(weatherData.weddingDayForecast.detailed.afternoon.condition, 'h-8 w-8')}
              </div>
              <div className="text-xl text-gray-800">{weatherData.weddingDayForecast.detailed.afternoon.temp}°C</div>
              <div className="text-sm text-gray-600">{weatherData.weddingDayForecast.detailed.afternoon.chance}% rain</div>
            </div>

            <div className="text-center">
              <h4 className="text-amber-700 mb-2">Evening</h4>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(weatherData.weddingDayForecast.detailed.evening.condition, 'h-8 w-8')}
              </div>
              <div className="text-xl text-gray-800">{weatherData.weddingDayForecast.detailed.evening.temp}°C</div>
              <div className="text-sm text-gray-600">{weatherData.weddingDayForecast.detailed.evening.chance}% rain</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span>High: {weatherData.weddingDayForecast.high}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              <span>Low: {weatherData.weddingDayForecast.low}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Umbrella className="h-4 w-4 text-purple-500" />
              <span>Rain Chance: {weatherData.weddingDayForecast.precipitationChance}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>Wind: {weatherData.weddingDayForecast.windSpeed} km/h</span>
            </div>
          </div>
        </Card>
      )}

      {/* 14-Day Forecast */}
      {weatherData && (
        <Card className="p-6">
          <h3 className="text-lg text-amber-800 mb-4">14-Day Forecast</h3>
          <div className="grid gap-2">
            {weatherData.forecast.map((day, index) => {
              const isWeddingDay = day.date === weddingDate;
              return (
                <div 
                  key={day.date} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isWeddingDay ? 'bg-rose-100 border-2 border-rose-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 text-sm">
                      {index === 0 ? 'Today' : 
                       index === 1 ? 'Tomorrow' : 
                       new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(day.condition)}
                      <span className="text-sm">{getConditionText(day.condition)}</span>
                    </div>
                    {isWeddingDay && (
                      <Badge className="bg-rose-600 text-white">Wedding Day</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Umbrella className="h-3 w-3 text-blue-500" />
                      <span>{day.precipitationChance}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3 text-gray-500" />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-800">{day.high}°</span>
                      <span className="text-gray-500">{day.low}°</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg text-amber-800">Weather Recommendations</h3>
          {recommendations.map((rec, index) => (
            <Card key={index} className={`p-6 ${
              rec.type === 'warning' ? 'border-orange-300 bg-orange-50' :
              rec.type === 'success' ? 'border-green-300 bg-green-50' :
              'border-blue-300 bg-blue-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {rec.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                  {rec.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {rec.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${
                    rec.type === 'warning' ? 'text-orange-800' :
                    rec.type === 'success' ? 'text-green-800' :
                    'text-blue-800'
                  }`}>{rec.title}</h4>
                  <p className="text-sm text-gray-700 mb-3">{rec.message}</p>
                  <ul className="text-sm space-y-1">
                    {rec.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Weather Tips */}
      <Card className="p-6 bg-gradient-to-r from-sky-50 to-blue-50">
        <h3 className="text-lg text-amber-800 mb-4">Weather Planning Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-amber-700 mb-2">General Guidelines:</h4>
            <ul className="text-sm space-y-1">
              <li>• Check weather 2 weeks before for initial planning</li>
              <li>• Make backup plans for outdoor elements</li>
              <li>• Consider seasonal weather patterns</li>
              <li>• Plan guest comfort for expected conditions</li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-700 mb-2">Last-Minute Preparations:</h4>
            <ul className="text-sm space-y-1">
              <li>• Check detailed forecast 3 days before</li>
              <li>• Communicate weather plans to vendors</li>
              <li>• Prepare emergency kits (umbrellas, blankets)</li>
              <li>• Remember: any weather can create beautiful memories!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}