export type Gender = 'male' | 'female' | 'non-binary';
export type SexualPreference = 'male' | 'female' | 'both';

export interface UserProfile {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	age: number;
	gender: Gender;
	sexualPreference: SexualPreference;
	biography: string;
	tags: string[];
	photos: string[];
	profilePhoto: string;
	location: {
		city: string;
		lat: number;
		lng: number;
	};
	fameRating: number;
	isOnline: boolean;
	lastSeen?: Date;
	likedBy: string[];
	viewedBy: string[];
	blocked: string[];
	reported: boolean;
}

export interface Match {
	id: string;
	users: [string, string];
	createdAt: Date;
}

export interface Message {
	id: string;
	matchId: string;
	senderId: string;
	content: string;
	createdAt: Date;
	read: boolean;
}

export interface Notification {
	id: string;
	userId: string;
	type: 'like' | 'view' | 'message' | 'match' | 'unlike';
	fromUserId: string;
	read: boolean;
	createdAt: Date;
}
