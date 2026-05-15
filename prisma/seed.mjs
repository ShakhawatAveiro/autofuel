import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create some mock stations
  const stations = [
    {
      name: 'EcoFuel City Center',
      latitude: 51.505, // London mock
      longitude: -0.09,
      address: '123 Main St, Central London',
    },
    {
      name: 'Green Energy West',
      latitude: 51.51,
      longitude: -0.1,
      address: '45 West Rd, London',
    },
    {
      name: 'Auto Fuel East',
      latitude: 51.5,
      longitude: -0.08,
      address: '88 East Blvd, London',
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
