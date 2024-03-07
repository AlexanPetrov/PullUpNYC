import { useState } from 'react';
import styles from '@/pages/auth/requestResetPassword.module.css';
import ErrorModal from '@/components/ErrorModal';

const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/requestResetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('If valid email provided, the reset link was sent!');
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.message);
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.email} htmlFor="email">Email:</label>
        <input
          className={styles.inputfield}
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Request Reset Password Link</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {showErrorModal && <ErrorModal message={message} onClose={handleCloseErrorModal} />}
    </div>
  );
};

export default RequestResetPassword;
