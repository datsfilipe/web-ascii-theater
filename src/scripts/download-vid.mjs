import youtubedl from 'youtube-dl-exec'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const downloadDir = path.resolve(__dirname, '../../public')

async function downloadVideo(url) {
  try {
    await youtubedl(url, {
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      format: 160,
      output: path.join(downloadDir, 'video.%(ext)s'),
    })

    console.log(`Video downloaded to ${downloadDir}`)
  } catch (error) {
    console.error(error)
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Insert video URL from YouTube: ', async (answer) => {
  if (answer) await downloadVideo(answer)

  console.log('Closing interface...')
  process.exit()
})

export default downloadVideo
