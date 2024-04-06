import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'

export default{
    plugins: [
        react(),
        glsl()
    ],
}
