import { Request, Response } from 'express'
import { prisma, redis } from '@/index'

type Participant = {
  id: string
  p_id: string
  image_url: string | null
  name: string
}

type AntiTrava = {
  id: string
  status: boolean | null
  max_characters: number | null
}
interface GroupBody {
  _id: string
  g_id: string
  bem_vindo: boolean
  one_group: boolean
  auto_invite_link: boolean
  auto_sticker: boolean
  anti_link: boolean
  anti_porn: boolean
  name: string
  image_url: string | null
  anti_trava: AntiTrava
  black_list: Participant[]
}

class GroupController {
  async find(_: Request, response: Response) {
    try {
      const cache = await redis.get('all-groups')

      if (cache) {
        return response.json(JSON.parse(cache))
      }

      const allGroups = await prisma.group.findMany({
        include: {
          participants: true,
          black_list: true,
          anti_trava: true,
        },
      })

      await redis.set('all-groups', JSON.stringify(allGroups), 'EX', 60 * 5)

      return response.json(allGroups)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const { id } = request.params

      const cache = await redis.get(`group:${id}`)

      if (cache) {
        return response.json(JSON.parse(cache))
      }

      const group = await prisma.group.findUnique({
        where: {
          id,
        },
        include: {
          participants: true,
          black_list: true,
          anti_trava: true,
        },
      })

      await redis.set(`group:${id}`, JSON.stringify(group), 'EX', 60 * 5)

      return response.json(group)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params
      const {
        anti_link: antiLink,
        anti_porn: antiPorn,
        auto_invite_link: autoInviteLink,
        auto_sticker: autoSticker,
        bem_vindo: bemVindo,
        black_list: blackList,
        anti_trava: antiTrava,
        one_group: oneGroup,
      }: GroupBody = request.body

      const existsGroup = await prisma.group.findUnique({
        where: {
          id,
        },
      })

      if (!existsGroup) {
        return response.status(400).json({
          message: 'Group not found!',
        })
      }

      const group = await prisma.group.update({
        where: {
          id,
        },
        data: {
          bem_vindo: bemVindo,
          anti_link: antiLink,
          anti_porn: antiPorn,
          one_group: oneGroup,
          auto_sticker: autoSticker,
          auto_invite_link: autoInviteLink,
          anti_trava: {
            update: {
              status: antiTrava?.status,
              max_characters: antiTrava?.max_characters,
            },
          },
          // black_list: {
          //   connect: blackList?.map((user) => ({
          //     id: user.id,
          //   })),
          // },
        },
      })

      return response.status(201).json(group)
    } catch (error: Error | any) {
      return response.status(500).json({
        error: 'Something wrong happened, try again!',
        message: error.message,
      })
    }
  }
}

const groupController = new GroupController()

export { groupController }
