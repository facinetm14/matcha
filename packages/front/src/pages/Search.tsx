import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Heart, Info, LucideChevronLast } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '@/hooks/useGetProfile';
import { FilterUsersDto, UserProfile } from '@/types/user';
import { Loadder } from '@/components/ui/Loadder';
import { QUERY_KEYS } from '@/utils/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { logout } from '@/utils/auth';
import { getInitials } from '@/utils/get-initials';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AdvancedSearchCard } from '@/components/AdvancedSearchCard';
import { calculateDistanceKm } from '@/utils/distance';

const USERS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 5;

export default function Search() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: isPendingProfile,
    data: connectedUser,
    error: errorProfile,
  } = useGetProfile();

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50]);
  const [fameRange, setFameRange] = useState<[number, number]>([1, 1000]);
  const [sortBy, setSortBy] = useState('distance');
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 500]);
  const [appliedDistanceRange, setAppliedDistanceRange] =
    useState<[number, number]>([0, 500]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, data, error } = useQuery({
    queryKey: [QUERY_KEYS.FILTER_USERS],
    queryFn: async () => {
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
      if (appliedTags.length) {
        filterDto.tags = appliedTags;
      }
      const res = await userApi.filterUsers(filterDto);
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const users = await res.json();
      return users;
    },
  });

  const notificationList = connectedUser?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedDistanceRange(distanceRange);
    setAppliedTags(selectedTags);
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.FILTER_USERS],
      exact: true,
    });
  };

  useEffect(() => {
    if (error || errorProfile) {
      logout(navigate);
    }
  }, [error, errorProfile, navigate]);

  const getTagMatchScore = (user: UserProfile) => {
    if (!appliedTags.length) {
      return 0;
    }
    const userTags = user.tags?.map((tag) => tag.toLowerCase()) ?? [];
    return appliedTags.reduce(
      (score, tag) => (userTags.includes(tag) ? score + 1 : score),
      0,
    );
  };

  const matchesSelectedTags = (user: UserProfile) => {
    if (!appliedTags.length) {
      return true;
    }
    const userTags = user.tags?.map((tag) => tag.toLowerCase()) ?? [];
    return appliedTags.some((tag) => userTags.includes(tag));
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    let processedUsers = [...data];

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

    if (appliedTags.length) {
      processedUsers = processedUsers.filter(matchesSelectedTags);
    }

    processedUsers.sort((a, b) => {
      switch (sortBy) {
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

    setFilteredUsers(processedUsers);
  }, [
    data,
    appliedDistanceRange,
    connectedUser,
    sortBy,
    appliedTags,
  ]);

  if (isPendingProfile || isPending) {
    return <Loadder />;
  }

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );
  const shouldShowPagination = filteredUsers.length > USERS_PER_PAGE;
  const visiblePages = (() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const halfRange = Math.floor(MAX_VISIBLE_PAGES / 2);
    let startPage = currentPage - halfRange;
    let endPage = currentPage + halfRange;

    if (startPage < 1) {
      startPage = 1;
      endPage = MAX_VISIBLE_PAGES;
    } else if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - MAX_VISIBLE_PAGES + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  })();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-8">
        {/* Search Filters */}
        <AdvancedSearchCard
          ageRange={ageRange}
          setAgeRange={setAgeRange}
          fameRange={fameRange}
          setFameRange={setFameRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          distanceRange={distanceRange}
          setDistanceRange={setDistanceRange}
          tags={selectedTags}
          setTags={setSelectedTags}
          onSubmit={handleSearch}
        />

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden shadow-card hover:shadow-soft transition-all"
            >
              <div className="relative h-64">
                {user.photos.length ? (
                  <img
                    src={user.photos[0].preview}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-3xl font-bold text-primary">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
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
                    <span>{user.location?.city || 'unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-sm font-semibold">
                      {user.fameRating}
                    </span>
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
                  <Button
                    variant="outline"
                    className="flex-1 bg-gradient-romantic hover:bg-primary"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {shouldShowPagination && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Go to first page"
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  <LucideChevronLast className="rotate-180"/>
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {showStartEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {visiblePages.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    className={pageNumber === currentPage ? 'font-bold' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {showEndEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Go to last page"
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  <LucideChevronLast/>
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
