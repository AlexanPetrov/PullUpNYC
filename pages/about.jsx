import { useState, useEffect } from 'react';
import styles from '@/pages/about.module.css';
import Image from 'next/image';

const images = [
  '/pullup6.jpeg',
  '/pullup8.jpeg',
];

const About = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((currentImage) => (currentImage + 1) % images.length);
    }, 3000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textWindow}>
        <h2>Who We Are</h2>
        <p>We're a band of urban adventurers, fitness enthusiasts, and believers in the power of gravity. We've looked at the cityscape and seen not just buildings and streets, but a playground for the physically curious and the financially savvy. Why spend a fortune on gym memberships when the world is your fitness oyster?</p>
        
        <h2>Our Mission</h2>
        <p>To map every pull-up bar in the city and beyond, making it ridiculously easy for you to find a spot to flex those muscles, anywhere, anytime. Whether you're en route to work, exploring your city, or just out for a stroll, we believe there's always time for a quick pull-up session.</p>
        
        <h2>Why Pull-Ups</h2>
        <p>Pull-ups are the Swiss Army knife of exercises. They require no fancy equipment, just a bar and some good old-fashioned gravity. They're a powerhouse move for upper body strength, improving your grip, back, shoulders, and arms. Plus, they're an instant mood booster – nothing says "I'm awesome" quite like hoisting yourself up on a whim.</p>
        
        <h2>Why Us</h2>
        <p>Because we're tired of the same old gym routine and exorbitant fees. We believe in making fitness accessible, fun, and part of your daily journey. Our map is user-driven, constantly updated with the best spots for public pull-ups, complete with user ratings and comments. Think of us as the communal diary of the pull-up world.</p>
        
        <h2>Join the Movement</h2>
        <p>Our platform is more than just a map; it's a community. Share your favorite spots and photos! Let's transform the urban jungle into a network of strength, one pull-up at a time.</p>

        <h2>Contact Us</h2>
        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} target="_blank" className={styles.contactLink}>Click Here</a>
      </div>
      <div className={styles.photoBooth}>
        <Image
          src={images[currentImage]}
          alt="Photo Booth Image"
          layout="fill"
          objectFit="cover"
        />
        <div className={styles.overlayText}>Your Best Photos Here</div>
      </div>
    </div>
  );
}

export default About;
