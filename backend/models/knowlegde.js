const mongoose = require("mongoose");
const { removeVietnameseTones } = require("../util");

  

const knowledgeSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

knowledgeSchema.pre("save", function (next) {
  this.question = removeVietnameseTones(this.question);
  next();
});

const KnowledgeModel = mongoose.model("Knowledge", knowledgeSchema);

module.exports = KnowledgeModel;
