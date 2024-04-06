(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const l of u.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function i(o){if(o.ep)return;o.ep=!0;const u=t(o);fetch(o.href,u)}})();var h=`precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

vec2 guv() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 uv = gl_FragCoord.xy / uResolution;
    if (aspectRatio >= 1.0) {
        uv.x = (gl_FragCoord.x - (uResolution.x - uResolution.y) / 2.0) / uResolution.y;
    } else {
        uv.y = (gl_FragCoord.y - (uResolution.y - uResolution.x) / 2.0) / uResolution.x;
    }
    uv = (uv - 0.5) * 2.0;
    return uv;
}

void main()
{
    vec2 uv = guv();

    float radius = 0.5;
    float distance = length(uv);
    float alpha = smoothstep(radius - 0.01, radius + 0.01, distance);

    gl_FragColor = vec4(vec3(1.0), alpha);
}`,p=`attribute vec3 position;

void main()
{
    gl_Position = vec4(position, 1.0);
}`;const m=(e,n)=>{let t=e.createBuffer(),i=n instanceof Uint16Array||n instanceof Uint32Array?e.ELEMENT_ARRAY_BUFFER:e.ARRAY_BUFFER;return e.bindBuffer(i,t),e.bufferData(i,n,e.STATIC_DRAW),t},d=(e,n,t)=>{let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)||console.error("An error occurred compiling the shader: "+e.getShaderInfoLog(i)),i},g=(e,n)=>{let t=e.createProgram();for(let i of n)e.attachShader(t,i);return e.linkProgram(t),t},R=()=>{let e=document.getElementById("webgl");return e.width=window.innerWidth,e.height=window.innerHeight,e},A=e=>{let n=window.devicePixelRatio,t=e.getContext("webgl");return t||window.alert("WebGL not supported"),window.addEventListener("resize",()=>{e.width=Math.floor(window.innerWidth*n),e.height=Math.floor(window.innerHeight*n),t.viewport(0,0,e.width,e.height)}),t.clearColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.cullFace(t.BACK),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t},a=R(),r=A(a);let v=m(r,new Float32Array([-1,-1,0,-1,1,0,1,-1,0,1,-1,0,1,1,0,-1,1,0])),w=d(r,p,r.VERTEX_SHADER),y=d(r,h,r.FRAGMENT_SHADER),s=g(r,[w,y]),L=r.getUniformLocation(s,"uTime"),_=r.getUniformLocation(s,"uResolution"),c=r.getAttribLocation(s,"position");const f=()=>{r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.useProgram(s),r.viewport(0,0,a.width,a.height),r.scissor(0,0,a.width,a.height),r.uniform1f(L,performance.now()/1e3),r.uniform2f(_,a.width,a.height),r.bindBuffer(r.ARRAY_BUFFER,v),r.vertexAttribPointer(c,3,r.FLOAT,!1,0,0),r.enableVertexAttribArray(c),r.drawArrays(r.TRIANGLES,0,6),requestAnimationFrame(f)};f();
