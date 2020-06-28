require('dotenv').config()

module.exports = {

  HAPI_PORT: parseInt(process.env.PORT),

  HAPI_HOST: process.env.HOST,

  MONGODB_URI: process.env.MONGODB_URI,

  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,

  SWAGGER_DOC_TITLE: process.env.SWAGGER_DOC_TITLE,

  SWAGGER_DOC_VERSION: process.env.SWAGGER_DOC_VERSION,

}