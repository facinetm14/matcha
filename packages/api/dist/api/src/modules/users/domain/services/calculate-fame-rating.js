"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFameRating = calculateFameRating;
const LIKE_WEIGHT = 2;
const VIEW_WEIGHT = 1;
const DEFAULT_RATE = 1;
const MAX_RATE = 1000;
function calculateFameRating(user) {
    const fameRating = Math.floor(user.likedBy.length / LIKE_WEIGHT + user.viewedBy.length / VIEW_WEIGHT);
    if (fameRating < DEFAULT_RATE) {
        return 1;
    }
    return fameRating < MAX_RATE ? fameRating : MAX_RATE;
}
