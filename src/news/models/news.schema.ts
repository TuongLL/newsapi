import { Schema } from 'mongoose'
export const newsSchema = new Schema({
    _id: {
        type: String,
        index: true
    },
    title: String,
    date: String,
    readTime: String,
    icon: String,
    image: String,
    urlPage: String,
    upvoteByIds: {
        type: [String],
        default: []
    }
}, { _id: false })

export interface NewsDto {
    id: string,
    title: string,
    date: string,
    readTime: string,
    icon: string,
    image: string,
    urlPage: string,
    upvoteByIds: string[]
}
