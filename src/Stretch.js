import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = `
uniform float time;

float cubicIn(float t) {
  return t * t * t;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(1.3, 30.0 * (t - 1.0));
}

void mainUv(inout vec2 uv) {
  float x =  ( uv.x - 0.5 ) * 2.0;
  float y =  ( uv.y - 0.5 ) * 2.0;

  // only edges
  if( abs( x ) < 0.1 ) {
    x = 0.0;
  } else {
    x = ( abs( x ) - 0.1 ) / 0.9;
  }

	uv.y -= y * ( exponentialIn( abs( x ) ) ) * 0.9;
}
`

let _uTime

// Effect implementation
class StretchEffect extends Effect {
  constructor({ time = 0 } = {}) {
    super('Stretch', fragmentShader, {
      uniforms: new Map([['time', new Uniform(time)]]),
    })

    _uTime = time
  }

  update(renderer, inputBuffer, deltaTime) {
    // this.uniforms.get("time").value += _uLineWidth;
    this.uniforms.get('time').value += deltaTime
  }
}

// Effect component
export const Stretch = forwardRef(({ time }, ref) => {
  const effect = useMemo(() => new StretchEffect(time), [time])
  return <primitive ref={ref} object={effect} dispose={null} />
})
