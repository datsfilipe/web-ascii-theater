import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

interface Props {
  customStyles?: React.CSSProperties;
  framesDir: string;
  framesCount?: number;
  loop?: boolean;
  width: number;
  height: number;
}

const AsciiTheater = ({ customStyles, framesDir, framesCount, loop, width, height }: Props) => {
  const playerComponent = useRef<HTMLPreElement>(null)
  const symbols = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. '
  const animationFrame = useRef<number | null>(null)
  const currentFrame = useRef(1)
  const [fontRatio, setFontRatio] = useState(0)
  const canvas = document.createElement('canvas')
  
  useEffect(() => {
    if (playerComponent.current) {
      const pre = document.createElement('pre')
      pre.style.display = 'inline'
      pre.textContent = ' '
  
      document.body.appendChild(pre)
      const { width, height } = pre.getBoundingClientRect()
      document.body.removeChild(pre)
  
      setFontRatio(height / width)
    }
  }, [setFontRatio])

  const clampDimensions = useMemo(() => (imgWidth: number, imgHeight: number) => {
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
  }, [fontRatio, height, width])
  
  const transformIntoGrayScale = useMemo(
    () => (r: number, g: number, b: number) => Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b),
    []
  )

  const wrapTransformIntoGrayScale = useMemo(() => (imageData: ImageData, index: number) => {
    const r: number = imageData.data[index]
    const g: number = imageData.data[index + 1]
    const b: number = imageData.data[index + 2]

    const grayScale = transformIntoGrayScale(r, g, b)

    return grayScale
  }, [])
  
  const getSymbolByGrayScale = useMemo(
    () => (grayScale: number) => {
      const index = Math.floor(grayScale / 255 * (symbols.length - 1))
      return symbols[index]
    },
    [symbols]
  )
  
  const drawAsciiImage = useMemo(
    () => (grayScales: number[], imgWidth: number) => {
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
    }, [getSymbolByGrayScale])

  const play = useCallback(async () => {
    let frameLoaded = true
    
    const frame = new Image()
    frame.src = `${framesDir}/frame-${currentFrame.current}.jpg`

    frame.onload = () => {
      frameLoaded = true
    }
    
    const playInterval = setInterval(() => {
      if (currentFrame.current === framesCount && loop) {
        currentFrame.current = 1
      } else if (currentFrame.current === framesCount) {
        clearInterval(playInterval)
        return
      }

      if (frameLoaded) {
        frameLoaded = false

        const { width: imgWidth, height: imgHeight } = frame
        const [rectifiedWidth, rectifiedHeight] = clampDimensions(imgWidth, imgHeight)
        canvas.width = rectifiedWidth
        canvas.height = rectifiedHeight

        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (!context) return

        context.drawImage(frame, 0, 0, rectifiedWidth, rectifiedHeight)
        if (rectifiedWidth === 0) return

        const imageData = context.getImageData(0, 0, rectifiedWidth, rectifiedHeight)

        const grayScales = []

        for (let i = 0; i < imageData.data.length; i += 4) {
          const grayScale = wrapTransformIntoGrayScale(imageData, i)

          grayScales.push(grayScale)
        }

        drawAsciiImage(grayScales, rectifiedWidth)

        currentFrame.current += 1

        frame.src = `${framesDir}/frame-${currentFrame.current}.jpg`
      } else {
        currentFrame.current += 1
      }
    }, 1000 / 25)
  }, [clampDimensions, drawAsciiImage, framesDir, loop, transformIntoGrayScale, canvas])

  useEffect(() => {
    play()
    return () => {
      cancelAnimationFrame(animationFrame.current as number)
    }
  }, [play])

  return (
    <pre
      ref={playerComponent}
      style={{
        ...customStyles,
        display: 'block',
        whiteSpace: 'pre',
        margin: 0,
        overflow: 'hidden',
      }}
    />
  )
}

export default AsciiTheater
