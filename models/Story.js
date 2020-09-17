var mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title:{type:String, required:true,trim:true},
    body:{type:String, required:true},
    status:{type:String, default:"Public", enum:["Public","Private"]},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"Users"},
    createdAt:{type:Date, default:Date.now},
    lastModifiedAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model("Story",StorySchema)