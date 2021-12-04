# Phaser 3 Atlas Splitter

A node cli tool to convert an atlas image to individuals sprites

## Installation

```
git clone https://github.com/huhmiel-games/Phaser3-Atlas-Splitter.git

cd Phaser3-Atlas-Splitter

npm install

```

Copy your atlas image and json to the current folder

```
node index.js atlasName.png atlasName.json
```

The individuals sprites will be created in the output folder.

### WARNING: the output folder is automatically created and deleted each time

### WARNING: rotated frames aren't handled

## Compatible Texture Packer Softwares
- Free Texture Packer: http://free-tex-packer.com/
- Must work with Texture Packer too (not tested)
