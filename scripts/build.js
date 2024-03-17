import fs from 'fs';
import fse from 'fs-extra';
import path from 'path'
import {execSync} from 'child_process'
import {globSync} from 'glob'


// build index
const buildIndex = ()=>{
    try {
        execSync("vite build")
        console.info("===========================================")
        console.info("Building index html")
        console.info("===========================================")
    } catch (error) {
        console.error("Build index html fail")
        console.error(error)
        process.exit(1)
    }
}


// build sketches
const buildSketches = () => {
    const mtime = safe(()=>{return fs.statSync("docs/index.html").mtime}, new Date("1992-10-31"));
    const sketchBase = "./sketchs"

    console.info("===========================================")
    console.log("Building Sketches")
    console.info("===========================================")

    // compile changed sketch
    fs.readdirSync(sketchBase).filter(item=>{
        const viteConfigPath = path.join(sketchBase, item, "vite.config.js")
        return fs.existsSync(viteConfigPath)
            // && sourceFilesLaterThan(itemPath, mtime)
    }).map(item=> {
        const itemPath = path.join(sketchBase, item)
        console.log(`staring build ${itemPath}`)
        execSync(`vite build --outDir ../../docs/sketch/${item} --base /art/sketch/${item}`, {cwd: itemPath})
    })

    const oldMetaData = JSON.parse(fs.readFileSync("src/meta.json", "utf8"))

    // write sketch info to src/meta.json
    // create screenshots folder
    fs.mkdirSync("docs/screenshots", {recursive: true})
    const metaData = fs.readdirSync(sketchBase).filter(item=>{
        const metaJsonPath = path.join(sketchBase, item, "meta.json")
        return fs.existsSync(metaJsonPath)
    }).map(item=>{
        const itemPath = path.join(sketchBase, item)
        const meta =JSON.parse(fs.readFileSync( path.join(itemPath, "meta.json"), "utf8"))


        const screenshotPath = path.join(itemPath, "screenshot.gif")
        let fileName =  `${item}.gif`
        if (fs.existsSync(screenshotPath)) {
            fs.copyFileSync(screenshotPath, `docs/screenshots/${fileName}`)
        } else {
            fileName = `${item}.png`
            fs.copyFileSync(path.join(itemPath, "screenshot.png"), `docs/screenshots/${fileName}`)
        }

        return {
            name: meta.name ?? item,
            source: "/"+item,
            snapshot: fileName,
            tags: meta.tags || [],
            description: meta.description || "",
            createdAt: meta.createdAt || fs.statSync(itemPath).ctime.getTime(),
            updatedAt: meta.updatedAt || directoryUpdatedAt(itemPath).getTime(),
            origin: ""
        }
    })

    metaData.sort((a,b)=>b.createdAt - a.createdAt)
    fs.writeFileSync("src/meta.json",
        JSON.stringify(metaData, null, 2), "utf8")
}


// build static website in GitHub master docs
const buildGithubIoDir = ()=>{
    moveDirFileAndDeleteSourceDir("./docs/dist", "./docs")
}



/*
TOOLS
 */
const moveDirFileAndDeleteSourceDir = (sourceDir, targetDir) => {
    fs.readdir(sourceDir, (err, files)=>{
        if (err) {
            console.error("can't read directory: ", err)
        }

        let mvCount = 0;
        files.forEach((file)=>{
            const sourceFile = path.join(sourceDir, file)
            const targetFile = path.join(targetDir, file)

            fse.move(sourceFile, targetFile, {overwrite: true}, (err)=>{
                if (err) {
                    console.error(`move ${file} error: `, err)
                } else {
                    console.log(`move ${file} success`)
                }

                mvCount ++;

                if (mvCount === files.length) {
                    fse.remove(sourceDir, (err)=>{
                        if (err) {
                            console.error("remove source directory error: ", err)
                        } else {
                            console.info(`source directory [${sourceDir}] deleted`)
                        }
                    })
                }
            })

        })
    })

}

const sourceFilesLaterThan = (dirToCheck, dateThreshold)=>{
    return directoryUpdatedAt(dirToCheck) > dateThreshold
}

const directoryUpdatedAt = (dirToCheck) => {
    let latest;

    let files = globSync('**/*.{js,css,html,jsx,ts,tsx}',
        {cwd: dirToCheck, ignore: '**/node_modules/**', nodir:true})

    files.forEach((file)=>{
        const filePath = path.join(dirToCheck, file);
        const stats = fs.statSync(filePath)
        if (!latest) {
            latest = stats.mtime
        }

        if (latest < stats.mtime) {
            latest = stats.mtime
        }
    })
    return latest
}

const safe = (func, defaultValue) => {
    try {
        return func()
    } catch (e) {
        return defaultValue
    }
}

const main = ()=>{
    buildSketches()
    buildIndex()
    buildGithubIoDir()
}

main()
