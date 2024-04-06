import * as THREE from 'three'
import {applyProps} from "@react-three/fiber";
import sum from 'hash-sum'
import {useMemo} from "react";

const keycache = {}
const compcache = {}
const objcache = new WeakMap()

function reduceUUID(props) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value.uuid) {
            value = value.uuid
        }
        return {...acc, [key]:value}
    }, {})
}

function reduceCloned(props) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value.clone) value = value.clone()
        return { ...acc, [key]: value }
    }, {})
}


function SharedObject({type, args=[], ...props}) {
    const name = type.prototype.constructor.name
    const key = sum({name, args, ...reduceUUID(props)})
    const cachedkey = keycache[key]
    const object = useMemo(()=>{
        if (cachedkey) {
            return objcache.get(cachedkey)
        } else {
            const object = applyProps(new type(...args), reduceCloned(props))
            objcache.set((keycache[key]={}), object)
            return object
        }
    }, [])
    return <primitive object={object} key={key}/>
}

export const shared = new Proxy({}, {
    get(target, key ,receiver) {
        console.log(target, key, "target key")
        if (!compcache[key]) {
            const type = THREE[key.charAt(0).toUpperCase() + key.slice(1)]
            console.log(type, 'type')
            if(type) {
                let attach = undefined
                if (type.prototype instanceof THREE.Material) {
                    attach = 'material'
                } else if (type.prototype instanceof THREE.BufferGeometry) {
                    attach = 'geometry'
                }
                compcache[key] = (props) => <SharedObject type={type} attach={attach} {...props}/>
            }
        }

    }
})
