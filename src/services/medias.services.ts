import sharp from 'sharp'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import { Request } from 'express'
import { UPLOAD_DIR } from '~/constants/dir'
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
        const newPath = UPLOAD_DIR + '/' + newFileName
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
}

const mediasService = new MediasService()
export default mediasService
