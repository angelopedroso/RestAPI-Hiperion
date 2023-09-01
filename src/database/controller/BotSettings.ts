import { Request, Response } from 'express'
import { prisma } from '@/index'

class BotSettings {
  async find(_: Request, response: Response) {
    try {
      const bot = await prisma.botSettings.findFirst({})

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

      const existsBot = await prisma.botSettings.findFirst({})

      if (!existsBot) {
        return response.status(400).json({
          message: 'Bot not found!',
        })
      }

      const bot = await prisma.botSettings.update({
        where: {
          id,
        },
        data: {
          private: privateChat,
        },
      })

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
