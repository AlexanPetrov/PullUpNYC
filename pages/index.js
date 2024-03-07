import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Home.module.css";
import SearchBar from "@/components/SearchBar";
import PullUpCard from "@/components/PullUpCard";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const Home = () => {
  const [barsData, setBarsData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    fetchBarsData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentUserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentUserLocation);
          setMapCenter(currentUserLocation);
        },
        () => {
          setLocationError(
            "Unable to access your location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchBarsData = async () => {
    try {
      const response = await fetch("/api/locations/routes");
      const data = await response.json();
      setBarsData(data);
    } catch (error) {
      console.error("Failed to fetch bars data:", error);
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const filteredData = barsData.filter((bar) =>
        bar.zip.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredData);
      updateMapCenter(filteredData);
    } else {
      setSearchResults(barsData);
      setMapCenter(userLocation || { lat: 40.7128, lng: -74.006 });
    }
    if (!searchTerm) {
      setSearchResults([]);
    }
  };

  const handleReset = () => {
    setSearchResults([]);
    setMapCenter(userLocation || { lat: 40.7128, lng: -74.006 });
    setSelectedLocation(null);
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3958.8;
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lng1 - lng2;
    const radTheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  };

  const handleDisplayAll = () => {
    if (!userLocation) {
      alert(
        "User location not available. Please ensure location services are enabled and try again."
      );
      return;
    }

    const filteredData = barsData.filter((bar) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        bar.latitude,
        bar.longitude
      );
      return distance <= 1;
    });

    if (filteredData.length === 0) {
      alert(
        "There are no locations available within one mile of your current location."
      );
      setSearchResults([]);
    } else {
      setSearchResults(filteredData);
      const averageLat =
        filteredData.reduce((acc, curr) => acc + curr.latitude, 0) /
        filteredData.length;
      const averageLng =
        filteredData.reduce((acc, curr) => acc + curr.longitude, 0) /
        filteredData.length;
      setMapCenter({ lat: averageLat, lng: averageLng });
    }
  };

  const updateMapCenter = (filteredData) => {
    if (filteredData.length === 1) {
      setMapCenter({
        lat: filteredData[0].latitude,
        lng: filteredData[0].longitude,
      });
    } else if (filteredData.length > 1) {
      let avgLat = 0,
        avgLng = 0;
      filteredData.forEach((bar) => {
        avgLat += bar.latitude;
        avgLng += bar.longitude;
      });
      avgLat /= filteredData.length;
      avgLng /= filteredData.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter({ lat: location.latitude, lng: location.longitude });
  };

  const handleCalculateDistance = (barLocation) => {
    if (!userLocation) {
      alert("User location not available.");
      return;
    }
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      barLocation.latitude,
      barLocation.longitude
    );
    alert(`Distance: ${distance.toFixed(2)} miles`);
  };

  const averageWalkingSpeedPerMile = 3.1;

  const handleCalculateTime = (barLocation) => {
    if (!userLocation) {
      alert("User location not available.");
      return;
    }
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      barLocation.latitude,
      barLocation.longitude
    );
    const time = distance / averageWalkingSpeedPerMile;

    const timeInMinutes = time * 60;
    alert(`Approximate walking time: ${timeInMinutes.toFixed(0)} minutes`);
  };

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        onDisplayAll={handleDisplayAll}
      />
      {locationError && (
        <div className={styles.errorMessage}>{locationError}</div>
      )}
      <div className={styles.mainContainer}>
        <div className={styles.mapContainer}>
          <Map
            locations={searchResults}
            center={mapCenter}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
          />
        </div>
        <div className={styles.cardsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <PullUpCard
                key={result.id}
                name={result.name}
                address={result.address}
                description={result.description}
                rating={result.rating}
                onDirectionClick={() => handleLocationSelect(result)}
                onCalculateDistance={() => handleCalculateDistance(result)}
                onCalculateTime={() => handleCalculateTime(result)}
              />
            ))
          ) : (
            <div className={styles.placeholder}>
              <h1 className={styles.pitchTitle}>
                Welcome to Our Pull-Up Bar Location Finder!
              </h1>
              <div className={styles.pitchContainer}>
                {/* <p className={styles.pitch}>
                  Skip the gym drama, grab a bar, and pull up to a fitter you -
                  because who needs a gym membership when you have gravity?
                </p> */}
                {/* <p className={styles.pitch}>
                  Who needs a gym membership when you have gravity?!
                </p> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
