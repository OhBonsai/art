(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function e(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(l){if(l.ep)return;l.ep=!0;const s=e(l);fetch(l.href,s)}})();var W=`#version 300 es
#define PI 3.14159265358979
#define AQUA vec3(0.0, 1.0, 1.0)
#define SILVER vec3(0.75, 0.75, 0.75)
#define GRAY vec3(0.5, 0.5, 0.5)
#define MAROON vec3(0.5, 0.0, 0.0)
#define OLIVE vec3(0.5, 0.5, 0.0)
#define PURPLE vec3(0.5, 0.0, 0.5)
#define TEAL vec3(0.0, 0.5, 0.5)
#define NAVY vec3(0.0, 0.0, 0.5)
#define LIME vec3(0.0, 1.0, 0.0)
#define ORANGE vec3(1.0, 0.65, 0.0)
#define CHOCOLATE vec3(0.82, 0.41, 0.12)
#define GOLD vec3(1.0, 0.84, 0.0)
#define INDIGO vec3(0.29, 0.0, 0.51)
#define VIOLET vec3(0.93, 0.51, 0.93)
#define PINK vec3(1.0, 0.75, 0.8)
#define IVORY vec3(1.0, 1.0, 0.94)
#define BEIGE vec3(0.96, 0.96, 0.86)
#define RED vec3(1.0, 0.0, 0.0)
#define GREEN vec3(0.0, 1.0, 0.0)
#define BLUE vec3(0.0, 0.0, 1.0)
#define BLACK vec3(0.0, 0.0, 0.0)
#define WHITE vec3(1.0, 1.0, 1.0)
#define YELLOW vec3(1.0, 1.0, 0.0)
#define CYAN vec3(0.0, 1.0, 1.0)
#define MAGENTA vec3(1.0, 0.0, 1.0)

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float f1;
uniform float f2;
uniform float f3;
uniform float f4;
uniform float f5;
uniform int i1;
uniform int i2;
uniform int i3;

out vec4 fragColor;

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

void stroke(float dist, vec3 color, inout vec3 fragColor, float thickness, float aa)
{
    float alpha = smoothstep(0.5 * (thickness + aa), 0.5 * (thickness - aa), abs(dist));
    fragColor = mix(fragColor, color, alpha) ;
}

void fill(float dist, vec3 color, inout vec3 fragColor, float aa)
{
    float alpha = smoothstep(0.5*(aa), -0.5*(aa), dist);
    fragColor = mix(fragColor, color, alpha);
}

void render(float dist, inout vec3 fragColor) {
    vec3 axes = RED;
    float thickness = 0.03;
    float aa = 0.01;
    stroke(dist, axes, fragColor, thickness, aa);
}

void renderGrid(vec2 pos, out vec3 fragColor)
{

    vec3 axes = RED;
    vec3 lines = vec3(0.7);
    vec3 sublines = vec3(0.95);

    float subdiv = 8.0;
    float thickness = 0.03;
    float aa = length(fwidth(pos));

    vec2 toGrid = pos - ceil(pos);
    stroke(min(abs(pos.x), abs(pos.y)), axes, fragColor, thickness, aa);

}

float sdf_circle(vec2 pos, float r) {
    return  length(pos) - r;
}

float sdf_rectangle(vec2 p, vec2 width) {
    float r = abs(sin(uTime*0.6 + 3.0) ) * 0.5 ;
    vec2 d = abs(p) - vec2(width);
    return length(max(d, 0.0));
}

float sdf_polygon(vec2 pt, float radius, int N) {
    float a = atan(pt.x, pt.y);
    float r =  PI * 2.0 / float(N);
    if (a < 0.) {
        a += PI * 2.0;
    }
    float d = length(pt) * (1. + f4 -  radius );
    float a2 = floor(f1 * .5 + a /r)*r;
    return cos(a2 - a) *d - f2 / 2.0;
}

float sdf_polygon2(vec2 pt, float radius, int N) {
    float a = atan(pt.y, pt.x);
    float t = length(pt);
    a = mod(a + PI, 2.0 * PI / float(N)) - PI / float(N);

    vec2 q = vec2(cos(a), sin(a)) * t;
    float d = max(abs(q.x) * cos(PI / float(N)), abs(q.y)) - radius;
    return d;
}

float sdf_polygon3(vec2 pt, float radius, int N) {
    float a = atan(pt.y, pt.x);
    float t = length(pt);
    a = mod(a + PI, 2.0 * PI / float(N)) - PI / float(N);

    vec2 q = vec2(cos(a), sin(a)) * t;
    float d = max(abs(q.x) * cos(PI / float(N)), abs(q.y)) - radius;
    return d;
}

float sdf_polygon4(vec2 P, float radius, int sides) {
    
    float angle = atan(P.y, P.x);
    
    angle = P.y > 0. ? angle: angle + PI * 2.;

    
    float delta = 2. * PI / float(sides);
    
    float areaNumber = floor(angle / delta);
    
    
    float theta1 = delta * areaNumber;
    
    float theta2 = delta * (areaNumber + 1.0);
   
    
    
    vec2 POINT_A       = vec2(radius * cos(theta1), radius * sin(theta1) );
    
    vec2 POINT_A_Prime = vec2(radius * cos(theta2), radius * sin(theta2) );
    
    vec2 POINT_D       = (POINT_A + POINT_A_Prime)/2.0;
    
    vec2 POINT_O       = vec2(0.0); 
    
    
    vec2 iAxis1   =  vec2(-POINT_O+POINT_A);
    
    vec2 iAxis2   =  vec2(-POINT_O+POINT_A_Prime);

    
    vec2 vector1  = vec2(P - POINT_A);
    float a1 = vector_angle(iAxis1, vector1);
    if (a1 <  (delta / 2.0)) {
        return length(vector1);
    }
    
    
    vec2 vector2  = vec2(P - POINT_A_Prime);
    float a2 = vector_angle(iAxis2, vector2);
    if ((PI2 - a2) < (delta / 2.0) ) {
        return length(vector2);
    }
    
    
    float theta = mod(angle, delta) - delta / 2.0;
    float l1 =  length(P) * cos(theta) - length(POINT_D);
    return l1;
}

float cceil(float v) {
    if (v >= 0.0) {
        return ceil(v);
    } else {
        return - ceil(abs(v));
    }
}

vec2 cceil(vec2 v) {
    return vec2(cceil(v.x), cceil(v.y));
}

float gridIndxFromCenter(vec2 cellPos) {

    if (cellPos.x <= 1.0 && cellPos.y <=1.0 && cellPos.x >=0.0 && cellPos.y >= 0.0) {
        return 0.0;
    } else if (cellPos.x <= 0.0 && cellPos.y <=1.0 && cellPos.x >=-1.0 && cellPos.y >= 0.0) {
        return 1.0;
    } else if (cellPos.x <= 0.0 && cellPos.y <=0.0 && cellPos.x >=-1.0 && cellPos.y >= -1.0) {
        return 2.0;
    } else if (cellPos.x <= 1.0 && cellPos.y <=0.0 && cellPos.x >=0.0 && cellPos.y >= -1.0) {
        return 3.0;
    }
    float layer = max(abs(cellPos.x), abs(cellPos.y));
    float count = 2.0  * layer * 4.0 - 4.0;
    float prefixIdx = pow(layer - 1.0, 2.0) * 4.0 ;
    float nextIdx = pow(layer, 2.0) * 4.0;

    vec2 startPoint = vec2(layer - .5, -layer + 1. + 0.5);
    if (cellPos.x >0.0 && cellPos.y > 0.0) {
        cellPos.x -= .5;
        cellPos.y -= .5;
    } else if (cellPos.x >0.0 && cellPos.y < 0.0) {
        cellPos.x -= .5;
        cellPos.y += .5;
    } else if (cellPos.x < 0.0 && cellPos.y > 0.0) {
        cellPos.x += .5;
        cellPos.y -= .5;
    } else {
        cellPos.x += .5;
        cellPos.y += .5;
    }

    if (cellPos.x == layer - .5) {
        if (cellPos.y >= startPoint.y) {
            return prefixIdx + cellPos.y - startPoint.y ;
        } else {
            return  nextIdx - (startPoint.y - cellPos.y);
        }
    } else if (cellPos.y == layer - .5){
        return prefixIdx + cellPos.y - startPoint.y - (cellPos.x - startPoint.x);
    } else if (cellPos.x == -layer + .5) {
        return prefixIdx + (2.*layer - 1.) * 2.0
        - (cellPos.y +.5 - layer) - 1.0;
    } else {
        return prefixIdx  + (2. * layer - 1.) * 3.0 + (cellPos.x + layer + .5) - 2.0 ;
    }
}

void wave(float dist, inout vec3 color) {
    color *= .8  + 0.2 * sin(dist * 50.0 - iTime * 5.0);
}

void border(float dist, inout vec3 color) {
    color *= 1.0 - exp(-40.0 * abs(dist));
}

void main()
{
    vec2 uv2 = guv();
    float shortCount = float(i2 * i2);
    float aspectRatio = uResolution.x / uResolution.y;

    float maxCount = max(shortCount * aspectRatio, shortCount / aspectRatio);
    float sqrtCount = float(i2);
    vec2 uv = mod(uv2 , 1.0 / sqrtCount);
    uv = uv * sqrtCount;
    uv = uv * 2.0- 1.0;

    vec2 uv3 = cceil(uv2 * sqrtCount);
    float cellIdx = gridIndxFromCenter(uv3);

    float currentIdx2 = 0.0;
    if (cellIdx == currentIdx2 ++) {
        float dist = sdf_circle(uv, .5);
        fragColor.rgb = ORANGE;
        fill(dist, BLUE, fragColor.rgb, 2. * fwidth(length(uv)));
        fragColor.rgb *= exp(2.0 * dist);
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_circle(uv, .6);
        fragColor.rgb = ORANGE;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
        vec3 color = fragColor.rgb;
        color *= 1.0 - exp(-3.0 * abs(dist) );
        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);
        color = mix(WHITE, color, step(0.01, abs(dist)));
        fragColor.rgb = color;
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_rectangle(uv, vec2(.5, .6));
        fragColor.rgb = ORANGE;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
        vec3 color = fragColor.rgb;
        color *= 1.0 - exp(-3.0 * abs(dist) );
        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);
        color = mix(WHITE, color, step(0.01, abs(dist)));
        fragColor.rgb = color;
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_polygon(uv, f5, i1);
        fragColor.rgb = uColor;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
                vec3 color = fragColor.rgb;
                color *= 1.0 - exp(-3.0 * abs(dist) );
                color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);
                color = mix(WHITE, color, step(0.01, abs(dist)));
                fragColor.rgb = color;
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_polygon(uv, f5, i1);
        fragColor.rgb = uColor;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
        
        
        
        
        

    } else if(cellIdx == currentIdx2 ++) {
        float a = atan(uv.x, uv.y);
        if (a < 0.0) {
            a += PI * 2.0;
        }
        float radius = f5;
        int side = i1;
        float r =  PI * 2.0 / float(side);
        float a2 = floor(a /r + f1)*r;

        fragColor.rgb = vec3(a2/ PI / 2.0);

        renderGrid(uv, fragColor.rgb);
        float v = abs(sdf_circle(uv, radius));
        render(v, fragColor.rgb);
        float v2 = abs(sdf_circle(uv, 1.0 + f4 - radius ));
        render(v2, fragColor.rgb);

    } else if(cellIdx == currentIdx2 ++) {
        float radius = f5;
        float d = length(uv) * ( 1.0 + f4 - radius );
        fragColor.rgb = vec3(d);
    } else if(cellIdx == currentIdx2 ++) {
        float a = atan(uv.x, uv.y);
        if (a < 0.0) {
            a += PI * 2.0;
        }
        float radius = f5;
        int side = i1;
        float r =  PI * 2.0 / float(side);
        float d = length(uv) * ( 1.0 + f4 - radius );
        float a2 = floor(a /r )*r;
        float d2 = cos(a2 - a) * d - f1  ;
        fragColor.rgb = vec3(d2 > 0.0 ? 1.0 : 0.0);
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_polygon(uv, f5, i1);
        fragColor.rgb = uColor;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
    } else if(cellIdx == currentIdx2 ++) {
        float dist = sdf_polygon4(uv, f5, i1);
        fragColor.rgb = uColor;
        fill(dist, WHITE, fragColor.rgb, 2. * fwidth(length(uv)));
                vec3 color = fragColor.rgb;
                color *= 1.0 - exp(-3.0 * abs(dist) );
                color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);
                color = mix(WHITE, color, step(0.01, abs(dist)));
                fragColor.rgb = color;
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {
    } else if(cellIdx == currentIdx2 ++) {

    }

    float gray1 = cellIdx / shortCount / 4.0;
    float currentIdx = floor(mod(uTime * 5.0,shortCount * 4.0));
    vec3 finalColor = cellIdx == currentIdx ? vec3(gray1): fragColor.rgb ;
    fragColor = vec4(finalColor, 1.0);

}`,X=`#version 300 es

in vec3 position;

void main()
{
    gl_Position = vec4(position, 1.0);
}`;const K=(n,t)=>{let e=n.createBuffer(),i=t instanceof Uint16Array||t instanceof Uint32Array?n.ELEMENT_ARRAY_BUFFER:n.ARRAY_BUFFER;return n.bindBuffer(i,e),n.bufferData(i,t,n.STATIC_DRAW),e},T=(n,t,e)=>{let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),n.getShaderParameter(i,n.COMPILE_STATUS)||console.error("An error occurred compiling the shader: "+n.getShaderInfoLog(i)),i},J=(n,t)=>{let e=n.createProgram();for(let i of t)n.attachShader(e,i);return n.linkProgram(e),e},j=()=>{let n=document.getElementById("webgl");return n.width=window.innerWidth,n.height=window.innerHeight,n},q=n=>{let t=window.devicePixelRatio,e=n.getContext("webgl2");return e||window.alert("WebGL2 not supported"),window.addEventListener("resize",()=>{n.width=Math.floor(window.innerWidth*t),n.height=Math.floor(window.innerHeight*t),e.viewport(0,0,n.width,n.height)}),e.clearColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.cullFace(e.BACK),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e};/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class m{constructor(t,e,i,l,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(l),this.$name=document.createElement("div"),this.$name.classList.add("name"),m.nextNameID=m.nextNameID||0,this.$name.id=`lil-gui-name-${++m.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",d=>d.stopPropagation()),this.domElement.addEventListener("keyup",d=>d.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Q extends m{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function L(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Z={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:L,toHexString:L},_={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},tt={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=_.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const l=n*i<<16^t*i<<8^e*i<<0;return _.toHexString(l)}},et={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=_.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const l=n*i<<16^t*i<<8^e*i<<0;return _.toHexString(l)}},it=[Z,_,tt,et];function nt(n){return it.find(t=>t.match(n))}class ot extends m{constructor(t,e,i,l){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=nt(this.initialValue),this._rgbScale=l,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=L(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class P extends m{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",l=>{l.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class lt extends m{constructor(t,e,i,l,s,d){super(t,e,i,"number"),this._initInput(),this.min(l),this.max(s);const g=d!==void 0;this.step(g?d:this._getImplicitStep(),g),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let r=parseFloat(this.$input.value);isNaN(r)||(this._stepExplicit&&(r=this._snap(r)),this.setValue(this._clamp(r)))},i=r=>{const c=parseFloat(this.$input.value);isNaN(c)||(this._snapClampSetValue(c+r),this.$input.value=this.getValue())},l=r=>{r.key==="Enter"&&this.$input.blur(),r.code==="ArrowUp"&&(r.preventDefault(),i(this._step*this._arrowKeyMultiplier(r))),r.code==="ArrowDown"&&(r.preventDefault(),i(this._step*this._arrowKeyMultiplier(r)*-1))},s=r=>{this._inputFocused&&(r.preventDefault(),i(this._step*this._normalizeMouseWheel(r)))};let d=!1,g,A,p,b,f;const y=5,I=r=>{g=r.clientX,A=p=r.clientY,d=!0,b=this.getValue(),f=0,window.addEventListener("mousemove",C),window.addEventListener("mouseup",w)},C=r=>{if(d){const c=r.clientX-g,E=r.clientY-A;Math.abs(E)>y?(r.preventDefault(),this.$input.blur(),d=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(c)>y&&w()}if(!d){const c=r.clientY-p;f-=c*this._step*this._arrowKeyMultiplier(r),b+f>this._max?f=this._max-b:b+f<this._min&&(f=this._min-b),this._snapClampSetValue(b+f)}p=r.clientY},w=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",C),window.removeEventListener("mouseup",w)},$=()=>{this._inputFocused=!0},a=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",l),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",I),this.$input.addEventListener("focus",$),this.$input.addEventListener("blur",a)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(a,r,c,E,Y)=>(a-r)/(c-r)*(Y-E)+E,e=a=>{const r=this.$slider.getBoundingClientRect();let c=t(a,r.left,r.right,this._min,this._max);this._snapClampSetValue(c)},i=a=>{this._setDraggingStyle(!0),e(a.clientX),window.addEventListener("mousemove",l),window.addEventListener("mouseup",s)},l=a=>{e(a.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",l),window.removeEventListener("mouseup",s)};let d=!1,g,A;const p=a=>{a.preventDefault(),this._setDraggingStyle(!0),e(a.touches[0].clientX),d=!1},b=a=>{a.touches.length>1||(this._hasScrollBar?(g=a.touches[0].clientX,A=a.touches[0].clientY,d=!0):p(a),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",y))},f=a=>{if(d){const r=a.touches[0].clientX-g,c=a.touches[0].clientY-A;Math.abs(r)>Math.abs(c)?p(a):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",y))}else a.preventDefault(),e(a.touches[0].clientX)},y=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",y)},I=this._callOnFinishChange.bind(this),C=400;let w;const $=a=>{if(Math.abs(a.deltaX)<Math.abs(a.deltaY)&&this._hasScrollBar)return;a.preventDefault();const c=this._normalizeMouseWheel(a)*this._step;this._snapClampSetValue(this.getValue()+c),this.$input.value=this.getValue(),clearTimeout(w),w=setTimeout(I,C)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",b,{passive:!1}),this.$slider.addEventListener("wheel",$,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class rt extends m{constructor(t,e,i,l){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(l)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class st extends m{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",l=>{l.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const at=`.lil-gui {
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
}`;function dt(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let S=!1;class k{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:l,title:s="Controls",closeFolders:d=!1,injectStyles:g=!0,touchStyles:A=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",p=>{(p.code==="Enter"||p.code==="Space")&&(p.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),A&&this.domElement.classList.add("allow-touch-styles"),!S&&g&&(dt(at),S=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),l&&this.domElement.style.setProperty("--width",l+"px"),this._closeFolders=d}add(t,e,i,l,s){if(Object(i)===i)return new rt(this,t,e,i);const d=t[e];switch(typeof d){case"number":return new lt(this,t,e,i,l,s);case"boolean":return new Q(this,t,e);case"string":return new st(this,t,e);case"function":return new P(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,d)}addColor(t,e,i=1){return new ot(this,t,e,i)}addFolder(t){const e=new k({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof P||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof P)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const l=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=l+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}const x=j(),o=q(x),v=new k;let ht=K(o,new Float32Array([-1,-1,0,-1,1,0,1,-1,0,1,-1,0,1,1,0,-1,1,0])),ct=T(o,X,o.VERTEX_SHADER),ut=T(o,W,o.FRAGMENT_SHADER),u=J(o,[ct,ut]),ft=o.getUniformLocation(u,"uTime"),D=o.getUniformLocation(u,"f1"),R=o.getUniformLocation(u,"f2"),M=o.getUniformLocation(u,"f3"),V=o.getUniformLocation(u,"f4"),N=o.getUniformLocation(u,"f5"),B=o.getUniformLocation(u,"i1"),H=o.getUniformLocation(u,"i2"),U=o.getUniformLocation(u,"i3"),gt=o.getUniformLocation(u,"uResolution"),z=o.getUniformLocation(u,"uColor"),O=o.getAttribLocation(u,"position"),F=0;const h={color:{r:1,g:0,b:0},f1:1,f2:1,f3:1,f4:.5,f5:.5,i1:3,i2:3,i3:1,b1:!0};v.addColor(h,"color").onChange(n=>{o.uniform3f(z,n.r,n.g,n.b)});v.add(h,"f1").name("translate").min(0).max(1).step(.01).onChange(n=>{o.uniform1f(D,n)});v.add(h,"f2").name("zoomIn").min(0).max(1).step(.01).onChange(n=>{o.uniform1f(R,n)});v.add(h,"f3").min(0).max(1).step(.01).onChange(n=>{o.uniform1f(M,n)});v.add(h,"f4").name("zoomOut").min(0).max(1).step(.01).onChange(n=>{o.uniform1f(V,n)});v.add(h,"f5").name("radius").min(0).max(1).step(.01).onChange(n=>{o.uniform1f(N,n)});v.add(h,"i1").name("side").min(1).max(8).step(1).onChange(n=>{o.uniform1i(B,n)});v.add(h,"i2").name("cellCount").min(2).max(6).step(1).onChange(n=>{o.uniform1i(H,n)});v.add(h,"i3").min(0).max(100).step(1).onChange(n=>{o.uniform1i(U,n)});const G=()=>{o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.useProgram(u),o.viewport(0,0,x.width,x.height),o.scissor(0,0,x.width,x.height),F===0&&(F++,o.uniform3f(z,1,0,0),o.uniform1f(D,h.f1),o.uniform1f(R,h.f2),o.uniform1f(M,h.f3),o.uniform1f(V,h.f4),o.uniform1f(N,h.f5),o.uniform1i(B,h.i1),o.uniform1i(H,h.i2),o.uniform1i(U,h.i3)),o.uniform1f(ft,performance.now()/1e3),o.uniform2f(gt,x.width,x.height),o.bindBuffer(o.ARRAY_BUFFER,ht),o.vertexAttribPointer(O,3,o.FLOAT,!1,0,0),o.enableVertexAttribArray(O),o.drawArrays(o.TRIANGLES,0,6),requestAnimationFrame(G)};G();
