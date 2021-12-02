const yargs = require('yargs')
const fs = require("fs");
const util = require("util");
const path = require("path");
const readdir = util.promisify(fs.readdir);

const directory = process.argv[2];
const finalPath = process.argv[3];
const shouldDelete = process.argv[4];

const args = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('1.0.1')
    .alias('version', 'v')
    .example('node $0 ./path ./path -d')
    .option('delete', {
         alias: 'd',
         describe: 'Удалить ли папку ?',
         default: false,
         boolean: true
    })
    .epilog('Homework 1')
    .argv

const sort = (directory, finalPath) => {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const localBase = path.join(directory, file);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            sort(localBase, finalPath);
        } else {
            if (!fs.existsSync(`./${finalPath}`)) {
                fs.mkdirSync(`./${finalPath}`);
            }

            if (!fs.existsSync(path.join(finalPath, file[0].toUpperCase()))) {
                fs.mkdirSync(path.join(finalPath, file[0].toUpperCase()));
            }

            fs.link(
                localBase,
                path.join(finalPath, file[0].toUpperCase(), file),
                (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                }
            );
        }
    });
};

const removeDir = (directory, cb) => {
    const files = fs.readdirSync(directory);

    files.forEach(async (file) => {
        const localBase = path.join(directory, file);
        const state = fs.statSync(localBase);

        if (state.isDirectory()) {
            removeDir(localBase);
        } else {
            fs.unlinkSync(localBase);
        }
    });

    fs.rmdir(directory, (err) => {
        if (err) {
            console.error(err);
        }
    });
};

sort(directory, finalPath);

if (shouldDelete === "-d") {
    removeDir(directory);
}
