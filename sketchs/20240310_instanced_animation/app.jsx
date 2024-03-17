import {button, useControls} from "leva";
import React, {useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {
    Billboard,
    Circle,
    Instance,
    Instances,
    OrthographicCamera,
    PerspectiveCamera,
    shaderMaterial, TorusKnot, useFBO,
    useGLTF,
    useTexture
} from "@react-three/drei";
import vertexShader from "./shader/vertex.glsl"
import fragmentShader from "./shader/fragment.glsl"
import debugVertex from "./shader/debug.vert"
import debugFragment from "./shader/debug.frag"
import {useFrame, useLoader, extend, useThree, createPortal} from "@react-three/fiber";
import * as THREE from "three";
import {WaveMaterial} from "./Material.jsx";
import genAO from "./genAo.jsx";
import {Color} from "three";


const size =64
const canvas = genAO(size)
const cTexutre = new THREE.CanvasTexture(canvas)

export default function World() {

    const ref = useRef()
    const model = useGLTF("bar.glb").scene.children[0]
    const ambientOcclusionTexture = useTexture("ao.png")
    ambientOcclusionTexture.flipY = true
    const fboTexture = useTexture("fbo.png")

    const {viewport} = useThree()
    const [positionAttr, uvAttr] = useMemo(()=>{

        // position matrix 4
        const bufferAttribute = new THREE.InstancedBufferAttribute(new Float32Array(size * size * 16), 16)
        // uv
        const uvBufferAttribute = new THREE.InstancedBufferAttribute(new Float32Array(size * size * 2), 2)

        const dummy = new THREE.Object3D()
        const width = 1.3

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                uvBufferAttribute.array.set([i / (size) , j / (size) ], (i*size + j) * 2)
                // uvBufferAttribute.array[(i*size + j) * 2 ] = i / size
                // uvBufferAttribute.array[(i*size + j) * 2 + 1] = j / size

                dummy.position.set(
                    width  *(i - size / 2 ),
                    0 ,
                    width * (j - size / 2)
                );
                dummy.updateMatrix()
                dummy.matrix.toArray(bufferAttribute.array,  (i*size + j) * 16)
            }
        }
        return [bufferAttribute, uvBufferAttribute]
    }, [])

    const geometry = model.geometry
    geometry.setAttribute('instanceUV', uvAttr)

    const matRef = useRef()
    const options = useControls("scene", {
        rampColor1: {
            value: "#292d06",
            onChange:(v)=>{
                matRef.current.rampColor1 = new THREE.Color(v);
            }
        },
        rampColor2: {
            value: "#020284",
            onChange:(v)=>{
                matRef.current.rampColor2 = new THREE.Color(v);
            }
        },
        rampColor3: {
            value: "#0000ff",
            onChange:(v)=>{
                matRef.current.rampColor3 = new THREE.Color(v);

            }
        },
        rampColor4: {
            value: "#71c7f5",
            onChange:(v)=>{
                matRef.current.rampColor4 = new THREE.Color(v);
            }
        },
    })

    const gl = useThree(({gl}) => gl)
    const cam = useRef()


    const [scene, target] = useMemo(()=>{
        const target = new THREE.WebGLRenderTarget(gl.domElement.width, gl.domElement.height)
        const scene = new THREE.Scene()
        scene.background = new THREE.Color("#00efef")
        return [scene, target ]
    }, [])

    useFrame((state)=>{
        state.gl.setRenderTarget(target)
        state.gl.render(scene, cam.current)
        state.gl.setRenderTarget(null)
    })

    const options2 = useControls("debug", {
        number: {
            value: 18,
            min: 0,
            max: 49-1,
            step: 1,

        },
        progress: {
            value: 0,
            min: 0,
            max: 1.00,
            step: 0.001,
        }
    })



    return <group>
        <OrthographicCamera ref={cam} position={[0, 0,20]} zoom={200}/>
        <instancedMesh ref={ref} args={[geometry,null , size*size]} instanceMatrix={positionAttr}>
            <WaveMaterial ref={matRef} speed={1} uFBO={cTexutre} number={ options2.number} progress={options2.progress}/>
        </instancedMesh>

        {createPortal(<SyncDebugger />, scene)}

        <Billboard>
        <mesh scale={[0.005, 0.005, 0.005]} position={[0, 30, 0]}>
            <planeGeometry args={[gl.domElement.width,gl.domElement.height]}/>
            <meshBasicMaterial map={target.texture} side={THREE.DoubleSide}/>
        </mesh></Billboard>


    </group>
}


const DebugMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: cTexutre,
        uNumber: 0,
        uSize: 7,
    },
    debugVertex,
    debugFragment
)

extend({DebugMaterial})



function SyncDebugger() {

    const options = useControls("debug", {
        number: {
            value: 18,
            min: 0,
            max: 49-1,
            step: 1,

        },
    })

    const ref = useRef()
    useFrame((state) => ref.current && (ref.current.uTime = state.clock.getElapsedTime() ))


    return (
        <mesh>
            <planeGeometry args={[5, 5]}/>
            <debugMaterial uNumber={options.number} ref={ref}/>
        </mesh>
    )
}

