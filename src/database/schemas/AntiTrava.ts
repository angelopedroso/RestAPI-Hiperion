import mongoose from 'mongoose'

const AntiTrava = new mongoose.Schema({
  status: { type: Boolean, default: false },
  max_characters: { type: Number, default: 1000 },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
})

const AntiTravaModel = mongoose.model('AntiTrava', AntiTrava, 'AntiTrava')

export { AntiTrava, AntiTravaModel }
