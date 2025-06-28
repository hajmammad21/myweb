from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.models.notification import Notification
from app.extensions import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from flask import current_app
from app.models import Product
from flask_mail import Message, Mail
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mail
from datetime import datetime, timedelta
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import secrets

limiter = Limiter(get_remote_address)
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


@users_bp.route('/teacher/products', methods=['POST'])
@jwt_required()
def submit_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_teacher:
        return jsonify({"msg": "Only teachers can submit products."}), 403

    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    file = request.files.get('file')

    # 🔍 Debug log
    print("DEBUG:", title, price, file)

    # Validate fields
    if not title or not price or not file:
        return jsonify({"msg": "Missing required fields."}), 400

    try:
        price = float(price)
    except ValueError:
        return jsonify({"msg": "Invalid price format."}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join(current_app.root_path, 'static', 'products')
    os.makedirs(upload_path, exist_ok=True)
    file.save(os.path.join(upload_path, filename))

    file_url = f'/static/products/{filename}'

    product = Product(
        teacher_id=user.id,
        title=title,
        description=description,
        price=price,
        file_url=file_url,
        is_approved=False
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"msg": "محصول با موفقیت ارسال شد و در انتظار تایید است."}), 201


@users_bp.route('/admin/products', methods=['GET'])
@jwt_required()
def list_pending_products():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    products = Product.query.filter_by(is_approved=False).all()
    return jsonify([p.to_dict() for p in products]), 200

@users_bp.route('/admin/products/<int:product_id>/approve', methods=['PUT'])
@jwt_required()
def approve_product(product_id):
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    data = request.get_json()
    category = data.get('category')

    if not category:
        return jsonify({"msg": "Please select a category"}), 400

    product.is_approved = True
    product.category = category
    db.session.commit()

    return jsonify({"msg": "Product approved and categorized."}), 200

@users_bp.route('/admin/all', methods=['GET'])
@jwt_required()
def list_all_users():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admins only"}), 403

    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200

@users_bp.route('/teacher/notifications', methods=['GET'])
@jwt_required()
def get_teacher_notifications():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_teacher:
        return jsonify({"msg": "Only Teachers can access this."}), 403
    
    notifications = Notification.query.filter_by(user_id=user.id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200

from flask import current_app

@users_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("1 per minute")
def forgot_password():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "User not found."}), 404

    reset_token = secrets.token_urlsafe(16)
    reset_link = f'http://localhost:5000/reset-password/{reset_token}'

    expiration_time = datetime.utcnow() + timedelta(hours=1)

    user.reset_token = reset_token
    user.reset_token_expires_at = expiration_time
    db.session.commit()

    msg = Message("Password Reset Request", recipients=[email])
    msg.body = f"Click here to reset your password: {reset_link}"
    mail.send(msg)

    return jsonify({"msg": "Password reset link sent to email"}), 200


@users_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"msg": "Invalid or expired token"}), 400

    if datetime.utcnow() > user.reset_token_expires_at:
        return jsonify({"msg": "Reset token has expired."}), 400

    new_password = request.json.get('new_password')

    if not new_password:
        return jsonify({"msg": "New password is required."}), 400

    user.password_hash = generate_password_hash(new_password)
    user.reset_token = None
    db.session.commit()

    return jsonify({"msg": "Password reset successfully."}), 200
