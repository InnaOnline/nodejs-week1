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

const config = {
    entry: path.resolve(__dirname, args.entry),
    dist: path.resolve(__dirname, args.dist),
    delete: args.delete
}

const folder = path.normalize(path.join(__dirname, args.entry))
const dist = path.normalize(path.join(__dirname, args.output))

class Observer {
    constructor(cb) {
        this.observers = new Proxy([], {
            set(target, prop, value) {
                target[prop] = value

                if (target.length === 0) {
                    cb()
                }

                return true
            }
        })
    }

    add(observer) {
        this.observers.push(observer)
    }

    remove(observer) {
        const index = this.observers.findIndex(obs => obs === observer)

        this.observers.splice(index, 1)
    }
}

const observer = new Observer(() => {
    deleteFolder(folder)
})

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

function createDir(path, cb) {
    mkdir(path, (err) => {
        if (err && err.code !== 'EEXIST') {
            return cb(err, false)
        }

        cb(null, true)
    })
}

function reader(src) {
    observer.add(src)
    readdir(src, (err, files) => {
        if (err) throw err

        files.forEach((file) => {
            const currentPath = path.resolve(src, file)

            observer.add(currentPath)

            stat(currentPath, (err, stats) => {
                if (err) throw err

                if (stats.isFile()) {
                    createDir(dist, (err) => {
                        if (err) throw err

                        const localeDir = path.resolve(dist, file[0].toUpperCase())
                        const localeFile = path.resolve(localeDir, file)

                        createDir(localeDir, (err) => {
                            if (err) throw err

                            copyFile(currentPath, localeFile, (err) => {
                                if (err) throw err
                                counter++;
                                console.log('copyFile', `count:${counter}`)
                                observer.remove(currentPath)
                            })
                        })
                    })
                } else {
                    reader(currentPath)
                    observer.remove(src)
                }
            }) 
        })

        observer.remove(src)
    })
}

try {
    reader(folder)
} catch (error) {
    console.log(error)
}