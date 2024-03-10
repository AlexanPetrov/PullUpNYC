import { useState } from 'react';
import Link from "next/link";
import ErrorModal from '@/components/ErrorModal'; 
import styles from '@/pages/auth/login.module.css';

const LogIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to log in');
      }

      const data = await response.json();  
      localStorage.setItem('user', JSON.stringify(data.user)); 

      localStorage.setItem("isLoggedIn", "true");
      window.location.href = '/';  
    } catch (error) {
      setError(error.message);
      setIsErrorModalVisible(true);
    }
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <div className={styles.signupContainer}> 
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={styles.email}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={styles.input} 
          />
        </div>
        <div>
          <label className={styles.password}>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className={styles.input} 
          />
        </div>
        <button type="submit" className={styles.button}>Login</button> 
      </form>
      <div className={styles.signupLink}>
        Don't have an account? <Link href="/auth/register">Register</Link>
      </div>
      <div className={styles.signupLink}> 
        Forgot your password? <Link href="/auth/requestResetPassword">Reset Password</Link>
      </div>
      {isErrorModalVisible && <ErrorModal message={error} onClose={handleCloseErrorModal} />}
    </div>
  );
};

export default LogIn;
