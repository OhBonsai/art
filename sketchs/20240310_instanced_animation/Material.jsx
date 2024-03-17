import {MeshPhysicalMaterial, Texture, Uniform} from "three";
import {forwardRef, useState} from "react";
import {extend, useFrame} from "@react-three/fiber";
import * as THREE from "three";

class WaveMaterialImpl extends MeshPhysicalMaterial {


    constructor(parameters) {
        super(parameters);
        this._time = {value:0}
        this._uFBO = {value: new THREE.Texture()}
        this._rampColor1 = {value: new THREE.Color('#292d06')}
        this._rampColor2 = {value: new THREE.Color('#020284')}
        this._rampColor3 =  {value: new THREE.Color('#0000ff')}
        this._rampColor4 = {value: new THREE.Color('#71c7f5')}
        this._lightColor ={value: new THREE.Color('#ffe9e9')}
        this._uNumber = {value: 12.}
        this._uSize = {value: 7.}
        this._uProgress = {value: 0.}
    }

    onBeforeCompile(shader) {
        Object.assign(shader.uniforms, {
            time: this._time,
            lightColor: this._lightColor,
            uFBO: this._uFBO,
            ramp_color_one: this._rampColor1,
            ramp_color_two: this._rampColor2,
            ramp_color_three: this._rampColor3,
            ramp_color_four: this._rampColor4,
            uNumber: this._uNumber,
            uSize: this._uSize,
            uProgress: this._uProgress,

        })
        shader.vertexShader = shader.vertexShader.replace(
            `#include <common>`,
            `#include <common>
            uniform float time;
            uniform vec3 lightColor;
            varying vec2 vUv;
            attribute vec2 instanceUV;
            uniform sampler2D uFBO;
            uniform vec3 ramp_color_one;
            uniform vec3 ramp_color_two;
            uniform vec3 ramp_color_three;
            uniform vec3 ramp_color_four;
           uniform float uNumber;
            uniform float uSize; 
            uniform float uProgress;
            varying float vHeight;
            varying float vHeightUV;
            `
        )

        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            vHeightUV = clamp(position.y * 2., 0., 1.0);
            
            float xNumber = time / 5.0;
            xNumber = mod((uNumber + xNumber) , (uSize * uSize));
            float xProgress = clamp( mod((time / 5.0), 1.0) * 5.0 / 4.0 , 0., 1.0);
            
            float xOuterProgress = clamp(1.1 * xProgress, 0., 1.0);
            float xInnerProgress =  clamp(1.1 * xProgress - 0.05, 0., 1.0);
            
            float radius = 1.41;
            float dist = distance(instanceUV, vec2(0.5, 0.5));
            float outerCircle = smoothstep(
                (xOuterProgress - 0.1) * radius,
                (xOuterProgress) * radius,
                dist
            );
            float innerCircle = smoothstep(
                (xInnerProgress - 0.1) * radius,
                (xInnerProgress) * radius,
                dist
            );
            
            
            
            bool edge = (instanceUV.x < 0.05 || instanceUV.x > 0.95 || instanceUV.y < 0.05 || instanceUV.y > 0.95);
            vec2 uv1 = vec2( instanceUV.x, 1.0- instanceUV.y);
            vec2 start = floor(vec2( mod(xNumber, uSize), xNumber/uSize));
            vec2 nextStart = floor(vec2(mod(xNumber + 1., uSize), mod((xNumber + 1.0)/uSize, uSize)));
            vec2 scaledUV = (uv1 + start) / uSize;
            vec2 nextScaledUV = (uv1 + nextStart)/ uSize;
  
            vec4 transformScale1 = texture2D(uFBO, scaledUV);
            vec4 transformScale2 = texture2D(uFBO, nextScaledUV);
            float scale1 = (transformScale1.r > 0.1 && !edge) ? 1.0 : 0.0  ;
            float scale2 = (transformScale2.r > 0.1 && !edge) ? 1.0 : 0.0  ;
            float scale = mix(scale1, scale2,  xProgress);
            // visible to unvisible
            if (scale2 < scale1) {
                scale = clamp(mix(scale1, scale2, xProgress * 3.0), 0.0, 1.0);
            }
            
            
            float transition = mix(scale1, scale2,  xProgress); 
            
            transformed *= scale;
            //transformed.y += transition*5.;
            transformed.y += (1.0 - outerCircle + innerCircle )* 10.;
            //transformed.y += smoothstep(0.0, 1.0, (distance(instanceUV, vec2(0.5, 0.5)) * 2.0) -  xInnerProgress- 0.01) * 10.;
            
            
            vHeight = transformed.y ;
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `#include <common>
            uniform float time;
            uniform vec3 lightColor;
            varying vec2 vUv;
            varying float vHeight;
            varying float vHeightUV;
            //attribute vec2 instanceUV;
            uniform sampler2D uFBO;
            uniform vec3 ramp_color_one;
            uniform vec3 ramp_color_two;
            uniform vec3 ramp_color_three;
            uniform vec3 ramp_color_four;
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <color_fragment>`,
            `
            #include <color_fragment>
            vec3 highlight = mix(ramp_color_three, ramp_color_four, vHeightUV);
            diffuseColor.rgb  = ramp_color_two;
            diffuseColor.rgb = mix(diffuseColor.rgb, ramp_color_three, vHeightUV);
            diffuseColor.rgb = mix(diffuseColor.rgb, highlight, clamp(vHeight / 10. -.25, 0., 1.));
           `
        )
    }

    get progress() {
        return this._uProgress.value
    }

    set progress(v) {
        this._uProgress.value = v
    }

    get number() {
        return this._uNumber.value
    }

    set number(v) {
        this._uNumber.value = v
    }

    get size() {
        return this._uSize.value
    }

    set size(v) {
        this._uSize.value = v
    }


    get time() {
        return this._time.value
    }


    set time(v) {
        this._time.value = v
    }

    get lightColor() {
        return this._lightColor.value
    }
    set lightColor(v) {
        this._lightColor.value = v
    }

    get uFBO() {
        return this._uFBO.value
    }
    set uFBO(v) {
        this._uFBO.value = v
    }

    get rampColor1() {
        return this._rampColor1.value
    }
    set rampColor1(v) {
        this._rampColor1.value = v
    }

    get rampColor2() {
        return this._rampColor2.value
    }
    set rampColor2(v) {
        this._rampColor2.value = v
    }

    get rampColor3() {
        return this._rampColor3.value
    }
    set rampColor3(v) {
        this._rampColor3.value = v
    }

    get rampColor4() {
        return this._rampColor4.value
    }
    set rampColor4(v) {
        this._rampColor4.value = v
    }

}


export const WaveMaterial = forwardRef(({
    uFBO, speed=1, ...props}, ref) => {
    const [material, setMaterial] = useState(() => {
        const mat = new WaveMaterialImpl()
        mat.uFBO = uFBO
        return mat
    })
    useFrame((state) => material && (material.time = state.clock.getElapsedTime() ))
    return <primitive object={material} ref={ref} attach="material" {...props} />
})

