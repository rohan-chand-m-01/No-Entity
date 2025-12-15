export interface Stop {
    name: string;
    lat: number;
    lng: number;
}

export interface Bus {
    busNo: string;
    routeId: string;
    routeName: string;
    speed: number;
    currentStopIndex: number;
    nextStopIndex: number;
    lat: number;
    lng: number;
    stops: Stop[];
    eta: number;     // in minutes
    distanceRemaining: number;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const busService = {
    async getAllBuses(): Promise<Bus[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/buses`);
            if (!response.ok) {
                throw new Error('Failed to fetch buses');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching buses:', error);
            return [];
        }
    },

    async getBus(busNo: string): Promise<Bus | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/bus/${busNo}`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching bus ${busNo}:`, error);
            return null;
        }
    },

    async getSMSFormat(busNo: string, lang: 'en' | 'kn' | 'hi' = 'en'): Promise<{ message: string } | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/bus/${busNo}/sms-format?lang=${lang}`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching SMS format:', error);
            return null;
        }
    },

    async sendSimulatedSms(phone: string, busNo: string, lang: 'en' | 'kn' | 'hi'): Promise<{ status: string; message: string } | null> {
        try {
            const response = await fetch(`http://localhost:5000/ivr/simulate-sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, busNo, lang })
            });

            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error('Error sending simulated SMS:', error);
            return null;
        }
    }
};
