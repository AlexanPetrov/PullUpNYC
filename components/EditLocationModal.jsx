import { useState } from 'react';
import styles from '@/components/EditLocationModal.module.css'; 

const EditLocationModal = ({ location, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(location);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/locations/routes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onUpdate(formData);
        onClose(); 
      } else {
        throw new Error('Failed to update location.');
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Error updating location. Please try again.");
    }
  };

  return (
    <div className={styles.editLocationModal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2>Edit Location</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Location Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description:</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>ZIP Code:</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Rating:</label>
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Latitude:</label>
            <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Longitude:</label>
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className={styles.input} />
          </div>
          <button type="submit" className={styles.saveChangesButton}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditLocationModal;
