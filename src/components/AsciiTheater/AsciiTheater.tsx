import { useEffect, useRef, useState } from 'react'

interface Props {
  customStyles?: React.CSSProperties;
  framesDir: string;
  framesCount?: number;
  loop?: boolean;
  width: number;
  height: number;
}

let finished = false
const symbols = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. '
const fps = 60

const AsciiTheater = ({ customStyles, framesDir, framesCount, loop, width, height }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const playerComponent = useRef<HTMLPreElement>(null)
  const currentFrame = useRef(1)
  const [fontRatio, setFontRatio] = useState(0)

  useEffect(() => {
    const pre = document.createElement('pre')
    pre.style.display = 'inline'
    pre.textContent = ' '
  
    document.body.appendChild(pre)
    const { width, height } = pre.getBoundingClientRect()
    document.body.removeChild(pre)
  
    setFontRatio(height / width)
  }, [setFontRatio])

  const clampDimensions = (imgWidth: number, imgHeight: number) => {
    const rectifiedWidth = Math.floor(fontRatio * imgWidth)
  
    if (imgHeight > height) {
      const reducedWidth = Math.floor(rectifiedWidth * height / imgHeight)
      return [reducedWidth, height]
    }
  
    if (imgWidth > width) {
      const reducedHeight = Math.floor(imgHeight * height / rectifiedWidth)
      return [width, reducedHeight]
    }
  
    return [rectifiedWidth, height]
  }
  
  const transformIntoGrayScale = (r: number, g: number, b: number) => Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b)

  const wrapTransformIntoGrayScale = (imageData: ImageData, index: number) => {
    const r: number = imageData.data[index]
    const g: number = imageData.data[index + 1]
    const b: number = imageData.data[index + 2]

    const grayScale = transformIntoGrayScale(r, g, b)

    return grayScale
  }
  
  const getSymbolByGrayScale = (grayScale: number) => {
    const index = Math.floor(grayScale / 255 * (symbols.length - 1))
    return symbols[index]
  }
  
  const drawAsciiImage = (grayScales: number[], imgWidth: number) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
      let nextChars = getSymbolByGrayScale(grayScale)

      if ((index + 1) % imgWidth === 0) {
        nextChars += '\n'
      }

      return asciiImage + nextChars
    }, '')

    if (playerComponent.current) {
      playerComponent.current.textContent = ascii
    }
  }

  const playFrame = (frame: HTMLImageElement, context: CanvasRenderingContext2D) => {
    const [clampedWidth, clampedHeight] = clampDimensions(frame.width, frame.height)
    if (!clampedWidth || !clampedHeight) return

    if (canvas.current) {
      canvas.current.width = clampedWidth
      canvas.current.height = clampedHeight
    }

    context.drawImage(frame, 0, 0, clampedWidth, clampedHeight)

    const imageData = context.getImageData(0, 0, clampedWidth, clampedHeight)
    const grayScales = []

    for (let i = 0; i < imageData.data.length; i += 4) {
      const grayScale = wrapTransformIntoGrayScale(imageData, i)
      grayScales.push(grayScale)
    }

    drawAsciiImage(grayScales, clampedWidth)
  }

  const play = () => {
    const context = canvas.current?.getContext('2d', { alpha: false, willReadFrequently: true })

    if (context && framesCount && framesCount > 0) {
      const frameIndex = currentFrame.current % framesCount
      const img = new Image()
      img.src = `${framesDir}/frame-${frameIndex}.jpg`
      img.onload = () => playFrame(img, context)

      currentFrame.current += 1

      if (currentFrame.current <= framesCount || loop) {
        setTimeout(() => play(), framesCount / fps)
      } else {
        return finished = true
      }
    }
  }

  useEffect(() => {
    play()

    return () => {
      finished = false
    }
  }, [canvas, framesDir, framesCount, loop, play])

  return (
    <>
      <canvas ref={canvas} width={width} height={height} style={{ display: 'none' }} />
      <pre
        ref={playerComponent}
        style={{
          ...customStyles,
          display: 'block',
          overflow: 'hidden',
          whiteSpace: 'pre',
          margin: 0,
        }}
      />
    </>
  )
}

export default AsciiTheater
export { finished }
export { fps }
