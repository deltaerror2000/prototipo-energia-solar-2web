import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

const daySky = new THREE.Color('#79c9ff')
const nightSky = new THREE.Color('#030a1c')
const dayFog = new THREE.Color('#bfe7ff')
const nightFog = new THREE.Color('#06132b')

function Panel({ position }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1.02, 0.07, 0.68]} />
      <meshStandardMaterial color="#082e63" metalness={0.55} roughness={0.28} />
      <Edges color="#a8c8db" threshold={12} />
    </mesh>
  )
}

function SolarArray() {
  const panels = []
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      panels.push(
        <Panel
          key={`${row}-${column}`}
          position={[-2.75 + column * 1.1, 0.13, -0.72 + row * 0.73]}
        />,
      )
    }
  }

  return <group position={[0, 3.04, 1.22]} rotation={[-0.37, 0, 0]}>{panels}</group>
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 2, 9]} />
        <meshStandardMaterial color="#765133" roughness={1} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <dodecahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#2f7a4f" roughness={.9} />
      </mesh>
      <mesh position={[-.55, 1.95, .15]} castShadow>
        <dodecahedronGeometry args={[.68, 1]} />
        <meshStandardMaterial color="#3f8f58" roughness={.9} />
      </mesh>
    </group>
  )
}

function Shrub({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[.38, 1]} />
      <meshStandardMaterial color="#4a9855" roughness={1} />
    </mesh>
  )
}

function House({ night }) {
  const glow = 0.35 + night * 3.8
  return (
    <group position={[1.7, 0, 0]}>
      <mesh position={[0, .12, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.5, .24, 5.5]} />
        <meshStandardMaterial color="#d8d2c4" roughness={.9} />
      </mesh>
      <mesh position={[0, 1.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 2.45, 5]} />
        <meshStandardMaterial color="#e8e2d4" roughness={.86} />
      </mesh>

      <mesh position={[-2.8, 1.3, 2.52]} castShadow>
        <boxGeometry args={[1.8, 2.05, .12]} />
        <meshStandardMaterial color="#8d5b32" roughness={.72} />
      </mesh>
      <mesh position={[-.2, 1.45, 2.55]}>
        <boxGeometry args={[2.7, 1.55, .1]} />
        <meshStandardMaterial color="#f0b84f" emissive="#ffad3b" emissiveIntensity={glow} metalness={.18} roughness={.22} />
      </mesh>
      <mesh position={[2.55, 1.45, 2.55]}>
        <boxGeometry args={[1.85, 1.55, .1]} />
        <meshStandardMaterial color="#f0b84f" emissive="#ffad3b" emissiveIntensity={glow} metalness={.18} roughness={.22} />
      </mesh>
      {[-1.55, 1.15, 1.65, 3.45].map((x) => (
        <mesh position={[x, 1.45, 2.62]} key={x}>
          <boxGeometry args={[.08, 1.72, .08]} />
          <meshStandardMaterial color="#20313d" metalness={.55} />
        </mesh>
      ))}

      <mesh position={[0, 2.87, 1.27]} rotation={[-0.37, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.65, .2, 2.82]} />
        <meshStandardMaterial color="#26333d" roughness={.68} />
      </mesh>
      <mesh position={[0, 2.87, -1.27]} rotation={[0.37, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.65, .2, 2.82]} />
        <meshStandardMaterial color="#313d44" roughness={.7} />
      </mesh>
      <mesh position={[-2.75, 3.72, -.3]} castShadow>
        <boxGeometry args={[.7, 1.35, .7]} />
        <meshStandardMaterial color="#d9d6cb" roughness={.85} />
      </mesh>
      <SolarArray />

      <mesh position={[0, .04, 4.15]} receiveShadow>
        <boxGeometry args={[8.2, .08, 2.4]} />
        <meshStandardMaterial color="#bfc3bd" roughness={.9} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((x) => <Shrub key={x} position={[x, .36, 2.95]} scale={.9} />)}
    </group>
  )
}

function Stars({ night }) {
  const positions = useMemo(() => {
    const data = new Float32Array(210 * 3)
    for (let i = 0; i < 210; i += 1) {
      const seed = (i * 16807) % 2147483647
      const seed2 = (seed * 48271) % 2147483647
      data[i * 3] = ((seed % 1000) / 1000 - .5) * 42
      data[i * 3 + 1] = 7 + (seed2 % 1000) / 1000 * 15
      data[i * 3 + 2] = -8 - ((seed + seed2) % 1000) / 1000 * 12
    }
    return data
  }, [])

  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#dfeaff" size={.08} transparent opacity={Math.max(0, night * 1.25 - .2)} sizeAttenuation />
    </points>
  )
}

function CameraRig({ night }) {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, delta) => {
    const mobile = size.width < 720
    target.set(
      mobile ? 9.8 : 11.8 - night * .8,
      mobile ? 8.7 : 8.4 + night * .7,
      mobile ? 14.5 : 14.7 - night * .9,
    )
    camera.position.lerp(target, 1 - Math.exp(-delta * 3.2))
    camera.lookAt(mobile ? 1.4 : .8, 1.1, 0)
    if (!(state.scene.background instanceof THREE.Color)) {
      state.scene.background = daySky.clone()
    }
    state.scene.background.lerpColors(daySky, nightSky, night)

    if (state.scene.fog) {
      state.scene.fog.color.lerpColors(dayFog, nightFog, night)
    }
  })
  return null
}

function World({ night }) {
  const sunLight = useRef()
  const moonLight = useRef()

  useFrame(() => {
    if (sunLight.current) sunLight.current.intensity = THREE.MathUtils.lerp(4.4, .12, night)
    if (moonLight.current) moonLight.current.intensity = THREE.MathUtils.lerp(0, 1.3, night)
  })

  return (
    <>
      <color attach="background" args={['#79c9ff']} />
      <fog attach="fog" args={['#bfe7ff', 18, 42]} />
      <ambientLight intensity={THREE.MathUtils.lerp(1.45, .18, night)} color={night > .5 ? '#7895c9' : '#fff3d6'} />
      <hemisphereLight args={[night > .5 ? '#244078' : '#a8ddff', night > .5 ? '#08101e' : '#637346', THREE.MathUtils.lerp(1.4, .28, night)]} />
      <directionalLight ref={sunLight} position={[8, 13, 7]} color="#fff0bd" castShadow shadow-mapSize={[1536, 1536]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} />
      <directionalLight ref={moonLight} position={[-9, 10, -4]} color="#90aef7" />

      <mesh position={[10, 10 - night * 4, -13]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffd85a" transparent opacity={Math.max(0, 1 - night * 1.5)} />
      </mesh>
      <mesh position={[-9, 11, -12]}>
        <sphereGeometry args={[.75, 32, 32]} />
        <meshBasicMaterial color="#e7efff" transparent opacity={Math.max(0, night * 1.3 - .25)} />
      </mesh>
      <Stars night={night} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color={night > .6 ? '#17372a' : '#5a9a4e'} roughness={1} />
      </mesh>
      <mesh position={[-4.9, .025, 3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 9]} />
        <meshStandardMaterial color="#c8c8c1" roughness={.95} />
      </mesh>
      <House night={night} />
      <Tree position={[-6.7, 0, -2.7]} scale={1.2} />
      <Tree position={[7.2, 0, -3.3]} scale={1.05} />
      <Tree position={[-7.7, 0, 4.4]} scale={.78} />
      <Tree position={[7.8, 0, 4.5]} scale={.72} />
      <CameraRig night={night} />
    </>
  )
}

export default function SolarScene({ night }) {
  return (
    <div className="solar-canvas" role="img" aria-label="Cena 3D animada de uma casa com painéis solares, mudando do dia para a noite conforme a rolagem">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [11.8, 8.4, 14.7], fov: 38, near: .1, far: 100 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <World night={night} />
      </Canvas>
    </div>
  )
}
