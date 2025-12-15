export const ivrWelcome = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Welcome to TravelEasy. Press 1 for ETA, 2 for Location.");
        }, 300);
    });
};

export const ivrHandleKey = async (key: string): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (key === '1') resolve("The bus 189 is arriving in 6 minutes.");
            else if (key === '2') resolve("The bus 189 is currently at MG Road.");
            else resolve("Invalid input. Please press 1 or 2.");
        }, 300);
    });
};
