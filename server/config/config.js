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
    },
    urls: {
        urlLocal: process.env.URL_LOCAL,
        urlProd: process.env.URL_PROD
    },
    firebase: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
    },
    google: {
        admin: process.env.GOOGLE_EMAIL
    }
}