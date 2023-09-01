import { Request, Response } from 'express'
import { prisma } from '@/index'

class SummaryController {
  async find(_: Request, response: Response) {
    try {
      const totalGroups = await prisma.group.count()
      const totalBlacklist = await prisma.participant.count({
        where: {
          group_black_list: {
            some: {},
          },
        },
      })
      const totalParticipants = await prisma.participant.count()
      const totalLogs = await prisma.log.count()

      const summary = {
        totalGroups,
        totalBlacklist,
        totalParticipants,
        totalLogs,
      }

      return response.json(summary)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }
}

const summaryController = new SummaryController()

export { summaryController }
