import { serializeFlowchartSvg } from './svg'

export interface PngExportOptions {
  scale?: number
  background?: string
}

export function svgStringToPngBlob(
  svgMarkup: string,
  width: number,
  height: number,
  scale = 2,
  background = '#ffffff',
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil(width * scale)
        canvas.height = Math.ceil(height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('2D canvas context unavailable'))
          return
        }
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (!blob) reject(new Error('PNG encoding failed'))
          else resolve(blob)
        }, 'image/png')
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Failed to load SVG for PNG export'))
    img.src = url
  })
}

export async function exportFlowchartPng(
  host: Element,
  options: PngExportOptions = {},
): Promise<Blob> {
  const scale = options.scale ?? 2
  const background = options.background ?? '#ffffff'
  const markup = serializeFlowchartSvg(host, { background })
  const viewBoxMatch = /viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/.exec(markup)
  const width = viewBoxMatch ? Number(viewBoxMatch[3]) : 800
  const height = viewBoxMatch ? Number(viewBoxMatch[4]) : 600
  return svgStringToPngBlob(markup, width, height, scale, background)
}
