import mongoose from 'mongoose'
import { ParticipantGroupType } from './ParticipantGroupType'

const Participant = new mongoose.Schema({
  p_id: { type: String, unique: true },
  image_url: String,
  name: String,
  group_participant_ids: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  ],
  group_black_list_ids: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  ],
  participant_group_type: [ParticipantGroupType],
})

const ParticipantModel = mongoose.model(
  'Participant',
  Participant,
  'Participant',
)

export { Participant, ParticipantModel }
