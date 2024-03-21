import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/pages/auth/resetPassword.module.css';
import ErrorModal from '@/components/ErrorModal'; 

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false); 
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password, token }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage('Your password has been reset successfully.');
      setShowErrorModal(true);
      setTimeout(() => router.push('/auth/login'), 3000); // Redirect after 3 seconds
    } catch (error) {
      setMessage(error.message);
      setShowErrorModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Set New Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className={styles.passwordRequirements}>
          <p>Password requirements:</p>
          <ul>
            <li>8 or more chars long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>{"At least one special char: !@#$%^&*()-_=+[]{}|;:'\",.<>/? "}</li>
          </ul>
        </div>
        <button type="submit" className={styles.button}>Reset Password</button>
      </form>
      {showErrorModal && <ErrorModal message={message} onClose={() => setShowErrorModal(false)} />}
    </div>
  );
};

export default ResetPassword;





// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import styles from '@/pages/auth/resetPassword.module.css';
// import ErrorModal from '@/components/ErrorModal'; 

// const ResetPassword = () => {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [showErrorModal, setShowErrorModal] = useState(false); 
//   const router = useRouter();

//   const { token } = router.query;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setMessage("Passwords don't match.");
//       setShowErrorModal(true);
//       return;
//     }

//     try {
//       const response = await fetch('/api/auth/resetPassword', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ newPassword: password, token }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Your password has been reset successfully.');
//         router.push('/auth/login');
//       } else {
//         throw new Error(data.message || 'Failed to reset password');
//       }
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Set New Password</h2>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <label className={styles.npassword} htmlFor="password">New Password:</label>
//         <input
//           className={styles.inputfield}
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <label className={styles.cpassword} htmlFor="confirmPassword">Confirm New Password:</label>
//         <input
//           className={styles.inputfield}
//           type="password"
//           id="confirmPassword"
//           name="confirmPassword"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className={styles.button}>Reset Password</button>
//       </form>
//       {showErrorModal && <ErrorModal message={message} onClose={() => setShowErrorModal(false)} />}
//       {!showErrorModal && message && <p className={styles.message}>{message}</p>}
//     </div>
//   );
// };

// export default ResetPassword;
