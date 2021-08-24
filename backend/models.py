from enum import unique
from backend import db, bcrypt
from flask_login import UserMixin
import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    display_name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True)
    __hashpass = db.Column(db.Text)

    def __init__(self, username, display_name, email, password):
        super()
        self.username = username
        self.display_name = display_name
        self.email = email
        self.set_password(password)

    # Hash password do not store passwords in cleartext
    def set_password(self, password):
        self.__hashpass = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Check if password matches the stored hash
    def check_password(self, password):
        return bcrypt.check_password_hash(self.__hashpass, password)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime)
    likes = db.relationship('Like', backref='post')

    def __init__(self, owner_id, content):
        self.owner_id = owner_id
        self.content = content
        self.date = datetime.datetime.now()

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

    def __init__(self, owner_id, post_id):
        self.owner_id = owner_id
        self.post_id = post_id
    
