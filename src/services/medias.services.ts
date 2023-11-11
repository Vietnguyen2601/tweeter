import sharp from 'sharp'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { Request } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'

class MediasService {
  async uploadImage(req: Request) {
    //lưu ảnh vào thư mục uploads/temp
    const files = await handleUploadImage(req) //check
    //xử lý file bằng sharp giúp tối ưu hình ảnh
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFromFullname(file.newFilename) + '.jpg'
        const newPath = UPLOAD_IMAGE_DIR + '/' + newFileName
        const info = await sharp(file.filepath).jpeg().toFile(newPath) //loại bỏ các giá trị thừa (metadata)
        //xóa file trong temp
        fs.unlinkSync(file.filepath)

        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newFileName}`
            : `http://localhost:${process.env.PORT}/static/image/${newFileName}`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    //lưu video vào thư mục uploads/videos
    const files = await handleUploadVideo(req) //check

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const { newFilename } = file
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video/${newFilename}`
            : `http://localhost:${process.env.PORT}/static/video/${newFilename}`,
          type: MediaType.Video
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
