import { useEffect, useRef } from 'react'

interface Props {
  width: number;
  height: number;
  customStyles?: React.CSSProperties;
}

const BadApple = ({ width, height, customStyles }: Props) => {
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

  useEffect(() => {
    const frames = 6572

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.imageSmoothingEnabled = false
    canvas.style.imageRendering = 'pixelated'

    const render = async () => {
      for (let i = 1; i <= frames; i++) {
        if (context && playerComponent.current) {
          const img = await import(`../../assets/frames/frame-${i}.jpeg`)
          const image = new Image()
          image.src = img.default

          image.onload = () => {
            const [imgWidth, imgHeight] = clampDimensions(image.width, image.height)

            canvas.width = imgWidth
            canvas.height = imgHeight

            context.drawImage(image, 0, 0, imgWidth, imgHeight)

            const grayScales = transformIntoGrayScales(context, imgWidth, imgHeight)

            drawAsciiImage(grayScales, imgWidth)
          }
        }
      }
    }

    render()
  }, [])

  return (
    <>
      <canvas id="canvas" width={width} height={height} style={{ display: 'none' }} />
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
