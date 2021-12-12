const yargs = require('yargs')
const { readdir, stat, copyFile, mkdir, rmdir, unlink } = require('fs')
const path = require('path')
let counter = 0

const args = yargs
  .usage("Usage: node $0 [options]")
  .help('help')
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .example('node $0 --entry [path]', 'File sorted')
  .option('entry', {
    alias: 'e',
    describe: 'Start folder path',
    demandOption: true
  })
  .option('dist', {
    alias: 'd',
    describe: "Result folder path",
    default: '/output'
  })
  .option('delete', {
    alias: "D",
    describe: 'Remove start folder?',
    type: 'boolean',
    default: false,
    boolean: true
  })
  .epilog('Homework 1')
  .argv

const folder = path.resolve(__dirname, args.entry)
const dist = path.resolve(__dirname, args.dist)


function deleteFolder(folder) {
    (function recursive(src) {
        if (src === path.resolve(folder, '../')) return console.log('delete done!')

        readdir(src, (err, files) => {
            if (err) return

            if (!files.length) {
                rmdir(src, (err) => {
                    if (err) return

                    recursive(path.resolve(src, '../'))
                })
            }

            files.forEach((file) => {
                const currentPath = path.resolve(src, file)

                stat(currentPath, (err, stats) => {
                    if (err) return

                    if (stats.isFile()) {
                        unlink(currentPath, (err) => {
                            if (err) return

                            recursive(src)
                        })
                    } else {
                        recursive(currentPath)
                    }
                })
            })
        })
    })(folder)
}

function readdirSync(src) {
    return new Promise((resolve, reject) => {
        readdir(src, (err, files) =>{
            if (err) reject(err)

            resolve(files)
        })
    })
}

function statSync(src) {
    return new Promise((resolve, reject) => {
        stat(src, (err, stats) => {
            if (err) reject(err)

            resolve(stats)
        })
    })
}

function mkdirSync(src) {
    return new Promise((resolve, reject) => {
        createDir(src, (err) => {
            if (err) reject(err)

            resolve()
        })
    })
}

function copyFileSync(from, to) {
    return new Promise((resolve, reject) => {
        copyFile(from, to, (err) => {
            if (err) reject(err)

            resolve()
        })
    })
}

function createDir(path, cb) {
    mkdir(path, (err) => {
        if (err && err.code !== 'EEXIST') {
            return cb(err, false)
        }

        cb(null, true)
    })
}

async function reader(src) {
    const files = await readdirSync(src)

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const currentPath = path.resolve(src, file)
        const stats = await statSync(currentPath)

        if (stats.isFile()) {
            await mkdirSync(dist)

            const localeDir = path.resolve(dist, file[0].toUpperCase())
            const localeFile = path.resolve(localeDir, file)

            await mkdirSync(localeDir)
            await copyFileSync(currentPath, localeFile)
            counter++;
            console.log('copyFile', `count: ${counter}`)

        } else {
            await reader(currentPath)
        }
    }
}

(async () => {
    try {
        await reader(folder)
        console.log('done!')

    } catch (error) {
        console.log(error)
    }
})()