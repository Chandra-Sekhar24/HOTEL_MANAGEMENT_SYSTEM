export interface Staff {
    id?: number;
    name: string;
    email: string;
    phone: string;
    role?: 'ADMIN' | 'MANAGER' | 'RECEPTIONIST'; // Optional since Manager model doesn't have role
    hotel?: { id: number; name?: string }; // Match Manager model's hotel relationship
    hotelId?: number; // Keep for compatibility
    status?: 'ACTIVE' | 'INACTIVE';
    password?: string;
    username?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: Staff;
    role: string;
}


