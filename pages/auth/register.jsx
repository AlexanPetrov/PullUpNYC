import { useState } from 'react';
import { useRouter } from 'next/router';
import ErrorModal from '@/components/ErrorModal';
import { loginAndRegisterValidation } from '@/validations/auth'; // Import your validation schema
import styles from '@/pages/auth/register.module.css';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Validate the updated field
    const validationResults = loginAndRegisterValidation.validate(updatedFormData, { abortEarly: false });
    const newErrors = { email: '', password: '' };

    if (validationResults.error) {
      validationResults.error.details.forEach((detail) => {
        if (detail.path.includes(name)) {
          newErrors[name] = detail.message;
        }
      });
    }

    setFormErrors(newErrors);
    setFormData(updatedFormData);
  };

  const handleRegistration = async (formData) => {
    const { error } = loginAndRegisterValidation.validate(formData, { abortEarly: false });
    if (error) {
      const newErrors = { email: '', password: '' };
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setFormErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
          {formErrors.email && <div className={styles.error}>{formErrors.email}</div>}
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
          {formErrors.password && <div className={styles.error}>{formErrors.password}</div>}
        </div>
        <button type="submit" className={styles.button} disabled={formErrors.email || formErrors.password}>Register</button>
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
