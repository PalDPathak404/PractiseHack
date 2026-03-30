const axios = require('axios');

const API_URL = 'http://localhost:5000/api/ingest';

const sendSensorData = async () => {
    const sensorTypes = ['motion', 'heat', 'seismic'];
    const type = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const value = type === 'motion' ? (Math.random() > 0.8 ? 1 : 0) : Math.floor(Math.random() * 60);

    const data = {
        sensorId: `SENSE-${Math.floor(Math.random() * 100)}`,
        type,
        location: {
            latitude: 25.5 + Math.random() * 5,
            longitude: 70.0 + Math.random() * 5,
        },
        value,
    };

    try {
        const response = await axios.post(`${API_URL}/sensor`, data);
        console.log(`[Sensor] ${type} sent:`, response.data.message);
    } catch (error) {
        console.error(`Error sending sensor data: ${error.message}`);
    }
};

const sendDroneTelemetry = async () => {
    const droneData = {
        droneId: `DRONE-${Math.floor(Math.random() * 5)}`,
        location: {
            latitude: 25.5 + Math.random() * 5,
            longitude: 70.0 + Math.random() * 5,
        },
        altitude: 50 + Math.random() * 50,
        battery: Math.floor(Math.random() * 100),
        status: ['patrolling', 'investigating', 'returning'][Math.floor(Math.random() * 3)],
    };

    try {
        const response = await axios.post(`${API_URL}/drone`, droneData);
        console.log(`[Drone] ${droneData.droneId} telemetry sent:`, response.data.message);
    } catch (error) {
        console.error(`Error sending drone telemetry: ${error.message}`);
    }
};

console.log('--- Sentinel Grid Simulator Started ---');
setInterval(sendSensorData, 3000);
setInterval(sendDroneTelemetry, 5000);
