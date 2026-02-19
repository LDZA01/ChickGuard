import { useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface HeatmapCanvasProps {
  data: number[][]
  width?: number
  height?: number
}

export default function HeatmapCanvas({ data, width = 800, height = 600 }: HeatmapCanvasProps) {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellWidth = width / data[0].length
    const cellHeight = height / data.length

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw heatmap
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        // Map value (0-100) to color
        const intensity = value / 100
        const red = Math.floor(255 * intensity)
        const green = Math.floor(255 * (1 - intensity))
        const blue = 50

        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.7)`
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)

        // Add border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)

        // Add value text
        if (value > 60) {
          ctx.fillStyle = '#fff'
          ctx.font = 'bold 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(
            value.toFixed(0),
            j * cellWidth + cellWidth / 2,
            i * cellHeight + cellHeight / 2
          )
        }
      })
    })

    // Draw legend
    drawLegend(ctx, width, height)
  }, [data, width, height, t])

  const drawLegend = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const legendWidth = 200
    const legendHeight = 20
    const legendX = canvasWidth - legendWidth - 20
    const legendY = canvasHeight - legendHeight - 20

    // Draw gradient
    const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0)
    gradient.addColorStop(0, 'rgba(50, 255, 50, 0.7)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 50, 0.7)')
    gradient.addColorStop(1, 'rgba(255, 50, 50, 0.7)')

    ctx.fillStyle = gradient
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = '#fff'
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // Add labels
    ctx.fillStyle = '#333'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(t.common.safe, legendX, legendY - 5)
    ctx.textAlign = 'right'
    ctx.fillText(t.common.highRisk, legendX + legendWidth, legendY - 5)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg border border-gray-200"
      />
    </div>
  )
}
