import { useCallback, useEffect, useRef, useState } from 'react'

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
const fps = 25 // based on the FPS from the badapple extract script
// estimated bad case is 500ms latency, which is half the fps value
const BUFFER_SIZE = Math.max(Math.round(fps / 2), 5)
const bufferedImages = new Array(Math.max(Math.round(fps / 2), 5))

const AsciiTheater = ({ customStyles, framesDir, framesCount, loop, width, height }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const playerComponent = useRef<HTMLPreElement>(null)
  const currentFrame = useRef(0)
  const imageBuffer = useRef<Array<HTMLImageElement | null>>(new Array(BUFFER_SIZE));
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
      // TODO: is there a reason to convert to an array instead of directly to text?
      const grayScale = wrapTransformIntoGrayScale(imageData, i)
      grayScales.push(grayScale)
    }

    drawAsciiImage(grayScales, clampedWidth)
  }

  const preloadImage = useCallback((frameIndex: number) => {
    if (!framesCount || framesCount === 0) return;
    // NOCOMMIT: make sure index is correct/no off by ones, etc
    const actualFrameIndex = frameIndex % framesCount

    const bufferIndex = actualFrameIndex % BUFFER_SIZE

    const img = new Image()
    // +1 because image indexes start from 1?
    img.src = `${framesDir}/frame-${actualFrameIndex + 1}.jpg`
    img.onload = () => {
      imageBuffer.current[bufferIndex] = img
    };
    img.onerror = () => {
      imageBuffer.current[bufferIndex] = null
      console.error(`Failed to load image: ${img.src}`)
    };
  }, [framesDir, framesCount])

  const play = () => {
    const context = canvas.current?.getContext('2d', { alpha: false, willReadFrequently: true })

    if (context && framesCount && framesCount > 0) {
      const frameIndex = currentFrame.current % framesCount
      const img = imageBuffer.current[frameIndex % BUFFER_SIZE]

      if (!img || !img.complete) {
        // retry until image is present. Could consider more complex logic such as firing off load again or limiting retries.
        // 1ms is actually a pretty big chunk if it's 60fps
        setTimeout(() => play(), 1);
        return
      }

      playFrame(img, context);
      // consume buffered location
      imageBuffer.current[frameIndex % BUFFER_SIZE] = null;

      currentFrame.current += 1

      const nextFrameToBufferIndex = (currentFrame.current + BUFFER_SIZE);

      if (nextFrameToBufferIndex < framesCount || loop) {
        preloadImage(nextFrameToBufferIndex);
      }


      if (currentFrame.current < framesCount || loop) {
        const secondsPerFrame = 1 / fps;
        const msPerFrame = secondsPerFrame * 1000;
        setTimeout(() => play(), msPerFrame)
      } else {
        return finished = true
      }
    }
  }

  useEffect(() => {
    if (framesCount && framesCount > 0) {
      for (let i = 0; i < BUFFER_SIZE && i < framesCount; i++) {
        preloadImage(i);
      }

      const bufferHeadStart = setTimeout(() => play(), 500);

      return () => {
        finished = false;
        clearTimeout(bufferHeadStart)
      }
    }

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
