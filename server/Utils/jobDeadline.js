const DAY_MS = 24 * 60 * 60 * 1000

function isApplicationOpen(deadline){
    if(!deadline){
        return true
    }
    return Date.now() <= new Date(deadline).getTime() + DAY_MS
}

function getHideBeforeDate(){
    return new Date(Date.now() - 2 * DAY_MS)
}

module.exports = { DAY_MS, isApplicationOpen, getHideBeforeDate }