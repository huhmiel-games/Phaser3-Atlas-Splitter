const fs = require("fs");
const Jimp = require('jimp');
var pjson = require('./package.json');
const ProgressBar = require("./ProgressBar");

const colors = {
    yellow: '\x1b[33m%s\x1b[0m',
    red: '\x1b[91m%s\x1b[39m'
}

const Bar = new ProgressBar();

if (process.argv.length < 4)
{
    console.log(colors.yellow, 'Phaser3 Atlas Splitter v' + pjson.version);
    console.log(colors.red, 'Warning: Atlas image and json must be in the current folder');
    console.log('Usage: node index.js <atlas.png, atlas.json>');
    return;
}

const atlasImageUrl = process.argv[2];
const atlasJsonUrl = process.argv[ 3 ];


let atlasJsonFile;
let atlasImageFile;

// output directory name
const dir = './output';

checkFilesExists();

createOutputDir();

startProcessing();

function createOutputDir ()
{
    try
    {
        // first check if directory already exists
        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);

            console.log(colors.yellow, 'A new Output Directory is created.');
        }
        else
        {
            console.log(colors.red, 'Output Directory already exists. Cleaning up');

            deleteOutputDir();
        }
    }
    catch (err)
    {
        console.log(err);
    }
}

function deleteOutputDir ()
{
    try
    {
        fs.rmdirSync(dir, { recursive: true });

        createOutputDir();
    }
    catch (err)
    {
        console.error('\x1b[33m%s\x1b[0m', `Error while deleting the output directory. Try to delete manually`);
    }
}

function checkFilesExists ()
{
    try
    {
        atlasImageFile = fs.readFileSync(`./${atlasImageUrl}`, "utf8");

        atlasJsonFile = fs.readFileSync(`./${atlasJsonUrl}`, "utf8");
    }
    catch (error)
    {
        console.log(colors.red, 'ERROR : Atlas asset not found')
        process.exit(1)
    }
}

function startProcessing ()
{
    console.log('\x1b[33m%s\x1b[0m', 'Processing');

    const frames = JSON.parse(atlasJsonFile).textures[ 0 ].frames;

    const total = frames.length;
    let current = 0;

    Bar.init(total);

    Jimp.read(atlasImageUrl, (err, atlasImg) =>
    {
        if (err) throw err;

        try {
            frames.forEach(frame =>
                {
                    const atlas = atlasImg.clone();
        
                    const frameImg = atlas.crop(frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);
        
                    const img = new Jimp(frame.sourceSize.w, frame.sourceSize.h, 0x00000000);
                    img.composite(frameImg, frame.spriteSourceSize.x, frame.spriteSourceSize.y);
                    img.write(`${ dir }/${ frame.filename }.png`);
        
                    current += 1;
                    Bar.update(current);
                });
                console.log('\x1b[33m%s\x1b[0m', '\nDone')
        }
        catch (error)
        {
            
        }

        
    });
}
