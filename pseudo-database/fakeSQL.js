//@ts-nocheck
import fs from 'fs/promises'

//faux SQL facade
export default async function main(query = `SELECT * LIMIT 2 WHERE PG`) {
    const sourceData = (await fs.readFile(`./jokes.csv`)).toString()
    const rows = sourceData.split("\n");
    let selectNumber = query.split("LIMIT")[0].split("SELECT")[1].trim();
    const limitNumber = query.split("LIMIT").pop().split("WHERE")[0].trim();
    const whereClause = query.split("WHERE").pop().trim();

    //SELECT determines where the loop starts
    let startIndex;
    if (selectNumber === "*") {
        startIndex = 0;
    } else {
        startIndex = selectNumber
    }

    let resultJokes = [];
    for (let index = startIndex; index < rows.length; index++) {
        if (rows[index].includes(whereClause)) {
            resultJokes.push(rows[index])
        }

        if (resultJokes.length >= limitNumber) {
            break;
        }

    }
    
    return resultJokes;


}

