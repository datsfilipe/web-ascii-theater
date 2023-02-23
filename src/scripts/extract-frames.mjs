import extractFrames from 'ffmpeg-extract-frames'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const videoPath = path.resolve(__dirname, '../../public/video.mp4')
const framesPath = path.resolve(__dirname, '../../public/frames')
const extractedFramesPath = path.resolve(__dirname, '../../public/frames/extracts')

// fs.rmdirSync(framesPath, { recursive: true })

fs.mkdirSync(framesPath, { recursive: true })
fs.mkdirSync(extractedFramesPath, { recursive: true })

await extractFrames({
  input: videoPath,
  output: extractedFramesPath + '/frame-%d.jpg',
  fps: 25,
})

const files = fs.readdirSync(extractedFramesPath)
const promises = files.map((file) => {
  const filePath = path.resolve(extractedFramesPath + '/' + file)
  return sharp(filePath)
    .resize(200)
    .jpeg({ quality: 10 })
    .toFile(framesPath + '/' + file)
})

await Promise.all(promises)

fs.rmdirSync(extractedFramesPath, { recursive: true })

export default extractFrames
