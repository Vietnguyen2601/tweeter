import { Request, Response, NextFunction } from 'express'
import path from 'path'
import formidable from 'formidable' //hỗ trợ sàng lọc file truyền lên
import mediasService from '~/services/medias.services'
import { USERS_MESSAGES } from '~/constants/message'
import exp from 'constants'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (error) => {
    if (error) {
      res.status((error as any).status).send('Not found image')
    }
  })
}
