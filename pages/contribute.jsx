import { useState } from 'react';
import styles from '@/pages/contribute.module.css'; 

const Contribute = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    zip: '',
    rating: '',
    latitude: '',
    longitude: '',
  });

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Location added successfully!");
        setFormData({
          name: '',
          address: '',
          description: '',
          zip: '',
          rating: '',
          latitude: '',
          longitude: '',
        });
      } else {
        throw new Error('Failed to add location.');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className={styles.formContainer}> 
      <h1 className={styles.title}>Add Location</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Location Name" required className={styles.input} />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className={styles.input} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className={styles.input}></textarea>
        <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" required className={styles.input} />
        <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" step="0.1" min="0" max="5" required className={styles.input} />
        <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" required className={styles.input} />
        <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" required className={styles.input} />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default Contribute;
