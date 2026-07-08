"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const auroraUniforms = {
      time: { value: 0 },
      colorA: { value: new THREE.Color("#7DD3FC") },
      colorB: { value: new THREE.Color("#A78BFA") },
      colorC: { value: new THREE.Color("#6EE7B7") },
      opacity: { value: 0.16 },
    }

    const bandGeometry = new THREE.PlaneGeometry(12, 3.4, 64, 16)
    const bandMaterial = new THREE.ShaderMaterial({
      uniforms: auroraUniforms,
      vertexShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          vUv = uv;

          vec3 pos = position;
          float t = time * 0.12;
          pos.y += sin(pos.x * 0.35 + t) * 0.15;
          pos.y += sin(pos.x * 0.75 + t * 1.3) * 0.07;
          pos.x += sin(pos.y * 0.9 + t * 0.8) * 0.05;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;

        void main() {
          float t = time * 0.08;
          float wave = sin(vUv.x * 6.2831 + t) * 0.5 + 0.5;

          vec3 c1 = mix(colorA, colorB, vUv.x);
          vec3 c2 = mix(c1, colorC, wave * 0.45);

          float softY = smoothstep(0.0, 0.35, vUv.y) * (1.0 - smoothstep(0.65, 1.0, vUv.y));
          float edgeFade = smoothstep(0.02, 0.2, vUv.x) * (1.0 - smoothstep(0.8, 0.98, vUv.x));
          float alpha = opacity * softY * edgeFade;

          gl_FragColor = vec4(c2, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const bandTop = new THREE.Mesh(bandGeometry, bandMaterial)
    bandTop.position.set(0.8, 2.0, -1.2)
    bandTop.rotation.z = -0.12
    scene.add(bandTop)

    const bandMid = new THREE.Mesh(bandGeometry, bandMaterial)
    bandMid.position.set(-1.2, 0.7, -1.6)
    bandMid.rotation.z = 0.1
    bandMid.scale.set(1.15, 0.92, 1)
    scene.add(bandMid)

    const bandFar = new THREE.Mesh(bandGeometry, bandMaterial)
    bandFar.position.set(1.4, -0.9, -2.1)
    bandFar.rotation.z = -0.08
    bandFar.scale.set(1.05, 0.85, 1)
    scene.add(bandFar)

    const particleCount = window.innerWidth < 768 ? 90 : 140
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeed = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * 18
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 12
      particlePositions[i3 + 2] = -3.5 + Math.random() * 1.5
      particleSpeed[i] = 0.001 + Math.random() * 0.002
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.02 : 0.03,
      color: new THREE.Color("#A5B4FC"),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const clock = new THREE.Clock()
    let rafId = 0

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        auroraUniforms.time.value = elapsed

        bandTop.position.x = 0.8 + Math.sin(elapsed * 0.12) * 0.2
        bandMid.position.x = -1.2 + Math.sin(elapsed * 0.1 + 1.4) * 0.18
        bandFar.position.x = 1.4 + Math.sin(elapsed * 0.08 + 2.1) * 0.16

        const pos = particlesGeometry.attributes.position.array as Float32Array
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          pos[i3 + 1] += particleSpeed[i]
          if (pos[i3 + 1] > 6) {
            pos[i3 + 1] = -6
            pos[i3] = (Math.random() - 0.5) * 18
          }
        }
        particlesGeometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(rafId)

      container.removeChild(renderer.domElement)

      bandGeometry.dispose()
      bandMaterial.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 opacity-70 dark:opacity-55"
      style={{ pointerEvents: "none" }}
    />
  )
}
