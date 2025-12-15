const app = require('./app');
const simulator = require('./services/simulator');

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`\nLocalGati Realtime Engine running on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log(` - GET /api/buses`);
    console.log(` - GET /api/bus/:busNo`);
    console.log(` - GET /api/bus/:busNo/sms-format?lang=en|kn|hi`);

    // Start the simulation loop
    simulator.startSimulation();
});
