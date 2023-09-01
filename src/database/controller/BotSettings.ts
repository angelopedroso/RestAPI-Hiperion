import { Request, Response } from 'express'
import { BotSettingsModel } from '@/database/schemas'

class BotSettings {
  async find(_: Request, response: Response) {
    try {
      const bot = await BotSettingsModel.find()

      return response.json(bot)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id, private: privateChat } = request.body

      const bot = await BotSettingsModel.findByIdAndUpdate(
        id,
        { private: privateChat },
        {
          new: true,
        },
      )

      return response.json(bot)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }
}

const botSettings = new BotSettings()

export { botSettings }
