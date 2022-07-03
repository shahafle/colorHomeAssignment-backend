const fs = require('fs')
const utilService = require('./util.service')
const gColors = require('../data/color.json')

const PAGE_SIZE = 5
module.exports = {
    query,
    getById,
    remove,
    addVote,
    save
}


function query(filterBy = { txt: '' }) {
    const regex = new RegExp(filterBy.txt, 'i')
    var colors = gColors.filter(color => regex.test(color.name) || regex.test(color.hex))

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        colors = colors.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(colors)
}

function getById(colorId) {
    const color = gColors.find(color => color.id === colorId)
    return Promise.resolve(color)
}

async function save(color) {
    if (color.id) {
        const idx = gColors.findIndex(currColor => currColor.id === color.id)
        gColors.splice(idx, 1, color)
    } else {
        color.id = utilService.makeId()
        color.createdAt = Date.now()
        gColors.push(color)
    }

    await _saveColorsToFile()
    return color
}

async function addVote(colorId) {
    const color = await getById(colorId)
    color.votes++
    const idx = gColors.findIndex(currColor => currColor.id === color.id)
    gColors.splice(idx, 1, color)
    await _saveColorsToFile()
    return color
}

function remove(colorId) {
    const idx = gColors.findIndex(color => color.id === colorId)
    gColors.splice(idx, 1)
    return _saveColorsToFile()
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