import chinaGeoData from "./data/cn-all-sar-taiwan.geo.json"
import worldGeoData from "./data/world.zh.json"
import * as turf from "@turf/turf"

// convert polygon to texture, so we can use it in shader
export default function genAO(instanceSize, debug=false) {
    const needDrawFeatures = worldGeoData.features.filter(feature =>
        ['MultiPolygon', 'Polygon'].includes(feature.geometry.type) &&
        turf.area(feature.geometry.t === "Polygon" ? turf.polygon(feature.geometry.coordinates) : turf.multiPolygon(feature.geometry.coordinates)
        ) > 100000000000
    )
    const areaCount = needDrawFeatures.length
    const squareUnitSize = Math.ceil(Math.sqrt(areaCount))
    const instanceScale = 4
    const oneAreaSize = 32 * instanceScale
    const canvasSize = squareUnitSize * oneAreaSize

    const areasData = []
    // transform polygon to different cell
    needDrawFeatures.forEach((feature, index) => {
        const { geometry: {coordinates, type} } = feature
        const xIndex = index % squareUnitSize
        const yIndex = Math.floor(index / squareUnitSize)
        let v
        if (type === 'Polygon') {
            v = turf.polygon(coordinates)
        } else {
            v = turf.multiPolygon(coordinates.filter(onePolygonCorrds=>turf.area(turf.polygon(onePolygonCorrds))>100000000000))
        }


        const bbox = turf.bbox(v)
        const squareCell = makeSquareBbox(bbox)
        let scale = oneAreaSize / (squareCell[2]-squareCell[0])
        const padding = 0.1
        scale = scale * (1-padding *  2)
        const primaryCoord = [xIndex * oneAreaSize, canvasSize -yIndex * oneAreaSize]
        let transformMat3 = [
            [scale, 0, -squareCell[0]  *scale + oneAreaSize * padding + primaryCoord[0]],
            [0, scale,  -squareCell[3]  * scale - oneAreaSize *padding  + primaryCoord[1]  - canvasSize  ],
            [0, 0, 1]
        ]

        const name = feature.properties["woe-name"] || feature.properties.name
        let newCoordinates
        if (type === 'Polygon') {
            newCoordinates = polygonTransform(coordinates, transformMat3)
        } else {
            newCoordinates =coordinates.map((onePolygonCorrds)=>{
               return  polygonTransform(onePolygonCorrds, transformMat3)
            }).filter(x=>x!=null)
        }

        areasData.push({
            name,
            type,
            coordinates: newCoordinates,
        })
    })


    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0,canvas.width, canvas.height)
    areasData.forEach(({type, coordinates, name}, index) => {
        if (type === 'Polygon') {
            drawPolygonInCanvas(coordinates, ctx, debug ? name : "")
        } else {
            coordinates.forEach((onePolygonCoords, idx)=>drawPolygonInCanvas(onePolygonCoords, ctx, idx===0 && debug ? name: ""))
        }
    })

    if (debug) {
        for (let i = 0 ; i< squareUnitSize; i++) {
            ctx.beginPath()
            ctx.lineWidth = 5
            ctx.strokeStyle = 'yellow'
            ctx.moveTo(i * oneAreaSize, 0)
            ctx.lineTo(i * oneAreaSize, canvasSize)
            ctx.moveTo(0, i*oneAreaSize)
            ctx.lineTo(canvasSize,i * oneAreaSize)
            ctx.stroke()

        }
    }


    return canvas
}

const makeSquareBbox = (bbox) => {
    const [minLng, minLat, maxLng, maxLat] = bbox;

    // 计算当前bbox的宽度和高度
    const width = Math.abs(maxLng - minLng);
    const height = Math.abs(maxLat - minLat);

    // 确定哪个维度较小
    const delta = Math.abs(width - height) / 2;

    // 扩展较小的维度使其与较大的维度相等
    if (width > height) {
        // 宽度较大，调整高度
        return [minLng, minLat - delta, maxLng, maxLat + delta];
    } else {
        // 高度较大或等于宽度，调整宽度
        return [minLng - delta, minLat, maxLng + delta, maxLat];
    }
}

const mergeBbox = (bboxList) => {
    let [minLng, minLat, maxLng, maxLat] = [0, 0,0 ,0]
    for (const [minLng2, minLat2, maxLng2, maxLat2] of bboxList) {
        if (minLng2 < minLng) {
            minLng = minLng2
        }
        if (minLat2 < minLat) {
            minLat = minLat2
        }
        if (maxLng2 > maxLng) {
            maxLng = maxLng2
        }
        if (maxLat2 > maxLat) {
            maxLat = maxLat2
        }
    }

    return [minLng, minLat, maxLng, maxLat]
}


const vectorMultiplyMatrix = (vector, matrix) => {
    let result = new Array(matrix[0].length).fill(0);

    // 执行向量与矩阵的乘法
    for (let i = 0; i < matrix[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
            sum += vector[j] * matrix[i][j];
        }
        result[i] = sum;
    }

    return result;
}


const polygonTransform = (coordinates, mat3) => {
    const newCoordinates = []
    for (const coords of coordinates) {
        const newCoords = []
        for (const corrd of coords) {
            const newCoord = vectorMultiplyMatrix([corrd[0], corrd[1], 1], mat3)
            newCoords.push([newCoord[0], newCoord[1]])
        }
        newCoordinates.push(newCoords)
    }
    return newCoordinates
}


const drawPolygonInCanvas = ((coordinates, ctx, name) => {
    coordinates.forEach((line, idx)=>{
        ctx.beginPath()
        ctx.moveTo(line[0][0],  - line[0][1])
        for (const point of line.splice(1)) {
            ctx.lineTo(point[0], -point[1])
        }
        ctx.closePath()
        if (idx === 0) {
            ctx.fillStyle = '#ffffff'
        } else {
            // other line is a hole in polygon
            ctx.fillStyle = '#000000'
        }
        ctx.fill()


        if (name) {
            ctx.font = '20px  Arial'
            ctx.fillStyle = 'red';
            // 设置字体描边颜色
            ctx.strokeStyle = 'blue';
            // 设置文本对齐方式
            ctx.textAlign = 'center';
            // 设置文本基线
            ctx.textBaseline = 'middle';
            ctx.fillText(name, line[0][0],  - line[0][1])
        }


    })
})
