import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/pages/edit.module.css'; 
import EditLocationModal from '@/components/EditLocationModal';

const EditLocations = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [editLocation, setEditLocation] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          throw new Error('User ID not found');
        }
  
        const response = await fetch(`/api/locations/routes?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserLocations(data); 
        } else {
          throw new Error('Failed to fetch user locations');
        }
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };
  
    fetchUserLocations();
  }, []);
  

  const handleCheckboxChange = (event, locationId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedLocations(prevSelected => [...prevSelected, locationId]);
    } else {
      setSelectedLocations(prevSelected => prevSelected.filter(id => id !== locationId));
    }
  };

  const handleEdit = (location) => {
    setEditLocation(location);
  };

  const handleCloseEdit = () => {
    setEditLocation(null);
  };

  const handleUpdateLocation = (updatedLocation) => {
    const updatedLocations = userLocations.map(loc =>
      loc.id === updatedLocation.id ? updatedLocation : loc
    );
    setUserLocations(updatedLocations);
    setEditLocation(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/locations/routes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationIds: selectedLocations }),
      });
      if (response.ok) {
        setUserLocations(prevLocations =>
          prevLocations.filter(location => !selectedLocations.includes(location.id))
        );
        setSelectedLocations([]);
      } else {
        throw new Error('Failed to delete locations');
      }
    } catch (error) {
      console.error('Error deleting locations:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit My Locations</h1>
      <ul className={styles.locationList}>
        {userLocations.map((location) => (
          <li key={location.id}>
            <div className={styles.locationDetails}>
              <div>{location.name}</div>
            </div>
            <div className={styles.controls}>
              <input
                type="checkbox"
                checked={selectedLocations.includes(location.id)}
                onChange={(event) => handleCheckboxChange(event, location.id)}
              />
              <button onClick={() => handleEdit(location)} className={styles.editButton}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
      {editLocation && (
        <EditLocationModal
          location={editLocation}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateLocation}
        />
      )}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleDelete}
          disabled={selectedLocations.length === 0}
          className={styles.deleteButton}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default EditLocations;
