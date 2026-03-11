export interface Room {
    id: number;
    hotel: {id: number};
    roomType: {id: number; name: string};
    roomNumber: string;
    status: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED';
}