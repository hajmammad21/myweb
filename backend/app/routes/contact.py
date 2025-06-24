from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import ContactMessage

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
def get_messages():
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([msg.to_dict() for msg in messages]), 200
