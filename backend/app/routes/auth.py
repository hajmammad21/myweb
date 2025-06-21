from flask import Blueprint, request, jsonify
from app.models import User
from app.db import db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    print("DEBUG received JSON:", data)

    # Handle missing or bad JSON
    if not data or not all(key in data for key in ['email', 'name', 'password']):
        return jsonify({"error": "Invalid or missing data"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(email=data['email'], name=data['name'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 200
