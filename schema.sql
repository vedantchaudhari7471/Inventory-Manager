-- Users Table (for future full-fledged authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' -- 'admin' or 'user'
);

-- Competitions Table
CREATE TABLE competitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Equipment Table
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total INT NOT NULL DEFAULT 0, -- Total stock
    available INT NOT NULL DEFAULT 0, -- Available for allocation
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

-- Allocations Table
CREATE TABLE allocations (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL, -- Simple reference to the user by name
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    competition_id INT REFERENCES competitions(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    -- A user should only have one allocation entry for a specific item in a specific competition
    UNIQUE(username, equipment_id, competition_id)
);

-- Insert default users and a default competition
INSERT INTO users (username, role) VALUES ('admin', 'admin'), ('user', 'user');
INSERT INTO competitions (name) VALUES ('Hackathon');