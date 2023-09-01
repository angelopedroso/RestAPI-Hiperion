import { Request, Response } from 'express'
import { GroupModel } from '@/database/schemas'
import { redis } from '@/server'

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
}

class GroupController {
  async find(_: Request, response: Response) {
    try {
      const cache = await redis.get('all-groups')

      if (cache) {
        return response.json(JSON.parse(cache))
      }

      const group = await GroupModel.find()

      await redis.set('all-groups', JSON.stringify(group), 'EX', 60 * 5)

      return response.json(group)
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

      const group = await GroupModel.findById(id)

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
        g_id: groupId,
        one_group: oneGroup,
      }: GroupBody = request.body

      const group = await GroupModel.findByIdAndUpdate(
        id,
        {
          antiLink,
          antiPorn,
          autoInviteLink,
          autoSticker,
          bemVindo,
          groupId,
          oneGroup,
        },
        { new: true },
      )

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
