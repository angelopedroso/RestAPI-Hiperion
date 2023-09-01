import mongoose from 'mongoose'
import { ParticipantGroupType } from './ParticipantGroupType'

const Group = new mongoose.Schema({
  g_id: { type: String, unique: true },
  name: String,
  image_url: String,
  participants_ids: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  ],
  black_list_ids: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  ],
  bem_vindo: { type: Boolean, default: false },
  one_group: { type: Boolean, default: false },
  auto_invite_link: { type: Boolean, default: false },
  auto_sticker: { type: Boolean, default: false },
  anti_link: { type: Boolean, default: false },
  anti_porn: { type: Boolean, default: false },
  anti_trava_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AntiTrava',
    unique: true,
  },
  participant_group_type: [ParticipantGroupType],
})

const GroupModel = mongoose.model('Group', Group, 'Group')

export { Group, GroupModel }
