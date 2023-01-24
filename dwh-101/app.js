import { bootServer } from "./server/server.js";
import database from "./database/database.js"


console.log(`\nthank you for choosing to learn stuff!\n`)
bootServer()
await database()