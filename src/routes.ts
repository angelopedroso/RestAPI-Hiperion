import { Router } from 'express'
import {
  botSettings,
  groupController,
  logController,
  participantController,
  summaryController,
} from './database/controller'

export const routes = Router()

// Group
routes.get('/groups', groupController.find)
routes.get('/groups/:id', groupController.findById)
routes.put('/groups/:id', groupController.update)

// Participant
routes.get('/users', participantController.find)
routes.get('/users/admin', participantController.findAdmins)

// Log
routes.get('/log', logController.find)
routes.get('/log/total-by-group', logController.findLogsByGroup)

// Summary
routes.get('/summary', summaryController.find)

// Bot Settings
routes.get('/bot', botSettings.find)
routes.put('/bot', botSettings.update)
