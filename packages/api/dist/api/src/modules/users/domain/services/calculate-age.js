"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = void 0;
const date_fns_1 = require("date-fns");
const calculateAge = (from, now) => {
    return (0, date_fns_1.differenceInYears)(now, from);
};
exports.calculateAge = calculateAge;
