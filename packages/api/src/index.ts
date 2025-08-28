import express from 'express';
import { runApp } from './app';

const server = express();
const PORT = process.env.SERVER_PORT || 5000;

runApp(server, +PORT);