import buses from '../data/buses.json';

export interface Bus {
    busNo: string;
    lat: number;
    lng: number;
    area: string;
    eta: string;
    status: string;
}

export const getBusStatus = async (busNo: string): Promise<Bus | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bus = buses.find((b) => b.busNo === busNo);
            resolve(bus || null);
        }, 500); // Simulate network delay
    });
};
