from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import ContactMessage
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()

    if not data or not all(key in data for key in ['name', 'email', 'message']):
        return jsonify({"error": "Invalid or missing data"}), 400

    contact = ContactMessage(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )

    db.session.add(contact)
    db.session.commit()

    return jsonify({"message": "Message received"}), 201

@contact_bp.route('/contact', methods=['GET'])
@jwt_required()
def get_messages():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([msg.to_dict() for msg in messages]), 200