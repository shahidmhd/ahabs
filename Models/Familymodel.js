// import mongoose from "mongoose";

// const familySchema = new mongoose.Schema({
//     currentUserId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     otherUserId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', 
//         required: true
//     },
//     relationship: {
//         type: String,
//         enum: ['Wife', 'Daughter', 'Son', 'Husband', 'Mother', 'Father', 'Granddaughter', 'Grandson', 'Grandfather', 'Grandmother', 'Dad’s sister', 'Mother’s sister', 'Sister', 'Brother'],
   
//     },

// });

// const Family = mongoose.model('Family', familySchema);

// export default Family
import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
    currentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    relationships: {
        wife: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        daughter: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        son: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        husband: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        mother: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        father: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        granddaughter: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        grandson: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        grandfather: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        grandmother: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        dadSister: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        momSister: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        sister: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        brother: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    // You can add other fields as necessary based on your requirements
});

const Family = mongoose.model('Family', familySchema);

export default Family;
