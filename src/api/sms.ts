export const sendSms = async (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[SMS SENT]: ${message}`);
            resolve(true);
        }, 800);
    });
};
