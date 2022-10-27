import { useEffect, useRef } from 'react'

interface Props {
  customStyles?: React.CSSProperties;
  framesDir: string;
  loop?: boolean;
  width: number;
  height: number;
}

const BadApple = ({ customStyles, framesDir, loop, width, height }: Props) => {
  const playerComponent = useRef<HTMLPreElement>(null)

  const symbols = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. '

  const transformIntoGrayScale = (r: number, g: number, b: number) => Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b)
  const transformIntoGrayScales = (ctx: CanvasRenderingContext2D, imgWidth: number, imgHeight: number) => {
    const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight)

    const grayScales = []

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r: number = imgData.data[i]
      const g: number = imgData.data[i + 1]
      const b: number = imgData.data[i + 2]

      const grayScale = transformIntoGrayScale(r, g, b)
      imgData.data[i] = imgData.data[i + 1] = imgData.data[
        i + 2
      ] = grayScale

      grayScales.push(grayScale)
    }

    ctx.putImageData(imgData, 0, 0)

    return grayScales
  }

  const getFontRatio = () => {
    const pre = document.createElement('pre')
    pre.style.display = 'inline'
    pre.textContent = ' '

    document.body.appendChild(pre)
    const { width, height } = pre.getBoundingClientRect()
    document.body.removeChild(pre)

    return height / width
  }

  const clampDimensions = (imgWidth: number, imgHeight: number) => {
    const rectifiedWidth = Math.floor(getFontRatio() * imgWidth)

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
  
  const drawFrame = (frame: number) => {
    const img = new Image()
    img.src = `${framesDir}/frame-${frame}.jpeg`

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const [rectifiedWidth, rectifiedHeight] = clampDimensions(
          img.width,
          img.height
        )

        canvas.width = rectifiedWidth
        canvas.height = rectifiedHeight

        ctx.drawImage(img, 0, 0, rectifiedWidth, rectifiedHeight)

        const grayScales = transformIntoGrayScales(ctx, rectifiedWidth, rectifiedHeight)

        drawAsciiImage(grayScales, rectifiedWidth)
      }
    }
  }

  useEffect(() => {
    let frame = 1

    const interval = setInterval(() => {
      drawFrame(frame)
      
      if (frame === 6572) {
        if (loop) {
          frame = 1
        } else {
          clearInterval(interval)
        }
      } else {
        frame++
      }
    }, 1000 / 24)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <pre
        ref={playerComponent}
        style={{
          ...customStyles,
        }}
      />
    </>
  )
}

export default BadApple
