import { Request, Response } from 'express'
import { BanLogModel } from '@/database/schemas'

class BanLogController {
  async find(_: Request, response: Response) {
    try {
      const log = await BanLogModel.find()

      return response.json(log)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }

  async findLogsByGroup(_: Request, response: Response) {
    try {
      const logs = await BanLogModel.aggregate([
        {
          $group: {
            _id: {
              chat_name: '$chat_name',
            },
            command_count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            chat_name: '$_id.chat_name',
            command_count: 1,
          },
        },
      ])

      return response.json(logs)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }
}

const banLogController = new BanLogController()

export { banLogController }
