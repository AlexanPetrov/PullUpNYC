import { useState } from 'react';
import { useRouter } from 'next/router'; 
import ErrorModal from '@/components/ErrorModal'; 
import styles from '@/pages/auth/register.module.css';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegistration = async (formData) => {
    const payload = {
      email: formData.email,
      password: formData.password,
    };
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to register');
      }
  
      const { user: newUser } = await response.json();
  
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem("isLoggedIn", "true");
  
      window.dispatchEvent(new Event('authChange'));
  
      router.push('/'); 
    } catch (error) {
      console.error('Error registering:', error.message);
      setError(error.message);
      setIsErrorModalVisible(true);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegistration(formData);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Register</h2>
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
        <button type="submit" className={styles.button}>Register</button>
      </form>
      {isErrorModalVisible && <ErrorModal message={error} onClose={handleCloseErrorModal} />}
    </div>
  );
};

export default Register;
