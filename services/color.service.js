const fs = require('fs')
const gColors = require('../data/color.json')

module.exports = {
    query,
    getById,
    addVote,
}


function query() {
    return Promise.resolve(gColors)
}

function getById(colorId) {
    const color = gColors.find(color => color.id === colorId)
    return Promise.resolve(color)
}

async function addVote(colorId) {
    const color = await getById(colorId)
    color.votes++
    const idx = gColors.findIndex(currColor => currColor.id === color.id)
    gColors.splice(idx, 1, color)
    await _saveColorsToFile()
    return color
}

function _saveColorsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/color.json', JSON.stringify(gColors, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}