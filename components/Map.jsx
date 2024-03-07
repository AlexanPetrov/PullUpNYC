import { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import styles from '@/components/Map.module.css'; 

const containerStyle = {
  width: '500px',
  height: '360px'
};

function MyMapComponent({ locations, center, userLocation, selectedLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (userLocation && selectedLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route({
        origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new google.maps.LatLng(selectedLocation.latitude, selectedLocation.longitude),
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    } else {
      setDirectionsResponse(null); 
    }
  }, [userLocation, selectedLocation]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      addCenterOnMeButton(mapRef.current, userLocation);
    }
  }, [isLoaded, userLocation]);

  const addCenterOnMeButton = (map, userLocation) => {
    const centerControlDiv = document.createElement('div');
    CenterControl(centerControlDiv, map, userLocation);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
  };

  function CenterControl(controlDiv, map, userLocation) {
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center the map on your location';
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Me!';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
      map.setCenter(new google.maps.LatLng(userLocation.lat, userLocation.lng));
      map.setZoom(15);
    });
  }

  const updateMapBounds = () => {
    if (!mapRef.current || locations.length === 0) return;
  
    const bounds = new window.google.maps.LatLngBounds();
  
    locations.forEach(location => {
      bounds.extend(new window.google.maps.LatLng(location.latitude, location.longitude));
    });
  
    if (userLocation) {
      bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  
    mapRef.current.fitBounds(bounds);
  
    const listener = mapRef.current.addListener("idle", () => {
      if (mapRef.current.getZoom() > 15) mapRef.current.setZoom(15);
      window.google.maps.event.removeListener(listener);
    });
  };
  
  useEffect(() => {
    updateMapBounds();
  }, [locations, userLocation]); 
  

  if (loadError) return <div className={styles.errors}>Error loading maps...</div>;
  if (!isLoaded) {
    return (
      <div className={styles.mapWrapper}>
        <div className="loads">Loading Maps...</div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
        <div className="map-container" style={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={map => mapRef.current = map}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {locations.map(location => (
            <Marker
              key={location.id}
              position={{ 
                lat: parseFloat(location.latitude), 
                lng: parseFloat(location.longitude) 
              }}
              label={location.name}
            />
          ))}
          {userLocation && (
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              label="You!"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "white",
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default MyMapComponent;
