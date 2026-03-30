import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [droneData, setDroneData] = useState({});

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to backend socket:', newSocket.id);
    });

    newSocket.on('NEW_ALERT', (alert) => {
      console.log('New real-time alert:', alert);
      setAlerts((prev) => [alert, ...prev]);
      
      // Basic OS notification if supported
      if (Notification.permission === 'granted') {
        new Notification('Sentinel Grid Alert', {
          body: `${alert.severity.toUpperCase()}: ${alert.title}`,
        });
      }
    });

    newSocket.on('DRONE_UPDATE', (data) => {
      setDroneData((prev) => ({
        ...prev,
        [data.droneId]: data,
      }));
    });

    return () => newSocket.close();
  }, []);

  const resolveAlert = (alertId) => {
    setAlerts((prev) => prev.filter(a => a._id !== alertId));
  };

  return (
    <SocketContext.Provider value={{ socket, alerts, droneData, resolveAlert }}>
      {children}
    </SocketContext.Provider>
  );
};
