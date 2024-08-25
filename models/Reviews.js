import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add title of the review'],
    maxlength:100
  },
  text: {
    type: String,
    required: [true, 'Please add tex']
  },
  rating: {
    type: Number,
    min:1,
    max:10,
    required: [true, 'Please add a rating between 1 to 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

reviewSchema.statics.getAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};
//This is to make sure that a user cannot write more than 1 review per bootcamp
reviewSchema.index({bootcamp:1,user:1},{unique:true})

reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

reviewSchema.pre('deleteOne', { document: true, query: false }, function (next) {
  // 'this' refers to the document being deleted
  this._bootcampId = this.bootcamp;  // Temporarily store bootcamp ID
  next();
});
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  // 'this' still refers to the document, although it's deleted from the database
  await this.constructor.getAverageRating(this._bootcampId);  // Use stored bootcamp ID
});



const  Review = mongoose.model('Review', reviewSchema);
export  default Review;

