import styles from '@/components/ErrorModal.module.css'; 

const ErrorModal = ({ message, onClose }) => (
  <div className={styles.errorModalBackdrop}>
    <div className={styles.errorModalContent}>
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  </div>
);

export default ErrorModal;
