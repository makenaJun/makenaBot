const generateKeyForGame = () => {
    const result = [];
    let row = [];
    for (let i = 0; i <= 9; i++) {
        const obj = {
            text: i.toString(),
            callback_data: i.toString(),
        }
        row.push(obj);
        if (i % 3 === 0) {
            result.push(row);
            row = []
        }
    }
    return result;
}

module.exports = generateKeyForGame;
