import { Schema, model } from 'mongoose';
import { USER_ROLE_USER } from '../utils/const/role.js';

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: USER_ROLE_USER },
});

export const userModel = model('User', UserSchema);
