import styles from '@/components/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* © {currentYear} Pull Up SPB. All rights reserved. */}
      {/*  */}
      <div className={styles.runningLine}>
          Proverb Of The Day: "A healthy body is the guest-chamber of the soul;
          a sick, its prison." — Francis Bacon
        </div>
        {/*  */}
    </footer>
  )
}

export default Footer;
