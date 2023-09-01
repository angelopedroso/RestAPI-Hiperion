import mongoose from 'mongoose'

const BotSettings = new mongoose.Schema({
  private: {
    type: Boolean,
    default: false,
  },
})

const BotSettingsModel = mongoose.model(
  'BotSettings',
  BotSettings,
  'BotSettings',
)

export { BotSettingsModel }
