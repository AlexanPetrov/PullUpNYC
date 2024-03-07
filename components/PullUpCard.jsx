import { useState } from 'react';
import styles from '@/components/PullUpCard.module.css';

const PullUpCard = ({ name, address, description, rating, onDirectionClick, onCalculateDistance, onCalculateTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div onClick={toggleExpand}>
        <h3>{name}</h3>
        <p>{address}</p>
        {isExpanded ? (
          <>
            <p>{description}</p>
            <p>Rating: {rating}</p>
            <button onClick={(e) => {
              e.stopPropagation(); 
              onDirectionClick();
            }} className={styles.directionButton}>
              Show Path
            </button>
            <button onClick={(e) => {
              e.stopPropagation();
              onCalculateDistance();
            }} className={styles.directionButton}>
              Calculate Distance
            </button>
            <button onClick={(e) => {
              e.stopPropagation();
              onCalculateTime(); 
            }} className={styles.directionButton}>
              Approximate Time
            </button>
          </>
        ) : (
          <p>{description.substring(0, 100)}...</p> 
        )}
      </div>
    </div>
  );
};

export default PullUpCard;
