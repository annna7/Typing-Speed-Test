import sqlite3

connection = sqlite3.connect("database.db")

with open("schema.sql") as db_file:
    connection.executescript(db_file.read())

connection.commit()
connection.close()