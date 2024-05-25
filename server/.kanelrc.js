const { makeKyselyHook } = require("kanel-kysely");

module.exports = {
    connection: {
        // This is intended to run outside of Docker in local dev. 
        host: 'localhost',
        user: process.env.PSQL_USERNAME,
        password: process.env.PSQL_PASSWORD,
        database: process.env.PSQL_DB,
        port: process.env.PSQL_PORT
    },

    preDeleteOutputFolder: true,
    outputPath: "./src/schemas",

    preRenderHooks: [makeKyselyHook()],
}