'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* =========================
   FIX DEFAULT LEAFLET ICON
========================= */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

/* =========================
   SVG ICONS (Lucide-style)
========================= */
const ICONS: Record<string, string> = {
  motor: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6h-2l-1 3h-2"/>
      <path d="M6 6h6"/>
      <path d="M6 6l-2 4"/>
    </svg>
  `,
  mobil: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 13l2-5h14l2 5"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="16.5" cy="17.5" r="2.5"/>
    </svg>
  `,
  sepeda: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M5.5 17.5L9 10h4l2 4"/>
    </svg>
  `,
};

/* =========================
   TYPES
========================= */
interface ParkingLot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available_slots: number;
  total_slots: number;
  type: string;
  category: string;
  gate_access?: string;
}

interface LeafletMapProps {
  parkingLots: ParkingLot[];
  selectedLotId?: string;
  userLocation?: [number, number] | null;
  onSelectLot: (lotId: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  showDetails?: boolean;
}

/* =========================
   COMPONENT
========================= */
const LeafletMap: React.FC<LeafletMapProps> = ({
  parkingLots,
  selectedLotId,
  userLocation,
  onSelectLot,
  height = '500px',
  center = [1.119, 104.0485],
  zoom = 18,
  showDetails = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    /* INIT MAP */
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 17,
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, zoom);
    }

    /* CLEAR MARKERS */
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    /* PARKING MARKERS */
    parkingLots.forEach(lot => {
      const availability = lot.available_slots / lot.total_slots;
      const isSelected = lot.id === selectedLotId;

      let color = '#10b981';
      if (availability < 0.2) color = '#ef4444';
      else if (availability < 0.5) color = '#f59e0b';

      const iconHtml = `
        <div class="relative cursor-pointer"
             style="transform:${isSelected ? 'scale(1.2)' : 'scale(1)'}">
          <div
            style="
              width:40px;height:40px;
              border-radius:9999px;
              background:white;
              border:3px solid ${color};
              color:${color};
              display:flex;
              align-items:center;
              justify-content:center;
              box-shadow:0 6px 14px rgba(0,0,0,.15);
            ">
            ${ICONS[lot.type] ?? ICONS.motor}
          </div>
          ${
            isSelected
              ? `<div style="
                  position:absolute;
                  top:-4px;right:-4px;
                  width:14px;height:14px;
                  background:#3b82f6;
                  border-radius:9999px;
                  border:2px solid white;"></div>`
              : ''
          }
        </div>
      `;

      const marker = L.marker([lot.lat, lot.lng], {
        icon: L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        }),
      })
        .addTo(mapRef.current!)
        .bindPopup(
          showDetails
            ? `<strong>${lot.name}</strong><br/>${lot.available_slots}/${lot.total_slots} slot`
            : `<button onclick="window.dispatchEvent(new CustomEvent('selectParkingLot',{detail:'${lot.id}'}))"
                 style="width:100%;padding:8px;background:#2563eb;color:white;border-radius:6px">
                 Pilih Lokasi
               </button>`
        );

      marker.on('click', () => onSelectLot(lot.id));
      markersRef.current.push(marker);
    });

    /* USER LOCATION */
    if (userLocation) {
      const userMarker = L.marker(userLocation, {
        icon: L.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(mapRef.current!);

      markersRef.current.push(userMarker);
    }

    const handler = (e: any) => onSelectLot(e.detail);
    window.addEventListener('selectParkingLot', handler as any);

    return () => {
      window.removeEventListener('selectParkingLot', handler as any);
    };
  }, [parkingLots, selectedLotId, userLocation, center, zoom, onSelectLot, showDetails]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default LeafletMap;
