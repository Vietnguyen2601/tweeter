import { Router } from 'express'
import { serveImageController, serveVideoStreamController } from '~/controllers/media.controller'

const staticRoutes = Router()

staticRoutes.get('/image/:namefile', serveImageController)
staticRoutes.get('/video-stream/:namefile', serveVideoStreamController)

export default staticRoutes
