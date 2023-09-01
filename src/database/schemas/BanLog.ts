import mongoose from 'mongoose'

const Banlog = new mongoose.Schema({
  user_phone: String,
  user_name: String,
  chat_name: String,
  message: String,
  image: String,
  reason: {
    type: String,
    enum: ['malicious', 'link'],
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
})

const BanLogModel = mongoose.model('BanLog', Banlog, 'BanLog')

export { BanLogModel }
