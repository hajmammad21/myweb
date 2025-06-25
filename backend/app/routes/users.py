from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.models.notification import Notification
from app.extensions import db
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"message": "User not found"}), 404

@users_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"message": "Both old and new passwords are required."}), 400

    if not user.check_password(old_password):
        return jsonify({"message": "Old password is incorrect."}), 401

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully."}), 200

@users_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_user_notifications():
    user_id = get_jwt_identity()
    now = datetime.utcnow()
    notifications = Notification.query.filter(
        Notification.user_id == user_id,
        Notification.expires_at > now
    ).order_by(Notification.created_at.desc()).all()

    return jsonify([n.to_dict() for n in notifications]), 200

@users_bp.route('/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only."}), 403

    data = request.get_json()
    target_user_id = data.get('user_id')
    message = data.get('message')

    if not target_user_id or not message:
        return jsonify({"msg": "user_id and message are required."}), 400

    if target_user_id == 'all':
        users = User.query.all()
        for u in users:
            if not u.is_admin:  # Optional: prevent sending to self/admins
                notif = Notification(user_id=u.id, message=message)
                db.session.add(notif)
        db.session.commit()
        return jsonify({"msg": "اعلان به همه کاربران ارسال شد."}), 201
    else:
        try:
            target_user_id = int(target_user_id)
        except ValueError:
            return jsonify({"msg": "Invalid user_id."}), 400

        target_user = User.query.get(target_user_id)
        if not target_user:
            return jsonify({"msg": "Target user not found."}), 404

        notification = Notification(user_id=target_user.id, message=message)
        db.session.add(notification)
        db.session.commit()
        return jsonify({"msg": "اعلان ارسال شد."}), 201


@users_bp.route('/notifications/<int:id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_as_read(id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=id, user_id=user_id).first()

    if not notification:
        return jsonify({"msg": "Notification not found."}), 404

    notification.is_read = True
    db.session.commit()

    return jsonify({"msg": "Notification marked as read."}), 200
