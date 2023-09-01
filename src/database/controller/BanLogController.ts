import { Request, Response } from 'express'
import { prisma } from '@/index'

class BanLogController {
  async find(_: Request, response: Response) {
    try {
      const log = await prisma.banLog.findMany({
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
      const logs = await prisma.banLog.groupBy({
        by: ['chat_name'],
        _count: {
          chat_name: true,
        },
      })

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
