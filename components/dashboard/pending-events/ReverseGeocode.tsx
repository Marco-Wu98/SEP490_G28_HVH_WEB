import { useEffect, useState } from 'react';

interface ReverseGeocodeProps {
  lat: number;
  lng: number;
  children: (address: string) => JSX.Element;
}

export default function ReverseGeocode({
  lat,
  lng,
  children
}: ReverseGeocodeProps) {
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
        );
        const data = await res.json();
        setAddress(data.display_name || '');
      } catch {
        setAddress('');
      }
    }
    fetchAddress();
  }, [lat, lng]);

  return children(address);
}
