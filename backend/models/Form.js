const mongoose = require('mongoose');

const subQuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Categorize', 'Cloze', 'Comprehension'],
  },
  title: String,
  image: String,
  // Categorize specific fields
  categories: [String],
  items: [String],
  // Cloze and Comprehension specific fields
  text: String,
  // Comprehension specific fields
  subQuestions: [subQuestionSchema],
});

const formSchema = new mongoose.Schema({
  title: String,
  headerImage: String,
  questions: [questionSchema],
  submissions: [
    {
      answers: mongoose.Schema.Types.Mixed,
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Form', formSchema);