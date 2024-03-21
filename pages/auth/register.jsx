import { useState } from 'react';
import { useRouter } from 'next/router'; 
import ErrorModal from '@/components/ErrorModal'; 
import styles from '@/pages/auth/register.module.css';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>\/\?])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:'",.<>\/\?]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      setPasswordError(!validatePassword(value));
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegistration = async (formData) => {
    if (passwordError) {
      setError("Please ensure your password meets all the requirements.");
      setIsErrorModalVisible(true);
      return;
    }

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
      <form onSubmit={handleSubmit} noValidate>
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
          {passwordError && (
            <div className={styles.error}>
              <ul>
                <li>8 or more chars long</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>{"At least one special char: !@#$%^&*()-_=+[]{}|;:'\",.<>/? "}</li>
              </ul>
            </div>
          )}
        </div>
        <button type="submit" className={styles.button} disabled={!!passwordError}>Register</button>
      </form>
      {isErrorModalVisible && <ErrorModal message={error} onClose={handleCloseErrorModal} />}
    </div>
  );
};

export default Register;




// import { useState } from 'react';
// import { useRouter } from 'next/router'; 
// import ErrorModal from '@/components/ErrorModal'; 
// import styles from '@/pages/auth/register.module.css';

// const Register = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleRegistration = async (formData) => {
//     const payload = {
//       email: formData.email,
//       password: formData.password,
//     };
  
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
  
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to register');
//       }
  
//       const { user: newUser } = await response.json();
  
//       localStorage.setItem('user', JSON.stringify(newUser));
//       localStorage.setItem("isLoggedIn", "true");
  
//       window.dispatchEvent(new Event('authChange'));
  
//       router.push('/'); 
//     } catch (error) {
//       console.error('Error registering:', error.message);
//       setError(error.message);
//       setIsErrorModalVisible(true);
//     }
//   };  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await handleRegistration(formData);
//   };

//   const handleCloseErrorModal = () => {
//     setIsErrorModalVisible(false);
//   };

//   return (
//     <div className={styles.signupContainer}>
//       <h2 className={styles.title}>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label className={styles.email}>Email:</label>
//           <input 
//             type="email" 
//             name="email" 
//             value={formData.email} 
//             onChange={handleChange} 
//             className={styles.input}
//           />
//         </div>
//         <div>
//           <label className={styles.password}>Password:</label>
//           <input 
//             type="password" 
//             name="password" 
//             value={formData.password} 
//             onChange={handleChange} 
//             className={styles.input}
//           />
//         </div>
//         <button type="submit" className={styles.button}>Register</button>
//       </form>
//       {isErrorModalVisible && <ErrorModal message={error} onClose={handleCloseErrorModal} />}
//     </div>
//   );
// };

// export default Register;
