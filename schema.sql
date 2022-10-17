DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS entries;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE entries (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    wpm INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);