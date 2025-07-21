import mongoose from 'mongoose';


const chatSchema = new mongoose.Schema({
    name: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
}, { timestamps: true   })

export const Chat = mongoose.model('Chat', chatSchema);