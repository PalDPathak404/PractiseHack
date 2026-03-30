import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../context/SocketContext';
import { Cpu, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getDroneIcon = (status) => L.divIcon({
  html: `<div class="relative">
    <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]">
      <div class="w-3 h-3 bg-primary rounded-full"></div>
    </div>
    <div class="absolute -top-1 -right-1 w-2 h-2 rounded-full ${status === 'low_battery' ? 'bg-red-500' : 'bg-green-500'}"></div>
  </div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const getAlertIcon = (severity) => L.divIcon({
  html: `<div class="relative">
    <div class="w-10 h-10 ${severity === 'critical' ? 'bg-red-500/30' : 'bg-orange-500/30'} rounded-full flex items-center justify-center border-2 ${severity === 'critical' ? 'border-red-500' : 'border-orange-500'} animate-ping">
    </div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'} rounded-full border border-white shadow-lg"></div>
  </div>`,
  className: 'custom-div-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const MapUpdater = ({ droneData, alerts }) => {
  const map = useMap();
  
  useEffect(() => {
    const activeAlerts = alerts.filter(a => a.status === 'active');
    if (activeAlerts.length > 0) {
      const latest = activeAlerts[0];
      map.flyTo([latest.location.latitude, latest.location.longitude], 10, {
        duration: 1.5
      });
    }
  }, [alerts.length]);

  return null;
};

const DashboardMap = () => {
  const { droneData, alerts } = useSocket();
  const [center] = useState([30.0, 71.5]); // Specific simulated border region

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative bg-[#0c0c0c]">
      <MapContainer center={center} zoom={7} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Drones */}
        {Object.values(droneData).map((drone) => (
          <Marker 
            key={drone.droneId} 
            position={[drone.location.latitude, drone.location.longitude]} 
            icon={getDroneIcon(drone.status)}
          >
            <Popup className="custom-popup">
              <div className="p-2 font-sans bg-background text-white rounded-lg border border-white/10">
                <h3 className="font-bold text-primary mb-1">{drone.droneId}</h3>
                <div className="space-y-1 text-[10px] font-mono">
                  <p>ALTITUDE: {drone.altitude.toFixed(0)}m</p>
                  <p>BATTERY: {drone.battery}%</p>
                  <p>STATUS: <span className={drone.status === 'low_battery' ? 'text-red-500' : 'text-green-500'}>{drone.status}</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Alerts */}
        {alerts.filter(a => a.status === 'active').map((alert) => (
          <React.Fragment key={alert._id}>
            <Circle
              center={[alert.location.latitude, alert.location.longitude]}
              radius={8000}
              pathOptions={{ 
                color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b', 
                fillColor: alert.severity === 'critical' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.1,
                dashArray: '5, 10',
                className: 'animate-pulse'
              }}
            />
            <Marker 
              position={[alert.location.latitude, alert.location.longitude]}
              icon={getAlertIcon(alert.severity)}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <p className="font-bold text-red-500 uppercase text-xs">{alert.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{alert.description}</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
        
        <MapUpdater droneData={droneData} alerts={alerts} />
      </MapContainer>

      {/* Map Overlay Stats */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-white/10">
          <Navigation className="text-primary animate-pulse" size={16} />
          <span className="text-[10px] font-mono font-bold tracking-wider">{Object.keys(droneData).length} ASSETS LIVE</span>
        </div>
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-red-500/20 bg-red-500/5">
          <AlertTriangle className="text-danger animate-bounce" size={16} />
          <span className="text-[10px] font-mono font-bold tracking-wider text-danger">{alerts.filter(a => a.status === 'active').length} BREACHES</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
