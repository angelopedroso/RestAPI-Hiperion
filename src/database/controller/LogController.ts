import { Request, Response } from 'express'
import { prisma } from '@/index'

class LogController {
  async find(_: Request, response: Response) {
    try {
      const log = await prisma.log.findMany({
        orderBy: {
          date_time: 'desc',
        },
      })

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
      const log = await prisma.log.groupBy({
        by: ['groupId', 'chat_name'],
        where: {
          is_group: true,
        },
        _count: {
          command: true,
        },
      })

      return response.json(log)
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
