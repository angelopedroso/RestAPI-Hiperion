import { Request, Response } from 'express'
import { GroupModel, LogModel, ParticipantModel } from '@/database/schemas'

class SummaryController {
  async find(_: Request, response: Response) {
    try {
      const totalGroups = await GroupModel.count()

      const totalBlacklist = await ParticipantModel.countDocuments({
        group_black_list: {
          $exists: true,
          $not: { $size: 0 },
        },
      })

      const totalParticipants = await ParticipantModel.countDocuments()
      const totalLogs = await LogModel.countDocuments()

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
