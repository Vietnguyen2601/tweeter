//nếu không có thư mục chứa file thì sẽ tạo ra
import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs' //fs là file system (thư viện giúp handle các đường dẫn)
import path from 'path'
import { Files } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //cho các đường dẫn lồng vào nhau
      }) //nếu không có đường dẫn thì sẽ tạo ra
    }
  })
}

//hàm giúp lấy cái tên của bức hình mà không lấy cái đuôi
export const getNameFromFullname = (filename: string) => {
  //[asdasdasdasd, png]
  const nameArray = filename.split('.')
  nameArray.pop() //xóa đi phần tử cuối cùng
  return nameArray.join('')
}

//hàm giúp lấy cái đuôi của bức hình mà không lấy cái tên
export const getExtentionFromFullname = (filename: string) => {
  //[asdasdasdasd, png]
  const nameArr = filename.split('.')
  return nameArr[nameArr.length - 1]
}

//hàm xử lý file mà client đã gửi lên
export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    // biến req về thành bức hình
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
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
  //giới hạn bức hình trông như thế nào

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

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    // biến req về thành bức hình
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR),
    maxFiles: 1,
    // keepExtensions: true, // có vấn đề với file video: lấy thừa
    maxFileSize: 50 * 1024 * 1024, //50mb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'))
      //cái file đưa lên có phải image ko và dạng file có phải là image ko
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid ') as any)
      }
      return valid
    }
  })
  //giới hạn bức hình trông như thế nào

  //1 promise sẽ trả ra 1 file
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!files.video) {
        return reject(new Error('Video is empty'))
      }
      //trong file{originalFilename, filepath: newFilename}
      //vì mình đã tắt keepExtends nên file ko có 'đuôi của file'
      const videos = files.video as File[] // lấy danh sách các video đã up lên
      //duyệt qua các video
      videos.forEach((video) => {
        const ext = getExtentionFromFullname(video.originalFilename as string) //lấy đuôi tên gốc
        video.newFilename += `${ext}` //lắp đuôi vào tên mới
        fs.renameSync(video.filepath, `${video.filepath}.${ext}`) //lắp đuôi vào filepath: đường dẫn đến file mới
      })
      return resolve(files.video as File[])
    })
  })
}
