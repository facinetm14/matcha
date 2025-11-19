import {
  Match,
  UserProfile,
  Message,
  Notification,
  UserStatus,
} from '@/types/user';

const firstNames = [
  'Emma',
  'Liam',
  'Olivia',
  'Noah',
  'Ava',
  'Ethan',
  'Sophia',
  'Mason',
  'Isabella',
  'William',
  'Mia',
  'James',
  'Charlotte',
  'Benjamin',
  'Amelia',
  'Lucas',
  'Harper',
  'Henry',
  'Evelyn',
  'Alexander',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
];
const cities = [
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Montpellier',
  'Bordeaux',
  'Lille',
];
const tags = [
  '#travel',
  '#fitness',
  '#foodie',
  '#art',
  '#music',
  '#movies',
  '#gaming',
  '#books',
  '#photography',
  '#yoga',
  '#hiking',
  '#cooking',
  '#dancing',
  '#fashion',
  '#tech',
  '#sports',
  '#netflix',
  '#coffee',
  '#wine',
  '#pets',
];

const bios = [
  'Adventure seeker and coffee enthusiast ☕✈️',
  'Life is better with good food and great company 🍝',
  'Passionate about art, music, and meaningful conversations',
  'Fitness junkie by day, Netflix binger by night 🏋️📺',
  'Looking for someone to explore the world with 🌍',
  'Foodie, bookworm, and hopeless romantic 📚❤️',
  "Let's make memories and laugh together",
  'Spontaneous adventures and deep conversations are my thing',
  'Music lover, wine enthusiast, life enjoyer 🎶🍷',
  'Seeking genuine connections in this digital world',
];

const generatePhotoUrl = (seed: number): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

export const generateMockUsers = (count: number = 50): UserProfile[] => {
  const users: UserProfile[] = [];

  for (let i = 0; i < count; i++) {
    const gender = i % 3 === 0 ? 'female' : i % 3 === 1 ? 'male' : 'other';
    users.push({
      id: `user-${i}`,
      username:
        `${firstNames[i % firstNames.length]}.${lastNames[i % lastNames.length]}`.toLowerCase(),
      email:
        `${firstNames[i % firstNames.length]}.${lastNames[i % lastNames.length]}@example.com`.toLowerCase(),
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      age: 22 + (i % 18),
      gender,
      sexualOrientation: ['female'],
      bio: bios[i % bios.length],
      tags: tags.sort(() => 0.5 - Math.random()).slice(0, 3 + (i % 4)),
      photos: Array.from({ length: 3 + (i % 3) }, (_, j) =>
        generatePhotoUrl(i * 10 + j),
      ),
      location: {
        city: cities[i % cities.length],
        lat: 48.8566 + (Math.random() - 0.5) * 2,
        lng: 2.3522 + (Math.random() - 0.5) * 2,
      },
      fameRating: 50 + Math.floor(Math.random() * 450),
      isOnline: i % 5 === 0,
      lastSeen:
        i % 5 !== 0
          ? new Date(Date.now() - Math.random() * 86400000 * 7)
          : undefined,
      likedBy: [],
      viewedBy: [],
      blocked: [],
      reported: false,
      status: UserStatus.VERIFIED,
      isFirstLogin: '',
      createdAt: undefined,
      updatedAt: undefined,
      profilePhoto: '',
    });
  }

  return users;
};

export const mockCurrentUser: UserProfile = {
  id: 'current-user',
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  age: 28,
  gender: 'male',
  sexualOrientation: ['female'],
  bio: 'Software developer who loves hiking and good coffee. Looking for someone special to share adventures with! ☕🏔️',
  tags: ['#tech', '#hiking', '#coffee', '#travel', '#photography'],
  photos: [
    generatePhotoUrl(1000),
    generatePhotoUrl(1001),
    generatePhotoUrl(1002),
    generatePhotoUrl(1003),
  ],
  profilePhoto: generatePhotoUrl(1000),
  location: {
    city: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
  },
  fameRating: 350,
  isOnline: true,
  likedBy: [],
  viewedBy: [],
  blocked: [],
  reported: false,
  status: UserStatus.VERIFIED,
  isFirstLogin: null,
};

export const mockUsers = generateMockUsers(50);

export const mockMatches: Match[] = [
  {
    id: 'match-1',
    users: ['current-user', 'user-5'],
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'match-2',
    users: ['current-user', 'user-12'],
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: 'match-3',
    users: ['current-user', 'user-18'],
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    matchId: 'match-1',
    senderId: 'user-5',
    content: 'Hey! How are you?',
    createdAt: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: 'msg-2',
    matchId: 'match-1',
    senderId: 'current-user',
    content: "Hi! I'm good, thanks! How about you?",
    createdAt: new Date(Date.now() - 3500000),
    read: true,
  },
  {
    id: 'msg-3',
    matchId: 'match-1',
    senderId: 'user-5',
    content: "Great! I saw you like hiking too, what's your favorite trail?",
    createdAt: new Date(Date.now() - 3400000),
    read: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'current-user',
    category: 'like',
    fromUserId: 'user-3',
    read: false,
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'notif-2',
    userId: 'current-user',
    category: 'view',
    fromUserId: 'user-7',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'notif-3',
    userId: 'current-user',
    category: 'match',
    fromUserId: 'user-18',
    read: true,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'notif-4',
    userId: 'current-user',
    category: 'message',
    fromUserId: 'user-5',
    read: false,
    createdAt: new Date(Date.now() - 600000),
  },
];
