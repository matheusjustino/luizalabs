#!/bin/bash

npx prisma generate
npx prisma migrate dev
npx prisma db pull
node dist/main.js
