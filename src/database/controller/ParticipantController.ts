import { prisma, redis } from '@/index'
import { Request, Response } from 'express'

class ParticipantController {
  async find(_: Request, response: Response) {
    try {
      const [allUsers, totalUsers] = await Promise.all([
        prisma.participant.findMany({
          include: {
            participant_group_type: true,
          },
          orderBy: {
            name: 'asc',
          },
        }),
        prisma.participant.count(),
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

      const participantsAdmin = await prisma.participant.findMany({
        where: {
          participant_group_type: {
            some: {
              tipo: 'admin',
            },
          },
        },
        include: {
          group_participant: {
            where: {
              participant_group_type: {
                some: {
                  tipo: 'admin',
                },
              },
            },
            select: {
              name: true,
              image_url: true,
              participant_group_type: true,
            },
          },
        },
      })

      const formattedData = participantsAdmin.map((user) => {
        return {
          ...user,
          group_participant: user.group_participant
            .filter((group) => {
              return group.participant_group_type.some(
                (type) =>
                  type.tipo === 'admin' && type.participantId === user.id,
              )
            })
            .map((gp) => {
              return {
                name: gp.name,
                image_url: gp.image_url,
              }
            }),
        }
      })

      await redis.set(
        'all-admins',
        JSON.stringify(formattedData),
        'EX',
        60 * 10,
      )

      return response.json(formattedData)
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
