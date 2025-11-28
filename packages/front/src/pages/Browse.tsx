import { useEffect, useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Star, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/api/user.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInitials } from '@/utils/get-initials';
import { logout } from '@/utils/auth';
import { Loadder } from '@/components/ui/Loadder';
import { useGetProfile } from '@/hooks/useGetProfile';
import { QUERY_KEYS } from '@/utils/utils';
import { FilterUsersDto, UserProfile } from '@/types/user';
import { AdvancedSearchCard } from '@/components/AdvancedSearchCard';
import { calculateDistanceKm } from '@/utils/distance';

export default function Browse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: isPendingConnectedUser,
    error: errorConnectedUser,
    data,
  } = useGetProfile();

  const [connectedUser, setConnectedUser] = useState<UserProfile>();
  const [users, setUsers] = useState<UserProfile[]>([]);

  const notificationList = connectedUser?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50]);
  const [fameRange, setFameRange] = useState<[number, number]>([1, 1000]);
  const [sortBy, setSortBy] = useState('distance');
  const [appliedFilters, setAppliedFilters] = useState<FilterUsersDto>({});
  const [appliedCity, setAppliedCity] = useState('');
  const [appliedSort, setAppliedSort] = useState('distance');
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 500]);
  const [appliedDistanceRange, setAppliedDistanceRange] =
    useState<[number, number]>([0, 500]);
  const [tags, setTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);

  const {
    isPending,
    data: userList,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.BROWSE_USERS, appliedFilters],
    queryFn: async () => {
      const res = await userApi.filterUsers(appliedFilters);
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const fetchedUsers: UserProfile[] = await res.json();
      return fetchedUsers;
    },
  });

  const currentUser = users ? users[0] : null;

  const handleLike = () => {
    toast.success(`You liked ${currentUser.firstName}! 💕`);
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BROWSE_USERS],
    });
  };

  const handlePass = () => {};

  const viewProfile = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  const getTagMatchScore = useCallback(
    (user: UserProfile) => {
      if (!appliedTags.length) {
        return 0;
      }
      const userTags = user.tags?.map((tag) => tag.toLowerCase()) ?? [];
      return appliedTags.reduce(
        (score, tag) => (userTags.includes(tag) ? score + 1 : score),
        0,
      );
    },
    [appliedTags],
  );

  const matchesSelectedTags = useCallback(
    (user: UserProfile) => {
      if (!appliedTags.length) {
        return true;
      }
      const userTags = user.tags?.map((tag) => tag.toLowerCase()) ?? [];
      return appliedTags.some((tag) => userTags.includes(tag));
    },
    [appliedTags],
  );

  const handleAdvancedSearch = () => {
    const filterDto: FilterUsersDto = {
      age: {
        from: ageRange[0],
        to: ageRange[1],
      },
      fameRating: {
        from: fameRange[0],
        to: fameRange[1],
      },
    };
    if (tags.length) {
      filterDto.tags = tags;
    }

    setAppliedFilters(filterDto);
    setAppliedSort(sortBy);
    setAppliedDistanceRange(distanceRange);
    setAppliedTags(tags);

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BROWSE_USERS],
    });
  };

  useEffect(() => {
    if (data) {
      setConnectedUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (!userList) {
      return;
    }

    let processedUsers = [...userList];

    if (connectedUser?.location) {
      processedUsers = processedUsers.filter((user) => {
        const distanceKm = calculateDistanceKm(
          connectedUser.location,
          user.location,
        );
        if (distanceKm === Number.POSITIVE_INFINITY) {
          return appliedDistanceRange[1] >= 500;
        }
        return (
          distanceKm >= appliedDistanceRange[0] &&
          distanceKm <= appliedDistanceRange[1]
        );
      });
    }

    if (appliedTags.length) {
      processedUsers = processedUsers.filter(matchesSelectedTags);
    }

    processedUsers.sort((a, b) => {
      switch (appliedSort) {
        case 'age':
          return (a.age ?? 0) - (b.age ?? 0);
        case 'fame':
          return b.fameRating - a.fameRating;
        case 'tags':
          return getTagMatchScore(b) - getTagMatchScore(a);
        case 'distance':
        default: {
          if (!connectedUser?.location) {
            return 0;
          }
          const distanceA = calculateDistanceKm(
            connectedUser.location,
            a.location,
          );
          const distanceB = calculateDistanceKm(
            connectedUser.location,
            b.location,
          );
          return distanceA - distanceB;
        }
      }
    });

    setUsers(processedUsers);
  }, [userList, appliedCity, connectedUser, appliedDistanceRange, appliedSort, appliedTags, getTagMatchScore]);

  useEffect(() => {
    if (error || errorConnectedUser) {
      logout(navigate);
    }
  }, [error, errorConnectedUser, navigate]);

  if (isPending || isPendingConnectedUser) {
    return <Loadder />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pt-20">
        <Navigation
          unreadNotifications={unreadNotifications}
          unreadMessages={unreadMessages}
        />
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-muted-foreground">No more profiles to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 space-y-6">
        <Card className="relative overflow-hidden shadow-card">
          {/* Profile Image */}
          <div className="relative h-[500px] md:h-[600px]">
            {currentUser.photos.length ? (
              <img
                src={currentUser.photos[0].preview}
                alt={currentUser.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-3xl font-bold text-primary">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Info Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-background/20 backdrop-blur-sm hover:bg-background/30"
              onClick={viewProfile}
            >
              <Info className="w-5 h-5 text-white" />
            </Button>

            {/* Online Status */}
            {currentUser.isOnline && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Online</span>
              </div>
            )}

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {currentUser.firstName}, {currentUser.age}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.location?.city ?? 'unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">
                    {currentUser.fameRating}
                  </span>
                </div>
              </div>

              <p className="text-sm mb-3 line-clamp-2">{currentUser.bio}</p>

              <div className="flex flex-wrap gap-2">
                {currentUser.tags.slice(0, 5).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-background/20 backdrop-blur-sm text-white border-white/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 p-6 bg-card">
            <Button
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 hover:border-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
              onClick={handlePass}
            >
              <X className="w-19 h-10 text-destructive" />
            </Button>

            {!!connectedUser?.photos.length && (
              <Button
                size="icon"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                onClick={handleLike}
              >
                <Heart className="w-10 h-10 fill-primary text-primary" />
              </Button>
            )}
          </div>
        </Card>
        <AdvancedSearchCard
          ageRange={ageRange}
          setAgeRange={setAgeRange}
          fameRange={fameRange}
          setFameRange={setFameRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          distanceRange={distanceRange}
          setDistanceRange={setDistanceRange}
          tags={tags}
          setTags={setTags}
          onSubmit={handleAdvancedSearch}
        />
      </div>
    </div>
  );
}
