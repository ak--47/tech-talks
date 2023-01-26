import queryDatabase from './fakeSQL.js'

export default async function main(q) {
	const query = q || `SELECT * LIMIT 2 WHERE PG` 
	const databaseResponse = await queryDatabase(query);
	const model = parseDatabase(databaseResponse)

	return model
}

main()



function parseDatabase(queryResults) {
	return queryResults.map((result)=>{
		
		const splitResult = result.replaceAll('"', '').split(',')
		return {
			id: Number(splitResult[0]),
			joke: splitResult[1],
			rating: splitResult[2]
		}
	})
	
	
}