(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const h of o.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var z=`#version 300 es\r
#define PI 3.14159265358979\r
#define AQUA vec3(0.0, 1.0, 1.0)\r
#define SILVER vec3(0.75, 0.75, 0.75)\r
#define GRAY vec3(0.5, 0.5, 0.5)\r
#define MAROON vec3(0.5, 0.0, 0.0)\r
#define OLIVE vec3(0.5, 0.5, 0.0)\r
#define PURPLE vec3(0.5, 0.0, 0.5)\r
#define TEAL vec3(0.0, 0.5, 0.5)\r
#define NAVY vec3(0.0, 0.0, 0.5)\r
#define LIME vec3(0.0, 1.0, 0.0)\r
#define ORANGE vec3(1.0, 0.65, 0.0)\r
#define CHOCOLATE vec3(0.82, 0.41, 0.12)\r
#define GOLD vec3(1.0, 0.84, 0.0)\r
#define INDIGO vec3(0.29, 0.0, 0.51)\r
#define VIOLET vec3(0.93, 0.51, 0.93)\r
#define PINK vec3(1.0, 0.75, 0.8)\r
#define IVORY vec3(1.0, 1.0, 0.94)\r
#define BEIGE vec3(0.96, 0.96, 0.86)\r
#define RED vec3(1.0, 0.0, 0.0)\r
#define GREEN vec3(0.0, 1.0, 0.0)\r
#define BLUE vec3(0.0, 0.0, 1.0)\r
#define BLACK vec3(0.0, 0.0, 0.0)\r
#define WHITE vec3(1.0, 1.0, 1.0)\r
#define YELLOW vec3(1.0, 1.0, 0.0)\r
#define CYAN vec3(0.0, 1.0, 1.0)\r
#define MAGENTA vec3(1.0, 0.0, 1.0)\r

precision mediump float;

uniform float uTime;\r
uniform vec2 uResolution;\r
uniform vec3 uColor;\r
uniform float n1;\r
uniform float n2;\r
uniform int n3;

out vec4 fragColor;\r

vec2 guv() {\r
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 uv = gl_FragCoord.xy / uResolution;\r
    if (aspectRatio >= 1.0) {\r
        uv.x = (gl_FragCoord.x - (uResolution.x - uResolution.y) / 2.0) / uResolution.y;\r
    } else {\r
        uv.y = (gl_FragCoord.y - (uResolution.y - uResolution.x) / 2.0) / uResolution.x;\r
    }\r
    uv = (uv - 0.5) * 2.0;\r
    return uv;\r
}

void stroke(float dist, vec3 color, inout vec3 fragColor, float thickness, float aa)\r
{\r
    float alpha = smoothstep(0.5 * (thickness + aa), 0.5 * (thickness - aa), abs(dist));\r
    fragColor = mix(fragColor, color, alpha);\r
}

void fill(float dist, vec3 color, inout vec3 fragColor, float aa)\r
{\r
    float alpha = smoothstep(0.5*(aa), -0.5*(aa), dist);\r
    fragColor = mix(fragColor, color, alpha);\r
}\r

void renderGrid(vec2 pos, out vec3 fragColor)\r
{\r
    vec3 background = vec3(1.0);\r
    vec3 axes = vec3(0.1);\r
    vec3 lines = vec3(0.7);\r
    vec3 sublines = vec3(0.95);

    float subdiv = 8.0;\r
    float thickness = 0.03;\r
    float aa = length(fwidth(pos));

    fragColor = background;\r

    vec2 toGrid = pos - ceil(pos);\r
    stroke(min(abs(pos.x), abs(pos.y)), axes, fragColor, thickness, aa);\r

}

float sdf_circle(vec2 pos, float r) {\r
    return  length(pos) - r;\r
}

float sdf_rectangle(vec2 p, vec2 width) {\r
    float r = abs(sin(uTime*0.6 + 3.0) ) * 0.5 ;\r
    vec2 d = abs(p) - vec2(width);\r
    return length(max(d, 0.0));\r
}

float sdf_polygon(vec2 pt, float radius, int N) {\r
    float a = atan(pt.x, pt.y);\r
    float r =  PI * 2.0 / float(N);\r
    if (a < 0.) {\r
        a += PI * 2.0;\r
    }\r
    float d = length(pt) * (1.5 -  radius );\r
    float a2 = floor(n1 * .5 + a /r)*r;\r
    return cos(a2 - a) *d - n2 / 2.0;\r
}

float cceil(float v) {\r
    if (v >= 0.0) {\r
        return ceil(v);\r
    } else {\r
        return - ceil(abs(v));\r
    }\r
}

vec2 cceil(vec2 v) {\r
    return vec2(cceil(v.x), cceil(v.y));\r
}

float gridIndxFromCenter(vec2 cellPos) {

    if (cellPos.x <= 1.0 && cellPos.y <=1.0 && cellPos.x >=0.0 && cellPos.y >= 0.0) {\r
        return 0.0;\r
    } else if (cellPos.x <= 0.0 && cellPos.y <=1.0 && cellPos.x >=-1.0 && cellPos.y >= 0.0) {\r
        return 1.0;\r
    } else if (cellPos.x <= 0.0 && cellPos.y <=0.0 && cellPos.x >=-1.0 && cellPos.y >= -1.0) {\r
        return 2.0;\r
    } else if (cellPos.x <= 1.0 && cellPos.y <=0.0 && cellPos.x >=0.0 && cellPos.y >= -1.0) {\r
        return 3.0;\r
    }\r
    float layer = max(abs(cellPos.x), abs(cellPos.y));\r
    float count = 2.0  * layer * 4.0 - 4.0;\r
    float prefixIdx = pow(layer - 1.0, 2.0) * 4.0 ;\r
    float nextIdx = pow(layer, 2.0) * 4.0;

    vec2 startPoint = vec2(layer - .5, -layer + 1. + 0.5);\r
    if (cellPos.x >0.0 && cellPos.y > 0.0) {\r
        cellPos.x -= .5;\r
        cellPos.y -= .5;\r
    } else if (cellPos.x >0.0 && cellPos.y < 0.0) {\r
        cellPos.x -= .5;\r
        cellPos.y += .5;\r
    } else if (cellPos.x < 0.0 && cellPos.y > 0.0) {\r
        cellPos.x += .5;\r
        cellPos.y -= .5;\r
    } else {\r
        cellPos.x += .5;\r
        cellPos.y += .5;\r
    }

    if (cellPos.x == layer - .5) {\r
        if (cellPos.y >= startPoint.y) {\r
            return prefixIdx + cellPos.y - startPoint.y ;\r
        } else {\r
            return  nextIdx - (startPoint.y - cellPos.y);\r
        }\r
    } else if (cellPos.y == layer - .5){\r
        return prefixIdx + cellPos.y - startPoint.y - (cellPos.x - startPoint.x);\r
    } else if (cellPos.x == -layer + .5) {\r
        return prefixIdx + (2.*layer - 1.) * 2.0\r
        - (cellPos.y +.5 - layer) - 1.0;\r
    } else {\r
        return prefixIdx  + (2. * layer - 1.) * 3.0 + (cellPos.x + layer + .5) - 2.0 ;\r
    }\r
}\r

void main()\r
{\r
    vec2 uv2 = guv();\r
    float shortCount = 4.0;\r
    float aspectRatio = uResolution.x / uResolution.y;

    float maxCount = max(shortCount * aspectRatio, shortCount / aspectRatio);\r
    float sqrtCount = sqrt(shortCount);\r
    vec2 uv = mod(uv2 , 1.0 / sqrtCount);\r
    uv = uv * sqrtCount;\r
    uv = uv * 2.0- 1.0;

    vec2 uv3 = cceil(uv2 * sqrtCount);\r
    float cellIdx = gridIndxFromCenter(uv3);\r

    float currentIdx2 = 0.0;\r
    if (cellIdx == currentIdx2 ++) {\r
        float dist = sdf_circle(uv, .5);\r
        fragColor.rgb = ORANGE;\r
        fill(dist, BLUE, fragColor.rgb, 2. * fwidth(length(uv)));\r
        fragColor.rgb *= exp(2.0 * dist);\r
    } else if(cellIdx == currentIdx2 ++) {\r
        float dist = sdf_circle(uv, .6);\r
        fragColor.rgb = ORANGE;\r
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));\r
        vec3 color = fragColor.rgb;\r
        color *= 1.0 - exp(-3.0 * abs(dist) );\r
        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);\r
        color = mix(WHITE, color, step(0.01, abs(dist)));\r
        fragColor.rgb = color;\r
    } else if(cellIdx == currentIdx2 ++) {\r
        float dist = sdf_rectangle(uv, vec2(.5, .6));\r
        fragColor.rgb = ORANGE;\r
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));\r
        vec3 color = fragColor.rgb;\r
        color *= 1.0 - exp(-3.0 * abs(dist) );\r
        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);\r
        color = mix(WHITE, color, step(0.01, abs(dist)));\r
        fragColor.rgb = color;\r
    } else if(cellIdx == currentIdx2 ++) {\r
        float a = atan(uv.x, uv.y);\r
        if (a < 0.0) {\r
            a += PI * 2.0;\r
        }

        float radius = 0.5;\r
        int side = n3;\r
        float r =  PI * 2.0 / float(side);\r
        float d = length(uv) * (1.5 -  radius );\r
        float a2 = floor(a /r + n1)*r;\r
        float d2 = cos(a2 - a) *d -.5;\r
        fragColor.rgb = vec3(a2/ PI / 2.0);

    } else if(cellIdx == currentIdx2 ++) {\r
        float dist = sdf_polygon(uv, 0.2, n3);\r
        fragColor.rgb = uColor;\r
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));\r
        vec3 color = fragColor.rgb;\r
        color *= 1.0 - exp(-3.0 * abs(dist) );\r
        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);\r
        color = mix(WHITE, color, step(0.01, abs(dist)));\r
        fragColor.rgb = color;\r
    } else if(cellIdx == currentIdx2 ++) {\r
        float a = atan(uv.x, uv.y);\r
        if (a < 0.0) {\r
            a += PI * 2.0;\r
        }

        float radius = 0.5;\r
        int side = n3;\r
        float r =  PI * 2.0 / float(side);\r
        float d = length(uv) * (1.5 -  radius );\r
        float a2 = floor(a /r + n1)*r;\r
        float d2 = cos(a2 - a) * d - n2 ;\r
        fragColor.rgb = vec3(abs(d2));\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {\r
    } else if(cellIdx == currentIdx2 ++) {

    }\r

}`,Y=`#version 300 es

in vec3 position;\r

void main()\r
{\r
    gl_Position = vec4(position, 1.0);\r
}`;const G=(n,t)=>{let e=n.createBuffer(),i=t instanceof Uint16Array||t instanceof Uint32Array?n.ELEMENT_ARRAY_BUFFER:n.ARRAY_BUFFER;return n.bindBuffer(i,e),n.bufferData(i,t,n.STATIC_DRAW),e},D=(n,t,e)=>{let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),n.getShaderParameter(i,n.COMPILE_STATUS)||console.error("An error occurred compiling the shader: "+n.getShaderInfoLog(i)),i},N=(n,t)=>{let e=n.createProgram();for(let i of t)n.attachShader(e,i);return n.linkProgram(e),e},U=()=>{let n=document.getElementById("webgl");return n.width=window.innerWidth,n.height=window.innerHeight,n},W=n=>{let t=window.devicePixelRatio,e=n.getContext("webgl2");return e||window.alert("WebGL2 not supported"),window.addEventListener("resize",()=>{n.width=Math.floor(window.innerWidth*t),n.height=Math.floor(window.innerHeight*t),e.viewport(0,0,n.width,n.height)}),e.clearColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.cullFace(e.BACK),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e};/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class g{constructor(t,e,i,r,o="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("controller"),this.domElement.classList.add(r),this.$name=document.createElement("div"),this.$name.classList.add("name"),g.nextNameID=g.nextNameID||0,this.$name.id=`lil-gui-name-${++g.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",h=>h.stopPropagation()),this.domElement.addEventListener("keyup",h=>h.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class X extends g{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function P(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const K={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:P,toHexString:P},w={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},J={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=w.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const r=n*i<<16^t*i<<8^e*i<<0;return w.toHexString(r)}},j={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=w.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const r=n*i<<16^t*i<<8^e*i<<0;return w.toHexString(r)}},Q=[K,w,J,j];function Z(n){return Q.find(t=>t.match(n))}class q extends g{constructor(t,e,i,r){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Z(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=P(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class L extends g{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",r=>{r.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class tt extends g{constructor(t,e,i,r,o,h){super(t,e,i,"number"),this._initInput(),this.min(r),this.max(o);const u=h!==void 0;this.step(u?h:this._getImplicitStep(),u),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let s=parseFloat(this.$input.value);isNaN(s)||(this._stepExplicit&&(s=this._snap(s)),this.setValue(this._clamp(s)))},i=s=>{const d=parseFloat(this.$input.value);isNaN(d)||(this._snapClampSetValue(d+s),this.$input.value=this.getValue())},r=s=>{s.key==="Enter"&&this.$input.blur(),s.code==="ArrowUp"&&(s.preventDefault(),i(this._step*this._arrowKeyMultiplier(s))),s.code==="ArrowDown"&&(s.preventDefault(),i(this._step*this._arrowKeyMultiplier(s)*-1))},o=s=>{this._inputFocused&&(s.preventDefault(),i(this._step*this._normalizeMouseWheel(s)))};let h=!1,u,v,p,f,c;const x=5,$=s=>{u=s.clientX,v=p=s.clientY,h=!0,f=this.getValue(),c=0,window.addEventListener("mousemove",_),window.addEventListener("mouseup",y)},_=s=>{if(h){const d=s.clientX-u,E=s.clientY-v;Math.abs(E)>x?(s.preventDefault(),this.$input.blur(),h=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(d)>x&&y()}if(!h){const d=s.clientY-p;c-=d*this._step*this._arrowKeyMultiplier(s),f+c>this._max?c=this._max-f:f+c<this._min&&(c=this._min-f),this._snapClampSetValue(f+c)}p=s.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",_),window.removeEventListener("mouseup",y)},I=()=>{this._inputFocused=!0},a=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",r),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",$),this.$input.addEventListener("focus",I),this.$input.addEventListener("blur",a)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(a,s,d,E,H)=>(a-s)/(d-s)*(H-E)+E,e=a=>{const s=this.$slider.getBoundingClientRect();let d=t(a,s.left,s.right,this._min,this._max);this._snapClampSetValue(d)},i=a=>{this._setDraggingStyle(!0),e(a.clientX),window.addEventListener("mousemove",r),window.addEventListener("mouseup",o)},r=a=>{e(a.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",o)};let h=!1,u,v;const p=a=>{a.preventDefault(),this._setDraggingStyle(!0),e(a.touches[0].clientX),h=!1},f=a=>{a.touches.length>1||(this._hasScrollBar?(u=a.touches[0].clientX,v=a.touches[0].clientY,h=!0):p(a),window.addEventListener("touchmove",c,{passive:!1}),window.addEventListener("touchend",x))},c=a=>{if(h){const s=a.touches[0].clientX-u,d=a.touches[0].clientY-v;Math.abs(s)>Math.abs(d)?p(a):(window.removeEventListener("touchmove",c),window.removeEventListener("touchend",x))}else a.preventDefault(),e(a.touches[0].clientX)},x=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",c),window.removeEventListener("touchend",x)},$=this._callOnFinishChange.bind(this),_=400;let y;const I=a=>{if(Math.abs(a.deltaX)<Math.abs(a.deltaY)&&this._hasScrollBar)return;a.preventDefault();const d=this._normalizeMouseWheel(a)*this._step;this._snapClampSetValue(this.getValue()+d),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout($,_)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",f,{passive:!1}),this.$slider.addEventListener("wheel",I,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class et extends g{constructor(t,e,i,r){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class it extends g{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",r=>{r.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const nt=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function rt(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let S=!1;class k{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:r,title:o="Controls",closeFolders:h=!1,injectStyles:u=!0,touchStyles:v=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",p=>{(p.code==="Enter"||p.code==="Space")&&(p.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),v&&this.domElement.classList.add("allow-touch-styles"),!S&&u&&(rt(nt),S=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty("--width",r+"px"),this._closeFolders=h}add(t,e,i,r,o){if(Object(i)===i)return new et(this,t,e,i);const h=t[e];switch(typeof h){case"number":return new tt(this,t,e,i,r,o);case"boolean":return new X(this,t,e);case"string":return new it(this,t,e);case"function":return new L(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,h)}addColor(t,e,i=1){return new q(this,t,e,i)}addFolder(t){const e=new k({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof L||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof L)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const r=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=r+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}const A=U(),l=W(A),C=new k;let st=G(l,new Float32Array([-1,-1,0,-1,1,0,1,-1,0,1,-1,0,1,1,0,-1,1,0])),lt=D(l,Y,l.VERTEX_SHADER),ot=D(l,z,l.FRAGMENT_SHADER),m=N(l,[lt,ot]),at=l.getUniformLocation(m,"uTime"),R=l.getUniformLocation(m,"n1"),M=l.getUniformLocation(m,"n2"),V=l.getUniformLocation(m,"n3"),ht=l.getUniformLocation(m,"uResolution"),B=l.getUniformLocation(m,"uColor"),F=l.getAttribLocation(m,"position"),O=0;const b={color:{r:1,g:0,b:0},n1:1,n2:1,n3:3};C.addColor(b,"color").onChange(n=>{l.uniform3f(B,n.r,n.g,n.b)});C.add(b,"n1").min(0).max(1).step(.01).onChange(n=>{l.uniform1f(R,n)});C.add(b,"n2").min(0).max(1).step(.01).onChange(n=>{l.uniform1f(M,n)});C.add(b,"n3").min(1).max(20).step(1).onChange(n=>{l.uniform1i(V,n)});const T=()=>{l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT),l.useProgram(m),l.viewport(0,0,A.width,A.height),l.scissor(0,0,A.width,A.height),O===0&&(O++,l.uniform3f(B,1,0,0),l.uniform1f(R,b.n1),l.uniform1f(M,b.n2),l.uniform1i(V,b.n3)),l.uniform1f(at,performance.now()/1e3),l.uniform2f(ht,A.width,A.height),l.bindBuffer(l.ARRAY_BUFFER,st),l.vertexAttribPointer(F,3,l.FLOAT,!1,0,0),l.enableVertexAttribArray(F),l.drawArrays(l.TRIANGLES,0,6),requestAnimationFrame(T)};T();
