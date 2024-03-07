import { useState } from 'react';
import styles from '@/pages/deleteAccount.module.css'; 
import { useRouter } from 'next/router'; 

const DeleteAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter(); 

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
      const response = await fetch('/api/auth/deleteAccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Account deleted successfully!");
        setFormData({ email: '', password: '' }); 
        router.push('/'); 
      } else {
        throw new Error('Failed to delete account.');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Delete Account</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Confirm Email" required className={styles.input} />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Confirm Password" required className={styles.input} />
        <button type="submit" className={styles.button}>Delete Account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
