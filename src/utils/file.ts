//nếu không có thư mục chứa file thì sẽ tạo ra
import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs' //fs là file system (thư viện giúp handle các đường dẫn)
import path from 'path'
import { Files } from 'formidable'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  const uploadFolder = path.resolve('uploads')
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true //cho các đường dẫn lồng vào nhau
    }) //nếu không có đường dẫn thì sẽ tạo ra
  }
}

//hàm giúp lấy cái tên của bức hình mà không lấy cái đuôi
export const getNameFromFullname = (filename: string) => {
  //[asdasdasdasd, png]
  const nameArray = filename.split('.')
  nameArray.pop() //xóa đi phần tử cuối cùng
  return nameArray.join('')
}

//hàm xử lý file mà client đã gửi lên
export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_TEMP_DIR),
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 4, //300kb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      //cái file đưa lên có phải image ko và dạng file có phải là image ko
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid ') as any)
      }
      return valid
    }
  })

  //1 promise sẽ trả ra 1 file
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      return resolve(files.image as File[])
    })
  })
}
