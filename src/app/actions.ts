'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mock auth - usually you'd use NextAuth
// For this MVP, we return a userId to be saved in a cookie or local storage
export async function registerUser(name: string, carNumber: string, carBrand: string, fuelType: string, password: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        carNumber,
        carBrand,
        fuelType,
        password, // In production, hash this!
      } as any,
    });
    return { success: true, user: { id: user.id, name: user.name, carNumber: user.carNumber, carBrand: user.carBrand, fuelType: user.fuelType } };
  } catch (error) {
    return { success: false, error: 'Registration failed. Car number might already exist.' };
  }
}

export async function loginUser(carNumber: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { carNumber },
  });

  if (user && user.password === password) {
    return { success: true, user: { id: user.id, name: user.name, carNumber: user.carNumber } };
  }
  return { success: false, error: 'Invalid car number or password' };
}

export async function getStations() {
  return prisma.station.findMany();
}

export async function logFuel(userId: string, stationId: string, liters: number) {
  try {
    const log = await prisma.fuelLog.create({
      data: {
        userId,
        stationId,
        liters,
      },
      include: {
        station: true,
        user: true,
      }
    });
    revalidatePath('/feed'); // Revalidate the feed page
    return { success: true, log };
  } catch (error) {
    return { success: false, error: 'Failed to log fuel.' };
  }
}

export async function getFuelLogs() {
  return prisma.fuelLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          carNumber: true,
          carBrand: true,
          fuelType: true,
        }
      },
      station: {
        select: {
          name: true,
        }
      }
    },
    take: 50,
  });
}
