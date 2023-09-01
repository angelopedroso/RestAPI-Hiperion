import express from 'express'
import { routes } from '@/routes'

import { Redis } from 'ioredis'

import { configDotenv } from 'dotenv'
import { PrismaClient } from '@prisma/client'

configDotenv()

const prisma = new PrismaClient()

const redis = new Redis(process.env.REDIS_URL ?? '')

const app = express()

app.listen(3335, () => {
  console.log('Server is running')
})

app.use(express.json())

app.use(routes)

export { prisma, redis }
