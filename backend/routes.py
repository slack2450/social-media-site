from logging import error
from operator import and_
from backend import app, db
from backend.models import Like, User, Post
from flask_login import login_user, logout_user, current_user
from flask import request
import json

from sqlalchemy import or_, and_

def is_duplicate(field, value):
    if User.query.filter(getattr(User, field).like(value)).first() is not None:
        return True
    return False

@app.route('/api/v1/login', methods=['POST'])
def login():
    user_identifier = request.json['userIdentifier']
    password = request.json['password']

    if user_identifier is None or user_identifier == '':
        return { 'success': False, 'error': 'No username or email provided', 'field': 'userIdentifier' }

    if password is None or password == '':
        return { 'success': False, 'error': 'No password provided', 'field': 'password' }

    user = User.query.filter(or_(User.username == user_identifier, User.email == user_identifier)).first()
    if user is None:
        return { 'sucess': False, 'error': 'Username or Email not found', 'field': 'userIdentifier' }

    if not user.check_password(password):
        return { 'sucess': False, 'error': 'Incorrect password', 'field': 'password' }
    
    login_user(user)

    return {
        'success': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'displayName': user.display_name,
        }
    }

@app.route('/api/v1/register', methods=['POST'])
def register():
    payload = request.get_json()

    if 'displayName' not in payload or payload['displayName'] == '':
        return { 'success': False, 'error': 'No name provided', 'field': 'displayName' }

    if 'username' not in payload or payload['username'] == '':
        return { 'success': False, 'error': 'No username provided', 'field': 'username' }

    if 'email' not in payload or payload['email'] == '':
        return { 'success': False, 'error': 'No email provided', 'field': 'email' }
    
    if 'password' not in payload or payload['password'] == '':
        return { 'success': False, 'error': 'No password provided', 'field': 'password' }

    if is_duplicate('username', payload['username']):
        return { 'success': False, 'error': 'Username already in use', 'field': 'username' }

    if is_duplicate('email', payload['email']):
        return { 'success': False, 'error': 'Email already in use', 'field': 'email' }

    user = User(payload['username'], payload['displayName'], payload['email'], payload['password'])

    db.session.add(user)
    db.session.commit()

    login_user(user)

    return {
        'success': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'displayName': user.display_name,
        }
    }

@app.route('/api/v1/logout', methods=['GET'])
def logout():
    logout_user(current_user)

    return { 'success': True }

@app.route('/api/v1/post', methods=['POST'])
def post():
    if not current_user.is_authenticated:
        return { 'success': False, 'error': 'You must be signed in to create a post' }

    payload = request.get_json()

    if 'content' not in payload or payload['content'] == '':
        return { 'success': False, 'error': 'Your post must contain something!', 'field': 'newPost' }
    
    post = Post(current_user.id, payload['content'])

    db.session.add(post)
    db.session.commit()

    return { 'success': True }

@app.route('/api/v1/like', methods=['POST'])
def like():
    if not current_user.is_authenticated:
        return { 'success': False, 'error': 'You must be signed in to like a post' }

    payload = request.get_json()

    if 'post' not in payload or payload['post'] == '':
        return { 'success': False, 'error': 'Your request must contain a post to like'}

    post = Post.query.get(payload['post'])

    if post is None:
        return { 'success': False, 'error': 'Your request must contain a valid post to like'}

    existing_like = Like.query.filter(and_(Like.owner_id == current_user.id, Like.post_id == payload['post'])).first()

    if existing_like is not None:
        return { 'success': False, 'error': 'You cannot like a post more than once'}

    like = Like(current_user.id, payload['post'])

    db.session.add(like)
    db.session.commit()

    return { 'success': True }

@app.route('/api/v1/unlike', methods=['POST'])
def unlike():
    if not current_user.is_authenticated:
        return { 'success': False, 'error': 'You must be signed in to unlike a post' }

    payload = request.get_json()

    if 'post' not in payload or payload['post'] == '':
        return { 'success': False, 'error': 'Your request must contain a post to unlike'}

    post = Post.query.get(payload['post'])

    if post is None:
        return { 'success': False, 'error': 'Your request must contain a valid post to unlike'}

    existing_like = Like.query.filter(and_(Like.owner_id == current_user.id, Like.post_id == payload['post'])).first()

    if existing_like is None:
        return { 'success': False, 'error': 'You cannot unlike a post you do not like'}

    db.session.delete(existing_like)
    db.session.commit()

    return { 'success': True }


@app.route('/api/v1/posts', methods=['GET'])
def posts():
    postsRaw = Post.query.order_by(Post.date.desc()).all()

    posts = []

    for post in postsRaw:
        owner = User.query.get(post.owner_id)

        likes = []
        for like in post.likes:
            likes.append(like.owner_id)

        posts.append({
            'id': post.id,
            'owner': {
                'id': owner.id,
                'displayName': owner.display_name,
                'username': owner.username
            },
            'content': post.content,
            'date': post.date,
            'likes': likes
        })

    return { 'success': True, 'posts': posts}

@app.route('/api/v1/user', methods=['PUT'])
def user():
    if not current_user.is_authenticated:
        return { 'success': False, 'error': 'You must be signed in to update your account' }

    payload = request.get_json()

    if 'username' not in payload or payload['username'] == '':
        return { 'success': False, 'field': 'username', 'error': 'Your username cannot be empty'}

    if 'email' not in payload or payload['email'] == '':
        return { 'success': False, 'field': 'email', 'error': 'Your email cannot be empty'}

    if 'displayName' not in payload or payload['displayName'] == '':
        return { 'success': False, 'field': 'displayName', 'error': 'Your name cannot be empty'}

    if current_user.username != payload['username'] and is_duplicate('username', payload['username']):
        return { 'success': False,  'field': 'username', 'error': 'Username already in use' }

    if current_user.email != payload['email'] and is_duplicate('email', payload['email']):
        return { 'success': False,  'field': 'email', 'error': 'Email already in use' }

    current_user.username = payload['username']
    current_user.email = payload['email']
    current_user.display_name = payload['displayName']

    if 'password' in payload and payload['password'] != '':
        current_user.set_password(payload['password'])

    db.session.commit()

    return { 'success': True }