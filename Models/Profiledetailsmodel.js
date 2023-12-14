import mongoose from 'mongoose'

const profileDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
      isPublic: {
        type: Boolean,
        default:false,
      },
  birth: {
    date: {
      type: Date,
    },
    visible: {
      type: String,

    },
  },
  gender: {
    type: String,
  },
  religion: {
    type: String,
  },
  citizenship: {
    type: [String],
  },
  language: {
    nativeLanguage: {
      type: [String],
      default: [],
    },
    languagesSpeak: {
      type: [String],
      default: [],
    },
    languagesWrite: {
        type: [String],
        default: [],
      },
      languagesRead: {
        type: [String],
        default: [],
      },
      languagesUnderstand: {
        type: [String],
        default: [],
      },
  },
  habits: {
    dress: {
      type: [String],
      default: [],
    },
    eating: {
      type: [String],
      default: [],
    },
    alcoholic: {
      type: String,
      default: 'No',
    },
    smoke: {
        type: String,
        default: 'No',
      },
      sports: {
        type: String,
        default: 'No',
      },
      swimming: {
        type: String,
        default: 'No',
      },
      exercise: {
        type: String,
        default: 'No',
      },
      reading: {
        type: String,
        default: 'No',
      },
      voluntering: {
        type: String,
        default: 'No',
      },
      traveling: {
        type: String,
        default: 'No', 
      },
      adventure: {
        type: String,
        default: 'No', 
      },
      cultural: {
        type: String,
        default: 'No',
      },
      relegious: {
        type: String,
        default: 'No',
      },
      music: {
        type: String,
        default: 'No', 
      },
      movies: {
        type: String,
        default: 'No',
      },
      isPublic: {
        type: String,
       
      },
  },
  interest: {
    foods: {
      type: [String],
      default: [],
    },
    sports: {
      type: [String],
      default: [],
    },
    boardgame: {
        type: [String],
        default: [],
      },
      socialapp: {
        type: [String],
        default: [],
      },
      countries: {
        type: [String],
        default: [],
      },
      ideolegies: {
        type: [String],
        default: [],
      },
      culture: {
        type: [String],
        default: [],
      },
      carbrands: {
        type: [String],
        default: [],
      },
      movies: {
        type: [String],
        default: [],
      },
      language: {
        type: [String],
        default: [],
      },
      isPublic: {
        type: String,
       
      },
  },
  
},{
    timestamps:true
});

const ProfileDetailsModel = mongoose.model('ProfileDetails', profileDetailsSchema);

export default ProfileDetailsModel;

