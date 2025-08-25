import React, { useRef, useEffect } from 'react'
import './ChatParticles.css'

const ChatParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles = []
    const gridSize = 30
    const gridPoints = []

    // 创建网格点 - 更密集的网络节点
    for (let x = 0; x <= canvas.width; x += gridSize) {
      for (let y = 0; y <= canvas.height; y += gridSize) {
        gridPoints.push({ 
          x, 
          y, 
          originX: x, 
          originY: y,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        })
      }
    }

    // 创建光子粒子 - 更多粒子，更丰富的效果
    for (let i = 0; i < 120; i++) {
      const type = Math.random() > 0.7 ? 'photon' : 'normal'
      const baseHue = type === 'photon' ? Math.random() * 60 + 180 : Math.random() * 60 + 200
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'photon' ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * (type === 'photon' ? 2.5 : 1.2),
        speedY: (Math.random() - 0.5) * (type === 'photon' ? 2.5 : 1.2),
        color: `hsl(${baseHue}, 90%, 70%)`,
        alpha: type === 'photon' ? Math.random() * 0.6 + 0.4 : Math.random() * 0.4 + 0.2,
        trail: [],
        type: type,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.02
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制深色渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0,
        canvas.width / 2, 
        canvas.height / 2, 
        Math.max(canvas.width, canvas.height)
      )
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)')
      gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 更新网格点脉冲效果
      gridPoints.forEach(point => {
        point.pulse += point.pulseSpeed
        const pulseValue = Math.sin(point.pulse) * 3
        point.x = point.originX + pulseValue
        point.y = point.originY + pulseValue
      })

      // 绘制动态粒子带轨迹
      particles.forEach(particle => {
        // 绘制粒子轨迹
        if (particle.trail.length > 0) {
          ctx.strokeStyle = particle.color
          ctx.globalAlpha = 0.1
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y)
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y)
          }
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // 绘制粒子 - 光子效果
        if (particle.type === 'photon') {
          // 光子发光效果
          particle.pulse += particle.pulseSpeed
          const glowSize = particle.size * (Math.sin(particle.pulse) * 0.3 + 1.2)
          const glowAlpha = particle.alpha * (Math.sin(particle.pulse) * 0.2 + 0.8)
          
          // 发光光晕
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize * 3
          )
          gradient.addColorStop(0, particle.color.replace('hsl', 'hsla').replace(')', ', 0.8)'))
          gradient.addColorStop(1, particle.color.replace('hsl', 'hsla').replace(')', ', 0)'))
          
          ctx.fillStyle = gradient
          ctx.globalAlpha = glowAlpha * 0.6
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, glowSize * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // 绘制粒子主体
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        // 更新轨迹
        particle.trail.push({ x: particle.x, y: particle.y })
        if (particle.trail.length > 10) {
          particle.trail.shift()
        }

        // 更新位置
        particle.x += particle.speedX
        particle.y += particle.speedY

        // 边界检查并反弹
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
          particle.trail = [] // 清除轨迹
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
          particle.trail = [] // 清除轨迹
        }
      })

      // 绘制动态连接线 - 更明显的网络效果
      ctx.strokeStyle = 'rgba(66, 153, 225, 0.15)'
      ctx.lineWidth = 0.3
      
      for (let i = 0; i < gridPoints.length; i++) {
        for (let j = i + 1; j < gridPoints.length; j++) {
          const p1 = gridPoints[i]
          const p2 = gridPoints[j]
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          
          if (dist < 120) {
            const alpha = 1 - (dist / 120) // 距离越近越明显
            ctx.globalAlpha = alpha * 0.2
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // 绘制网络节点
      gridPoints.forEach(point => {
        const pulse = Math.sin(point.pulse) * 0.3 + 0.7
        ctx.fillStyle = `rgba(66, 153, 225, ${pulse * 0.3})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1.5 * pulse, 0, Math.PI * 2)
        ctx.fill()
      })

      // 随机生成能量光束效果
      if (Math.random() < 0.02) {
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height
        const endX = Math.random() * canvas.width
        const endY = Math.random() * canvas.height
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, 'rgba(66, 153, 225, 0.3)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)')
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="chat-particles" />
}

export default ChatParticles