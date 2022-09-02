import { Schema } from 'mongoose';
export const UserSchema = new Schema({
    _id: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    hash:{
        type: String,
    },
    hashedRt:{
        type: String,
    }
},{timestamps: true})

export class UserDto {
    id: number;
    email: string;
    password: string;
    hash: string;
    hashedRt: string
}