require('dotenv').config();

const database = {
  common: {
    connectionString: process.env.DATABASE_URL,
    query_timeout: 30000,
    connectionTimeoutMillis: 20000,
  },
  get pool(){return {
    ...this.common,
    max: 3,
    idleTimeoutMillis: 30000,
  }},
  get client(){return this.common},
}

module.exports = { database }
