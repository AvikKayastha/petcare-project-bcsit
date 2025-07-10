import mongoose from 'mongoose';

const petwalkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    petName:{
        type: String,
        required: true,
    },
    petType:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    hours:{
        type: Number,
        required: true,
    },
    notes:{
        type: String,
        required: false,
    }, 
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
    const petwalk = mongoose.model("Petwalk", petwalkSchema);

    export default petwalk;
