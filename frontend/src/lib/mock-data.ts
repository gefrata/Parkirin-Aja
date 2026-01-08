// mock-data.ts

// Interface yang diperbarui
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // Field tambahan untuk Politeknik Negeri Batam
  category?: 'dosen' | 'mahasiswa';
  nim?: string;
  phone?: string;
  role?: 'lecturer' | 'student' | 'admin';
  faculty?: string;
  study_program?: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github' | 'facebook' | 'apple';
  is_social?: boolean;
  created_at?: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  location: string;
  available_slots: number;
  total_slots: number;
  price_per_hour: number;
  available_count?: number;
  lat?: number;
  lng?: number;
  address?: string;
  type?: string;
  contact?: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  vehicle_number: string;
  entry_time: string;
  exit_time?: string;
  status: 'active' | 'completed' | 'cancelled';
  total_amount?: number;
  total_hours?: number;
  parking_lot_name?: string;
  parking_lot_id?: string;
  user_id?: number;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  color: string;
  type: 'car' | 'motorcycle' | 'suv' | 'truck' | 'ev';
  year: string;
  is_default: boolean;
  notes?: string;
  stnk_file?: File | string;
  stnk_status: 'pending' | 'verified' | 'rejected';
  stnk_verified_at?: string;
  stnk_rejection_reason?: string;
  created_at?: string;
  user_id?: number;
}

// Helper untuk delay simulasi API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper untuk mendapatkan fakultas dari NIM
const getFacultyFromNIM = (nim?: string): string => {
  if (!nim) return 'Politeknik Negeri Batam';
  const facultyCode = nim.split('-')[0];
  switch (facultyCode) {
    case '111': return 'Teknik Elektro';
    case '112': return 'Teknik Mesin';
    case '113': return 'Teknik Sipil';
    case '114': return 'Teknik Informatika';
    case '115': return 'Akuntansi';
    case '116': return 'Administrasi Bisnis';
    default: return 'Politeknik Negeri Batam';
  }
};

// Helper untuk mendapatkan program studi dari NIM
const getStudyProgramFromNIM = (nim?: string): string => {
  if (!nim) return '';
  const programCode = nim.split('-')[1]?.slice(0, 2);
  switch (programCode) {
    case '01': return 'Teknik Elektro';
    case '02': return 'Teknik Mesin';
    case '03': return 'Teknik Sipil';
    case '04': return 'Teknik Informatika';
    case '05': return 'Sistem Informasi';
    case '06': return 'Akuntansi';
    case '07': return 'Administrasi Bisnis';
    default: return '';
  }
};

// Helper untuk mendapatkan role dari kategori
const getRoleFromCategory = (category?: 'dosen' | 'mahasiswa'): 'lecturer' | 'student' => {
  return category === 'dosen' ? 'lecturer' : 'student';
};

// Helper untuk generate avatar
const generateAvatar = (seed: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

export const mockApi = {
  // Authentication - DIPERBARUI untuk support field baru
  login: async (username: string, password: string) => {
    await delay(800);
    
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    
    // Simulasi login untuk user yang sudah terdaftar
    // Cek jika ini format NIM (tanpa dash)
    const isNIMFormat = /^\d{12}$/.test(username);
    const isEmailFormat = username.includes('@');
    
    // Determine user category based on username pattern
    let category: 'dosen' | 'mahasiswa' = 'mahasiswa';
    let nim = '';
    let phone = '';
    
    if (isNIMFormat) {
      category = 'mahasiswa';
      nim = `${username.slice(0, 3)}-${username.slice(3, 8)}-${username.slice(8, 12)}`;
    } else if (username.includes('dosen') || username.includes('lecturer')) {
      category = 'dosen';
    }
    
    // Generate phone number based on username
    phone = `081-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    return {
      user: {
        id: 1,
        username: username,
        email: isEmailFormat ? username : `${username}@polibatam.ac.id`,
        first_name: isNIMFormat ? 'Student' : 'John',
        last_name: isNIMFormat ? 'Polibatam' : 'Doe',
        // Field baru
        category: category,
        nim: nim,
        phone: phone,
        role: getRoleFromCategory(category),
        faculty: getFacultyFromNIM(nim),
        study_program: getStudyProgramFromNIM(nim),
        avatar: generateAvatar(username),
        provider: 'email',
        is_social: false,
        created_at: new Date().toISOString()
      },
      token: 'mock-jwt-token-12345'
    };
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    // Field tambahan
    category?: 'dosen' | 'mahasiswa';
    nim?: string;
    phone?: string;
    role?: 'lecturer' | 'student';
  }) => {
    await delay(1000);
    
    // Validasi berdasarkan kategori
    if (userData.category === 'mahasiswa' && !userData.nim) {
      throw new Error('NIM is required for students');
    }
    
    if (userData.category === 'dosen' && userData.nim) {
      throw new Error('NIM should not be provided for lecturers');
    }
    
    // Generate data user lengkap
    const completeUserData = {
      id: Date.now(),
      ...userData,
      role: userData.role || getRoleFromCategory(userData.category),
      faculty: getFacultyFromNIM(userData.nim),
      study_program: getStudyProgramFromNIM(userData.nim),
      avatar: generateAvatar(userData.username),
      provider: 'email',
      is_social: false,
      created_at: new Date().toISOString()
    };
    
    // Simulasi penyimpanan ke "database"
    console.log('User registered:', completeUserData);
    
    return {
      user: completeUserData,
      token: 'mock-jwt-token-register'
    };
  },

  socialLogin: async (provider: string, socialData: any) => {
    await delay(800);
    
    const email = socialData.email || `${provider}_user@polibatam.ac.id`;
    const name = socialData.name || `${provider} User`;
    const [firstName, lastName = ''] = name.split(' ');
    
    // For social login, default to student
    const category: 'dosen' | 'mahasiswa' = 'mahasiswa';
    
    return {
      user: {
        id: Date.now(),
        username: email.split('@')[0],
        email,
        first_name: firstName,
        last_name: lastName,
        provider,
        is_social: true,
        // Field baru dengan nilai default
        category: category,
        nim: '',
        phone: `081-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'student',
        faculty: 'Politeknik Negeri Batam',
        study_program: '',
        avatar: socialData.avatar || generateAvatar(email),
        created_at: new Date().toISOString()
      }
    };
  },

  // User Profile
  updateProfile: async (userId: number, updates: Partial<User>) => {
    await delay(600);
    
    // Simulasi update profile
    const updatedUser = {
      id: userId,
      ...updates,
      // Auto-update derived fields
      role: updates.category ? getRoleFromCategory(updates.category) : undefined,
      faculty: updates.nim ? getFacultyFromNIM(updates.nim) : undefined,
      study_program: updates.nim ? getStudyProgramFromNIM(updates.nim) : undefined
    };
    
    console.log('Profile updated:', updatedUser);
    
    return {
      success: true,
      user: updatedUser
    };
  },

  // Dashboard Data - DIPERBARUI untuk Polibatam context
  getDashboardData: async (userId?: number) => {
    await delay(600);
    
    // Data khusus untuk Polibatam
    const parkingLots = [
      {
        id: '1',
        name: 'Parkir Motor Mahasiswa',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 50,
        total_slots: 100,
        price_per_hour: 5.00,
        available_count: 50,
        lat: 1.1192734391418258,
        lng: 104.04892479358956,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '2',
        name: 'Parkir Mobil Dosen',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 30,
        total_slots: 50,
        price_per_hour: 8.00,
        available_count: 30,
        lat: 1.11914418029728,
        lng: 104.04757399974409,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '3',
        name: 'Parkir Tamu',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 20,
        total_slots: 30,
        price_per_hour: 10.00,
        available_count: 20,
        lat: 1.118620135209624,
        lng: 104.04957741078941,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '4',
        name: 'Parkir Laboratorium',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 40,
        total_slots: 60,
        price_per_hour: 3.00,
        available_count: 40,
        lat: 1.1188372704864316,
        lng: 104.04922963532586,
        type: 'campus',
        contact: '0778-123456'
      }
    ];
    
    return {
      user_stats: {
        total_tickets: 24,
        active_tickets: 2,
        total_spent: 187.50,
        registered_vehicles: 3,
        user_category: 'mahasiswa' // atau 'dosen' berdasarkan user
      },
      parking_lots: parkingLots,
      recent_tickets: [
        {
          id: '1',
          ticket_number: 'TKT-PB-2024-001',
          vehicle_number: 'B 1234 XYZ',
          entry_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          parking_lot_name: 'Parkir Motor Mahasiswa',
          parking_lot_id: '1',
          user_id: userId
        },
        {
          id: '2',
          ticket_number: 'TKT-PB-2024-002',
          vehicle_number: 'D 5678 ABC',
          entry_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          exit_time: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          total_amount: 15.00,
          total_hours: 4,
          parking_lot_name: 'Parkir Mobil Dosen',
          parking_lot_id: '2',
          user_id: userId
        },
        {
          id: '3',
          ticket_number: 'TKT-PB-2024-003',
          vehicle_number: 'F 9012 DEF',
          entry_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          exit_time: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          total_amount: 32.00,
          total_hours: 4,
          parking_lot_name: 'Parkir Tamu',
          parking_lot_id: '3',
          user_id: userId
        }
      ]
    };
  },

  // Parking Lots - DIPERBARUI untuk Polibatam
  getParkingLots: async () => {
    await delay(500);
    
    return [
      {
        id: '1',
        name: 'Parkir Motor Mahasiswa',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 50,
        total_slots: 100,
        price_per_hour: 5.00,
        lat: 1.1192734391418258,
        lng: 104.04892479358956,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '2',
        name: 'Parkir Mobil Dosen',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 30,
        total_slots: 50,
        price_per_hour: 8.00,
        lat: 1.11914418029728,
        lng: 104.04757399974409,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '3',
        name: 'Parkir Tamu',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 20,
        total_slots: 30,
        price_per_hour: 10.00,
        lat: 1.118620135209624,
        lng: 104.04957741078941,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '4',
        name: 'Parkir Laboratorium',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 40,
        total_slots: 60,
        price_per_hour: 3.00,
        lat: 1.1188372704864316,
        lng: 104.04922963532586,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '5',
        name: 'Parkir Perpustakaan',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 25,
        total_slots: 40,
        price_per_hour: 4.00,
        lat: 1.119163447149722,
        lng: 104.04814331819291,
        type: 'campus',
        contact: '0778-123456'
      },
      {
        id: '6',
        name: 'Parkir Gedung Kuliah',
        location: 'Kampus Politeknik Negeri Batam',
        address: 'Jl. Ahmad Yani, Batam Kota, Batam',
        available_slots: 60,
        total_slots: 80,
        price_per_hour: 6.00,
        lat: 1.1191640137541905,
        lng: 104.04820303283891,
        type: 'campus',
        contact: '0778-123456'
      }
    ];
  },

  getParkingLotById: async (id: string) => {
    await delay(300);
    const lots = await mockApi.getParkingLots();
    return lots.find(lot => lot.id === id) || null;
  },

  // Tickets - DIPERBARUI untuk Polibatam
  getTickets: async (userId?: number) => {
    await delay(400);
    const dashboardData = await mockApi.getDashboardData(userId);
    return dashboardData.recent_tickets;
  },

  createTicket: async (ticketData: {
    parking_lot_id: string;
    vehicle_number: string;
    duration_hours: number;
    user_id?: number;
  }) => {
    await delay(800);
    
    // Get parking lot info
    const parkingLots = await mockApi.getParkingLots();
    const parkingLot = parkingLots.find(lot => lot.id === ticketData.parking_lot_id);
    
    const totalAmount = parkingLot ? parkingLot.price_per_hour * ticketData.duration_hours : 0;
    
    return {
      id: `TKT-PB-${Date.now()}`,
      ticket_number: `TKT-PB-${Date.now().toString().slice(-6)}`,
      vehicle_number: ticketData.vehicle_number,
      entry_time: new Date().toISOString(),
      status: 'active',
      total_amount: totalAmount,
      total_hours: ticketData.duration_hours,
      parking_lot_name: parkingLot?.name || 'Selected Parking',
      parking_lot_id: ticketData.parking_lot_id,
      user_id: ticketData.user_id
    };
  },

  // Vehicles - DIPERBARUI dengan interface baru
  getVehicles: async (userId?: number) => {
    await delay(300);
    
    return [
      {
        id: '1',
        license_plate: 'B 1234 XYZ',
        brand: 'Toyota',
        model: 'Camry',
        color: 'Black',
        type: 'car' as const,
        year: '2022',
        is_default: true,
        notes: 'Main family car',
        stnk_status: 'verified' as const,
        stnk_verified_at: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T12:00:00Z',
        user_id: userId
      },
      {
        id: '2',
        license_plate: 'B 5678 ABC',
        brand: 'Honda',
        model: 'CBR250RR',
        color: 'Red',
        type: 'motorcycle' as const,
        year: '2023',
        is_default: false,
        stnk_status: 'verified' as const,
        stnk_verified_at: '2024-02-20T14:45:00Z',
        created_at: '2024-02-01T10:30:00Z',
        user_id: userId
      },
      {
        id: '3',
        license_plate: 'B 9012 DEF',
        brand: 'Tesla',
        model: 'Model 3',
        color: 'White',
        type: 'ev' as const,
        year: '2023',
        is_default: false,
        notes: 'Electric vehicle',
        stnk_status: 'pending' as const,
        created_at: '2024-03-01T09:15:00Z',
        user_id: userId
      }
    ];
  },

  // Vehicle Management
  addVehicle: async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'user_id'>, userId?: number) => {
    await delay(800);
    
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleData,
      created_at: new Date().toISOString(),
      user_id: userId
    };
    
    console.log('Vehicle added:', newVehicle);
    
    return {
      success: true,
      vehicle: newVehicle
    };
  },

  updateVehicle: async (vehicleId: string, updates: Partial<Vehicle>) => {
    await delay(600);
    
    console.log('Vehicle updated:', vehicleId, updates);
    
    return {
      success: true,
      vehicle: { id: vehicleId, ...updates }
    };
  },

  deleteVehicle: async (vehicleId: string) => {
    await delay(400);
    
    console.log('Vehicle deleted:', vehicleId);
    
    return {
      success: true,
      message: 'Vehicle deleted successfully'
    };
  },

  // STNK Verification
  uploadSTNK: async (vehicleId: string, stnkFile: File, licensePlate: string) => {
    await delay(1200);
    
    console.log('STNK uploaded for vehicle:', vehicleId, licensePlate);
    
    return {
      success: true,
      message: 'STNK uploaded successfully',
      verification_status: 'pending',
      filename: `${licensePlate}_${Date.now()}.jpg`
    };
  },

  // User Management (untuk admin)
  getUsersByCategory: async (category?: 'dosen' | 'mahasiswa') => {
    await delay(700);
    
    const users = [
      {
        id: 1,
        username: '123456789012',
        email: 'student1@polibatam.ac.id',
        first_name: 'Budi',
        last_name: 'Santoso',
        category: 'mahasiswa' as const,
        nim: '123-45678-9012',
        phone: '081-2345-6789',
        role: 'student' as const,
        faculty: 'Teknik Informatika',
        study_program: 'Teknik Informatika'
      },
      {
        id: 2,
        username: 'dosen_ahmad',
        email: 'ahmad@polibatam.ac.id',
        first_name: 'Ahmad',
        last_name: 'Rahman',
        category: 'dosen' as const,
        phone: '081-3456-7890',
        role: 'lecturer' as const,
        faculty: 'Teknik Elektro'
      }
    ];
    
    if (category) {
      return users.filter(user => user.category === category);
    }
    
    return users;
  }
};