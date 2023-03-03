import { Fragment, Suspense, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, Loader } from '@react-three/drei'
import { EffectComposer, Scanline, Vignette } from '@react-three/postprocessing'
import { getProject } from '@theatre/core'
// import studio from '@theatre/studio'
import { editable as e, SheetProvider, PerspectiveCamera } from '@theatre/r3f'
import state from '../public/state.json'

import { Stretch as StretchEffect } from './Stretch'

// studio.initialize()

const demoSheet = getProject('Sheet', { state: state }).sheet('Demo Sheet')

export default function App() {
  useEffect(() => {
    demoSheet.project.ready.then(() => demoSheet.sequence.play({ iterationCount: Infinity, range: [0, 7] }))
  }, [])

  return (
    <Fragment>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 100], fov: 22 }}>
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera theatreKey="Camera" makeDefault position={[0, 0, 100]} fov={22} />
          <fog attach="fog" args={['#f0f0f0', 100, 150]} />
          <color attach="background" args={['#f0f0f0']} />
          <spotLight
            penumbra={1}
            angle={1}
            castShadow
            position={[10, 60, -5]}
            intensity={8}
            shadow-mapSize={[512, 512]}
          />
          <Suspense fallback={null}>
            <hemisphereLight intensity={0.2} />
            <ambientLight intensity={0.5} />
            <Environment preset="warehouse" />
            <Stretch
              sheet={demoSheet}
              font="/BasementGrotesque.otf"
              fontSize={7}
              lineHeight={1}
              color="black"
              material-toneMapped={false}
              material-fog={false}
              anchorX="center"
              anchorY="middle"
            />
          </Suspense>
          <Effects />
        </SheetProvider>
      </Canvas>
      <Loader />
    </Fragment>
  )
}

function Effects() {
  const [harmony, set] = useState(0)
  const ref = useRef()

  useFrame((state) => {
    let percent = Math.sin(state.clock.elapsedTime) ** 3
    set(1 - percent)
  })

  return (
    <EffectComposer>
      <StretchEffect />
      <Vignette
        offset={0.3} // vignette offset
        darkness={0.2} // vignette darkness
        eskil={false}
      />
      <Scanline theatreKey="Scanline" ref={ref} opacity={0 + Math.abs(harmony)} density={1 + harmony} />
    </EffectComposer>
  )
}

function Stretch({ sheet, displacement = 12, ...props }) {
  const [opacity, set] = useState(0)

  const obj = sheet.object('description-opacity', { opacity: 0 })

  useLayoutEffect(() => {
    const unsubscribeFromChanges = obj.onValuesChange((newValues) => {
      set(newValues.opacity)
    })
    return unsubscribeFromChanges
  }, [obj])

  return (
    <e.group theatreKey="Logo" position={[-3, 0, 0]}>
      <e.group theatreKey="Off" position={[-2.2, 3.5, 0]}>
        <Text {...props}>Of</Text>
        <e.mesh theatreKey="f-Stretch" position={[4.6, 1.48, 1]}>
          <planeGeometry args={[1, 1.11, 1]} />
          <meshBasicMaterial color="black" />
        </e.mesh>
        <e.group theatreKey="f-">
          <Text {...props} position={[7.65, 0, 0]}>{`f-`}</Text>
        </e.group>
        <e.group theatreKey="collective">
          <SubText position={[13, 3, 0]} text={`A collective of`} opacity={opacity} />
        </e.group>
      </e.group>
      <e.group theatreKey="Brand" position={[0, -3.5, 0]}>
        <e.group theatreKey="caption" position={[-7.25, 0.5, 0.1]}>
          <SubText position={[0, 1, 0]} text={`projects. experiences. and`} opacity={opacity} />
          <SubText position={[-3, 0, 0]} text={`ideas spanning `} opacity={opacity} />
          <SubText italic position={[0, 0, 0]} text={`physical`} opacity={opacity} />
          <SubText italic position={[0, -1, 0]} text={`and digital realities`} opacity={opacity} />
        </e.group>
        <Text {...props}>{`Bra`}</Text>
        <e.mesh theatreKey="n–Stretch" anchorX="left" position={[7.55, 0.05, 1]}>
          <planeGeometry args={[1, 4.15, 1]} />
          <meshBasicMaterial color="black" />
        </e.mesh>
        <e.group theatreKey="nd">
          <Text {...props} position={[11.5, 0, 0]}>{`nd`}</Text>
        </e.group>
      </e.group>
    </e.group>
  )
}

function SubText({ italic = false, position, text, blur = 30, opacity = 0 }) {
  return (
    <Text
      position={position}
      font={italic ? '/OggText-MediumItalic.otf' : '/OggText-Medium.otf'}
      fontSize={0.8}
      lineHeight={1}
      textAlign="right"
      anchorX="right"
      style={{ backgroundColor: 'red', filter: `blur(${blur}px)` }}>
      {text}
      <meshBasicMaterial color="black" opacity={opacity} />
    </Text>
  )
}
