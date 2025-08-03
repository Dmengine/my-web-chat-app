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
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function(this: any) {
            return this.isGroup;
        },
    }
}, { timestamps: true   })

export const Chat = mongoose.model('Chat', chatSchema);