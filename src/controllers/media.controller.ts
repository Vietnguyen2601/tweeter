import { Request, Response, NextFunction } from 'express'
import path from 'path'
import formidable from 'formidable' //hỗ trợ sàng lọc file truyền lên
import mediasService from '~/services/medias.services'
import { USERS_MESSAGES } from '~/constants/message'
import exp from 'constants'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import fs from 'fs'
import HTTP_STATUS from '~/constants/httpStatus'
import mime from 'mime'

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

export const serveVideoStreamController = (req: Request, res: Response) => {
  const { namefile } = req.params //lấy namefile từ param string
  const range = req.headers.range //lấy range từ header

  //lấy kích thước tối da của video
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile)
  const videoSize = fs.statSync(videoPath).size //statSync: trang thái của video
  //nếu ko có range thì yêu cầu range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires range header')
  }
  const CHUNK_SIZE = 10 ** 6 //1mb
  const start = Number(range.replace(/\D/g, '')) //lấy số từ range
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1) //lấy ra số nhỏ nhất trong 2 số
  //dung lượng của video
  const contentLength = end - start + 1 //độ dài của video
  const contentType = mime.getType(videoPath) || 'video/*' //lấy ra kiểu của video
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers) //trả về phần của video
  const videoStream = fs.createReadStream(videoPath, { start, end }) //đọc video từ start đến end
  videoStream.pipe(res) //trả về video
}
