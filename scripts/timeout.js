module.exports = async function timeout(time) {
    try {
        await ((() => new Promise(r => setTimeout(r, time)))())
    } catch (err) { console.log(`timeout ERROR: ${e}`) }
}
