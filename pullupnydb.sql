CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE locations (
    id INT NOT NULL AUTO_INCREMENT,
    zip VARCHAR(255),
    name VARCHAR(255),
    address VARCHAR(255),
    description TEXT,
    rating DECIMAL(2,1),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    userId INT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);
