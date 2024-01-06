import dotenv from 'dotenv'
dotenv.config()

export default {
    
    ports: {
        prodPort: process.env.PROD_PORT || 3000,
        devPort: process.env.DEV_PORT
    },
    log: {
        level: process.env.ENVIROMENT
    },
    jwt: {
        privateKey: process.env.PRIVATE_KEY,
        cookieName: process.env.JWT_COOKIE_NAME
    }
}