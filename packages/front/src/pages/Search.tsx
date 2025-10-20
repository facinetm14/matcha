import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Search as SearchIcon, Heart, Info } from 'lucide-react';
import { mockUsers, mockNotifications, mockMessages } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [fameRange, setFameRange] = useState([0, 1000]);
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  const unreadMessages = mockMessages.filter(m => !m.read).length;

  const handleSearch = () => {
    let results = mockUsers.filter(user => {
      const ageMatch = user.age >= ageRange[0] && user.age <= ageRange[1];
      const fameMatch = user.fameRating >= fameRange[0] && user.fameRating <= fameRange[1];
      const cityMatch = !city || user.location.city.toLowerCase().includes(city.toLowerCase());
      return ageMatch && fameMatch && cityMatch;
    });

    // Sort results
    results = results.sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return a.age - b.age;
        case 'fame':
          return b.fameRating - a.fameRating;
        case 'distance':
        default:
          return 0; // Would calculate actual distance in real app
      }
    });

    setFilteredUsers(results);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} />
      
      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-8">
        {/* Search Filters */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Advanced Search</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                  <Slider
                    min={18}
                    max={80}
                    step={1}
                    value={ageRange}
                    onValueChange={setAgeRange}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Fame Rating: {fameRange[0]} - {fameRange[1]}</Label>
                  <Slider
                    min={0}
                    max={1000}
                    step={50}
                    value={fameRange}
                    onValueChange={setFameRange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="fame">Fame Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full mt-6 bg-gradient-romantic">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.slice(0, 12).map(user => (
            <Card key={user.id} className="overflow-hidden shadow-card hover:shadow-soft transition-all">
              <div className="relative h-64">
                <img
                  src={user.profilePhoto}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {user.isOnline && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-white text-xs">Online</span>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-bold mb-1">
                    {user.firstName}, {user.age}
                  </h3>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{user.location.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-sm font-semibold">{user.fameRating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button className="flex-1 bg-gradient-romantic">
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
