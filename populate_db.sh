#!/bin/sh

cd packages/api
npm i
npm run migrate:up
npm run seed
