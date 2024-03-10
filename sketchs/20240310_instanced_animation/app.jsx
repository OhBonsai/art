import {useControls} from "leva";
import React, {useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {Instance, Instances, shaderMaterial, useGLTF, useTexture} from "@react-three/drei";
import vertexShader from "./shader/vertex.glsl"
import fragmentShader from "./shader/fragment.glsl"
import {useFrame, useLoader, extend, useThree} from "@react-three/fiber";
import * as THREE from "three";
import {bool} from "three/examples/jsm/nodes/shadernode/ShaderNode.js";

export default function World() {
    const options = useControls("scene", {
        moonColor: {
            value: "#ffffff",
            onChange:(v)=>{
            }
        }
    })

    const ref = useRef()
    const model = useGLTF("bar.glb").scene.children[0]
    const ambientOcclusionTexture = useTexture("ao.png")
    ambientOcclusionTexture.flipY = true
    const {viewport} = useThree()
    const size = 20
    const matrixBufferAttribute = useMemo(()=>{
        const bufferAttribute = new THREE.InstancedBufferAttribute(new Float32Array(size * size * 16), 16)

        const tmp = new THREE.Object3D()
        const width = 1.2

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                tmp.position.set(
                    width  *(i - size / 2 ),
                    0 ,
                    width * (j - size / 2)
                );
                tmp.updateMatrix()
                tmp.matrix.toArray(bufferAttribute.array,  (i*size + j) * 16)
            }
        }
        return bufferAttribute
    }, [])


    const geometry = model.geometry
    const material = new THREE.MeshPhysicalMaterial({
        roughness: 0.75,
        map: ambientOcclusionTexture,
        aoMap: ambientOcclusionTexture,
        aoMapIntensity: 0.75,
    })

    return <group>
        {/*<mesh geometry={model.geometry}>*/}
        {/*    <someMaterial/>*/}
        {/*</mesh>*/}

        <instancedMesh ref={ref} args={[geometry, material, size*size]} instanceMatrix={matrixBufferAttribute}/>
        {/*<Instances ref={ref} material={material} geometry={geometry} range={size*size}>*/}
        {/*    {[1,2,3,4,5].map((_, idx)=>{*/}
        {/*        return <Instance/>*/}
        {/*    })}*/}
        {/*</Instances>*/}

        {/*<primitive object={model}/>*/}

        {/*<mesh>*/}
        {/*    <planeGeometry args={[2, 2, 2, 2]}/>*/}
        {/*    <someMaterial uViewport={new THREE.Vector2(viewport.width, viewport.height)}/>*/}
        {/*</mesh>*/}
    </group>
}


const SomeMaterial = shaderMaterial(
    {
        uViewport: new THREE.Vector2(1000, 1000)
    },
    vertexShader,
    fragmentShader,
    (m) => {
        m.side = THREE.DoubleSide
        m.extensions.derivatives = true
    },
)

extend({SomeMaterial})