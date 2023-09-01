import mongoose from 'mongoose'

const Log = new mongoose.Schema({
  groupId: String,
  is_group: Boolean,
  command: String,
  user_name: String,
  chat_name: String,
  date_time: { type: Date, default: Date.now },
})

const LogModel = mongoose.model('Log', Log, 'Log')

export { Log, LogModel }
