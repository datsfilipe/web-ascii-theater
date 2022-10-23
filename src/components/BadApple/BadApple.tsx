import { useEffect, useRef } from 'react'

interface Props {
  width: number;
  height: number;
  customStyles?: React.CSSProperties;
}

const BadApple = ({ width, height, customStyles }: Props) => {
  const asciiImage = useRef<HTMLPreElement>(null)

  const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. '
  const rampLength = grayRamp.length

  function toGrayScale (r: number, g: number, b: number) {
    return Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b)
  }

  function getCharacterForGrayScale (grayScale: number) {
    const index = Math.floor(grayScale / 255 * (rampLength - 1))
    return grayRamp[index]
  }

  function convertToGrayScales (ctx: CanvasRenderingContext2D, imgWidth: number, imgHeight: number) {
    const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight)

    const grayScales = []

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r: number = imgData.data[i]
      const g: number = imgData.data[i + 1]
      const b: number = imgData.data[i + 2]

      const grayScale = toGrayScale(r, g, b)
      imgData.data[i] = imgData.data[i + 1] = imgData.data[
        i + 2
      ] = grayScale

      grayScales.push(grayScale)
    }

    ctx.putImageData(imgData, 0, 0)

    return grayScales
  }

  function drawAscii (grayScales: number[], imgWidth: number) {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
      let nextChars = getCharacterForGrayScale(grayScale)

      if ((index + 1) % imgWidth === 0) {
        nextChars += '\n'
      }

      return asciiImage + nextChars
    }, '')

    if (asciiImage.current) {
      asciiImage.current.textContent = ascii
    }
  }

  function getFontRatio () {
    const pre = document.createElement('pre')
    pre.style.display = 'inline'
    pre.textContent = ' '

    document.body.appendChild(pre)
    const { width, height } = pre.getBoundingClientRect()
    document.body.removeChild(pre)

    return height / width
  }

  function clampDimensions (imgWidth: number, imgHeight: number) {
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

    const render = async () => {
      for (let i = 1; i <= frames; i++) {
        if (context && asciiImage) {
          const img = await import(`../../assets/frames/frame-${i}.jpeg`)
          const image = new Image()
          image.src = img.default

          image.onload = () => {
            const [imgWidth, imgHeight] = clampDimensions(image.width, image.height)

            canvas.width = imgWidth
            canvas.height = imgHeight

            context.drawImage(image, 0, 0, imgWidth, imgHeight)

            const grayScales = convertToGrayScales(context, imgWidth, imgHeight)

            drawAscii(grayScales, imgWidth)
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
        ref={asciiImage}
        style={{
          ...customStyles,
        }}
      />
    </>
  )
}

export default BadApple
