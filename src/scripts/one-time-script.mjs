import extractFrames from 'ffmpeg-extract-frames'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const videoPath = path.resolve(__dirname, '../assets/BadApple.mp4')
const framesPath = path.resolve(__dirname, '../../public/frames')

await extractFrames({
  input: videoPath,
  output: framesPath + '/frame-%d.jpeg',
  fps: 30,
})
