import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/pages/auth/resetPassword.module.css';
import ErrorModal from '@/components/ErrorModal'; 

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { token } = router.query;

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>\/\?])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:'",.<>\/\?]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Password must meet the following requirements:\n" +
        "- 8 or more characters long\n" +
        "- Include at least one uppercase letter\n" +
        "- Include at least one lowercase letter\n" +
        "- Include at least one number\n" +
        "- Include at least one of the following special characters: !@#$%^&*()-_=+[]{}|;:'\",.<>/?"
      );
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || !validatePassword(password)) {
      setMessage(passwordError || "Please ensure your password meets all the requirements.");
      setShowErrorModal(true);
      return;
    }

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
      if (response.ok) {
        setMessage('Your password has been reset successfully.');
        router.push('/auth/login');
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage(error.message);
      setShowErrorModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Set New Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.npassword} htmlFor="password">New Password:</label>
        <input
          className={styles.inputfield}
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChangePassword}
          required
        />
        {passwordError && (
          <div className={styles.error}>
            <pre>{passwordError}</pre>
          </div>
        )}
        <label className={styles.cpassword} htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          className={styles.inputfield}
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button} disabled={!!passwordError}>Reset Password</button>
      </form>
      {showErrorModal && <ErrorModal message={message} onClose={() => setShowErrorModal(false)} />}
      {!showErrorModal && message && <p className={styles.message}>{message}</p>}
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
