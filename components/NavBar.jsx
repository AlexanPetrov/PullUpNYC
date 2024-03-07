import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/components/NavBar.module.css'; 

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener('authChange', handleAuthChange);

    handleAuthChange();

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpenMenu(false); 
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChange')); 
    router.push('/'); 
  };

  return (
    <nav className={styles.navBar}>
      <Link href="/">
        <span className={`${styles.homelink} ${router.pathname === "/" ? styles.active : ''}`}>
          Pull Up NYC 
        </span>
      </Link>
      <div className={styles.container}>
        <div className={`${styles.linkContainer} ${openMenu ? styles.show : ''}`}>
          {isLoggedIn && (
            <>
              <Link href="/contribute">
                <span className={`${styles.link} ${router.pathname === "/contribute" ? styles.active : ''}`}>Contribute Locations</span>
              </Link>
              <Link href="/edit">
                <span className={`${styles.link} ${router.pathname === "/edit" ? styles.active : ''}`}>Edit My Locations</span>
              </Link>
              <Link href="/deleteAccount">
                <span className={`${styles.link} ${router.pathname === "/deleteAccount" ? styles.active : ''}`}>Delete Account</span>
              </Link>
            </>
          )}
          <Link href="/about">
            <span className={`${styles.link} ${router.pathname === "/about" ? styles.active : ''}`}>About The Project</span>
          </Link>
          {!isLoggedIn ? (
            <Link href="/auth/login">
              <span className={`${styles.link} ${router.pathname === "/auth/login" ? styles.active : ''}`}>Log In</span>
            </Link>
          ) : (
            <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
          )}
        </div>
        <button className={styles.navMenu} onClick={() => setOpenMenu(!openMenu)}>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </button>
        {openMenu && (
          <div className={styles.mobileLinks}>
            <div className={styles.centerContent}>
              <div className={styles.menuItem}>
                <Link href="/about">
                  <span className={`${styles.link} ${router.pathname === "/about" ? styles.active : ''}`}>About The Project</span>
                </Link>
              </div>
              {isLoggedIn && (
                <>
                  <div className={styles.menuItem}>
                    <Link href="/contribute">
                      <span className={`${styles.link} ${router.pathname === "/contribute" ? styles.active : ''}`}>Contribute Locations</span>
                    </Link>
                  </div>
                  <div className={styles.menuItem}>
                    <Link href="/edit">
                      <span className={`${styles.link} ${router.pathname === "/edit" ? styles.active : ''}`}>Edit My Locations</span>
                    </Link>
                  </div>
                  <div className={styles.menuItem}>
                    <Link href="/deleteAccount">
                      <span className={`${styles.link} ${router.pathname === "/deleteAccount" ? styles.active : ''}`}>Delete Account</span>
                    </Link>
                  </div>
                  <div className={styles.menuItem}>
                    <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
                  </div>
                </>
              )}
              {!isLoggedIn && (
                <div className={styles.menuItem}>
                  <Link href="/auth/login">
                    <span className={`${styles.link} ${router.pathname === "/auth/login" ? styles.active : ''}`}>Log In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
