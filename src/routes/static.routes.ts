import { Router } from 'express'
import { serveImageController } from '~/controllers/media.controller'

const staticRoutes = Router()

staticRoutes.get('/image/:namefile', serveImageController)

export default staticRoutes
