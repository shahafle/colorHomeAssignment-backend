const fs = require('fs')
const utilService = require('./util.service')
const gColors = require('../data/color.json')

const PAGE_SIZE = 5
module.exports = {
    query,
    getById,
    remove,
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
    const color = gColors.find(color => color._id === colorId)
    return Promise.resolve(color)
}

async function save(color, loggedinUser) {
    if (color._id) {
        const idx = gColors.findIndex(currColor => currColor._id === color._id)
        if (gColors[idx].owner._id !== loggedinUser._id) {
            return Promise.reject('Not your Color')
        }
        gColors.splice(idx, 1, color)
    } else {
        color._id = utilService.makeId()
        color.createdAt = Date.now()
        gColors.push(color)
    }

    await _saveColorsToFile()
    return color
}

function remove(colorId, loggedinUser) {
    const idx = gColors.findIndex(color => color._id === colorId)
    if (!loggedinUser.isAdmin && gColors[idx].owner._id !== loggedinUser._id) {
        return Promise.reject('Not your Color')
    }
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