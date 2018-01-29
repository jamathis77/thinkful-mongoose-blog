const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: {
    firstName: String,
    lastName: String
  },
  created: String
});

blogSchema.virtual('name').get(function(){
  return `${this.author.firstName} ${this.author.lastName}`
});

blogSchema.methods.serialize = function(){
  return {
    id: this._id,
    author: this.name,
    title: this.title,
    content: this.content,
    created: this.created
  }
}



const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};
