import { redis } from '@/server'
import { Request, Response } from 'express'
import { ParticipantModel } from '../schemas'

class ParticipantController {
  async find(_: Request, response: Response) {
    try {
      const [allUsers, totalUsers] = await Promise.all([
        ParticipantModel.find()
          .populate('participant_group_type')
          .sort({ name: 'asc' }),
        ParticipantModel.countDocuments(),
      ])

      const formattedUsers = allUsers.map((user) => {
        return {
          id: user.id,
          p_id: user.p_id,
          name: user.name,
          image_url: user.image_url,
          type: user.participant_group_type,
        }
      })

      const responseData = {
        total: totalUsers,
        data: formattedUsers,
      }

      return response.json(responseData)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }

  async findAdmins(_: Request, response: Response) {
    try {
      const cache = await redis.get('all-admins')

      if (cache) {
        return response.json(JSON.parse(cache))
      }

      const participants = await ParticipantModel.find()

      await redis.set('all-admins', JSON.stringify(participants), 'EX', 60 * 10)

      return response.json(participants)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }
}

const participantController = new ParticipantController()

export { participantController }
