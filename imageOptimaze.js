const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const glob = require('glob');
const fs = require('fs');
const minimist = require('minimist');

function writeFile(path, buffer, permission) {
    permission = permission || 438; // 0666
    var fileDescriptor;

    try {
        fileDescriptor = fs.openSync(path, 'w', permission);
    } catch (e) {
        fs.chmodSync(path, permission);
        fileDescriptor = fs.openSync(path, 'w', permission);
    }

    if (fileDescriptor) {
        fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
        fs.closeSync(fileDescriptor);
    }
}

processingGameImg()

async function processingGameImg() {
    console.log(`start processing image...`);
    return await imagemin([`res/images//**/*.{jpg,png}`], {
        plugins: [
            imageminJpegtran(),
            imageminPngquant()
        ]
    }).then(async files => {
        if(Array.isArray(files)) {
            files.map(({sourcePath, data}) => {
                writeFile(sourcePath, data);
            });
            console.log(`images optimazed!`);
        }
        // специально сделал задержку, что бы компьютер не отправился в стратосферу когда будет выполнять оптимизацию
        await new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });
    });
}