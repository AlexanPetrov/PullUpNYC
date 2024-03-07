import { useState, useEffect } from 'react';
import Button from "@/components/Button";
import styles from "@/components/SearchBar.module.css";

const SearchBar = ({ onSearch, onReset, onDisplayAll }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
    useEffect(() => {
      const updateLoginStatus = () => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsUserLoggedIn(loggedIn);
      };

      updateLoginStatus(); 

      window.addEventListener('authChange', updateLoginStatus);

      return () => window.removeEventListener('authChange', updateLoginStatus);
    }, []);

    const handleSearch = () => {
      if (onSearch) {
        onSearch(searchTerm);
        setSearchTerm(''); 
      }
    };
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className={styles.searchbar}>
        <input
          name="searchbar"
          type="text"
          placeholder="Search Bars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button text="Display All" onClick={onDisplayAll} />
        <Button text="Clear All" onClick={onReset} />
        <Button text="Zip Code Search" onClick={handleSearch} />
      </div>
    );
};
  
export default SearchBar;
