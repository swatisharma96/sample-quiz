// lib/prisma.js

import { PrismaClient } from "@prisma/client";

// This ensures that we don't create multiple PrismaClient instances
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };