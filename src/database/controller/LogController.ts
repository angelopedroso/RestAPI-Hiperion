import { Request, Response } from 'express'
import { LogModel } from '@/database/schemas'

class LogController {
  async find(_: Request, response: Response) {
    try {
      const log = await LogModel.find()

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
      const logs = await LogModel.aggregate([
        {
          $match: {
            is_group: true,
          },
        },
        {
          $group: {
            _id: {
              groupId: '$groupId',
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
            groupId: '$_id.groupId',
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

const logController = new LogController()

export { logController }
