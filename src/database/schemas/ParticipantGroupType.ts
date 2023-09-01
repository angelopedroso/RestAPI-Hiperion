import mongoose from 'mongoose'

const ParticipantGroupType = new mongoose.Schema({
  tipo: String,
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
})

const ParticipantGroupTypeModel = mongoose.model(
  'ParticipantGroupType',
  ParticipantGroupType,
  'ParticipantGroupType',
)

export { ParticipantGroupType, ParticipantGroupTypeModel }
