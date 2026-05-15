// Pure Frontend Mock Client Actions using localStorage
// This completely eliminates the backend database to prevent Vercel/Prisma serverless issues.

const STATIONS = [
  {
    id: '1',
    name: 'AutoFuel Banani',
    latitude: 23.7937,
    longitude: 90.4066,
    address: 'Road 11, Banani, Dhaka',
  },
  {
    id: '2',
    name: 'AutoFuel Dhanmondi',
    latitude: 23.7461,
    longitude: 90.3742,
    address: 'Satmasjid Road, Dhanmondi, Dhaka',
  },
  {
    id: '3',
    name: 'AutoFuel Motijheel',
    latitude: 23.7330,
    longitude: 90.4172,
    address: 'Motijheel C/A, Dhaka',
  },
  {
    id: '4',
    name: 'AutoFuel Uttara',
    latitude: 23.8759,
    longitude: 90.3795,
    address: 'Sector 3, Uttara, Dhaka',
  }
];

// Safe LocalStorage Helpers (Handling SSR hydration)
const getStorageItem = (key: string): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStorageItem = (key: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export async function registerUser(name: string, carNumber: string, carBrand: string, fuelType: string, password: string) {
  const users = getStorageItem('autofuel_users');
  
  // Check if car number already exists
  if (users.some((u: any) => u.carNumber === carNumber)) {
    return { success: false, error: 'Registration failed. Car number already exists.' };
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    carNumber,
    carBrand,
    fuelType,
    password,
  };

  users.push(newUser);
  setStorageItem('autofuel_users', users);

  return { 
    success: true, 
    user: { 
      id: newUser.id, 
      name: newUser.name, 
      carNumber: newUser.carNumber, 
      carBrand: newUser.carBrand, 
      fuelType: newUser.fuelType 
    } 
  };
}

export async function loginUser(carNumber: string, password: string) {
  const users = getStorageItem('autofuel_users');
  const user = users.find((u: any) => u.carNumber === carNumber && u.password === password);

  if (user) {
    return { 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        carNumber: user.carNumber, 
        carBrand: user.carBrand, 
        fuelType: user.fuelType 
      } 
    };
  }
  return { success: false, error: 'Invalid car number or password' };
}

export async function getStations() {
  return STATIONS;
}

export async function logFuel(userId: string, stationId: string, liters: number) {
  const users = getStorageItem('autofuel_users');
  const user = users.find((u: any) => u.id === userId);
  const station = STATIONS.find((s) => s.id === stationId);

  if (!user || !station) {
    return { success: false, error: 'User or Station not found.' };
  }

  const newLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    stationId,
    liters,
    createdAt: new Date().toISOString(),
    // Embed joined records instantly for simple retrieval
    user: {
      name: user.name,
      carNumber: user.carNumber,
      carBrand: user.carBrand,
      fuelType: user.fuelType
    },
    station: {
      name: station.name
    }
  };

  const logs = getStorageItem('autofuel_logs');
  logs.unshift(newLog); // Add to the beginning
  setStorageItem('autofuel_logs', logs);

  return { success: true, log: newLog };
}

export async function getFuelLogs() {
  return getStorageItem('autofuel_logs');
}
