import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data & seeding database with Dhaka locations...');
  
  // Clean existing logs and stations
  await prisma.fuelLog.deleteMany();
  await prisma.station.deleteMany();
  
  const stations = [
    {
      name: 'AutoFuel Banani',
      latitude: 23.7937,
      longitude: 90.4066,
      address: 'Road 11, Banani, Dhaka',
    },
    {
      name: 'AutoFuel Dhanmondi',
      latitude: 23.7461,
      longitude: 90.3742,
      address: 'Satmasjid Road, Dhanmondi, Dhaka',
    },
    {
      name: 'AutoFuel Motijheel',
      latitude: 23.7330,
      longitude: 90.4172,
      address: 'Motijheel C/A, Dhaka',
    },
    {
      name: 'AutoFuel Uttara',
      latitude: 23.8759,
      longitude: 90.3795,
      address: 'Sector 3, Uttara, Dhaka',
    }
  ];

  for (const s of stations) {
    await prisma.station.create({
      data: s,
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
