#version 300 es
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
//    vec3 background = vec3(1.0);
    vec3 axes = RED;
    vec3 lines = vec3(0.7);
    vec3 sublines = vec3(0.95);

    float subdiv = 8.0;
    float thickness = 0.03;
    float aa = length(fwidth(pos));

//    fragColor = background;

//    vec2 toSubGrid = pos - round(pos*subdiv)/subdiv;
//    stroke(min(abs(toSubGrid.x), abs(toSubGrid.y)), sublines, fragColor, thickness, aa);

    vec2 toGrid = pos - ceil(pos);
    stroke(min(abs(pos.x), abs(pos.y)), axes, fragColor, thickness, aa);
//    stroke(min(abs(toGrid.x), abs(toGrid.y)), lines, fragColor, thickness, aa);

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
        //        vec3 color = fragColor.rgb;
        //        color *= 1.0 - exp(-3.0 * abs(dist) );
        //        color = color * .8 + color * 0.2 * sin(dist * 100. - 5.0 * uTime);
        //        color = mix(WHITE, color, step(0.01, abs(dist)));
        //        fragColor.rgb = color;

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
//        v = smoothstep(0.00, 0.01, 1.0 - v);
//        v = 1.0 -exp(v*3.);
//        fragColor.rgb = mix(fragColor.rgb, WHITE, v);


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
    } else if(cellIdx == currentIdx2 ++) {

    }

    float gray1 = cellIdx / shortCount / 4.0;
    float currentIdx = floor(mod(uTime * 5.0,shortCount * 4.0));
    vec3 finalColor = cellIdx == currentIdx ? vec3(gray1): fragColor.rgb ;
    fragColor = vec4(finalColor, 1.0);


}
