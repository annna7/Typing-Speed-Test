import os
import random
import sqlite3
from types import NoneType
from helper import login_required, build_word_list, MAX_WORDS
from flask import Flask, render_template, flash, redirect, request, session

# build app within current moduleo
app = Flask(__name__, root_path=os.getcwd())
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "aF?LjvQyMnX1zTdY(KM,"

@app.route("/")
def index():
    word_list = random.choices(build_word_list(), k=MAX_WORDS)
    return render_template("index.html", word_list=word_list)

db = sqlite3.connect("database.db", check_same_thread=False)

@app.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect("/")

@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    
    if request.method == "GET":
        return render_template("login.html")
        
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username: 
            return render_template("login.html", feedback="ERROR! Please provide an username!")
        if not password:
            return render_template("login.html", feedback="ERROR! Please provide a password!")
            
        rows = db.execute("SELECT user_id, password FROM users WHERE username=?", (username,))

        curr_user = rows.fetchone()

        if curr_user == None:
            return render_template("login.html", feedback="ERROR! This username doesn't exist. Please try again!")
        
        print(curr_user)
        user_id = curr_user[0]
        passw = curr_user[1]

        if passw != password:    
            return render_template("login.html", feedback="ERROR! The username and the password don't match. Please try again!")
            
        session["user_id"] = user_id

        return redirect("/")
    
    
@app.route("/register",methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        passwordv = request.form.get("passwordv")
        
        if not username:
            return render_template("register.html", feedback="ERROR! Invalid username. Please try again!")
            
        if db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone():
            return render_template("register.html", feedback="ERROR! The username already exists. Please try again!")
        
        if len(password) < 5 or len(password) > 20:
            return render_template("register.html", feedback="ERROR! Passwords must contain between 8 and 20 characters. Please try again!")
            
        if password != passwordv:
            return render_template("register.html", feedback="ERROR! The two passwords do not match. Please try again!")
        
        cursor = db.cursor()
        rows = db.execute("INSERT INTO users(username, password) VALUES(?,?)", (username, password,))
        db.commit()

        session["user_id"] = db.execute("SELECT user_id FROM users WHERE username=?", (username,)).fetchone()[0]

        return redirect("/")
        
if __name__ == '__main__':
    app.run(debug=True)

db.close()