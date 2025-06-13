import dotenv from 'dotenv';
let config; 
dotenv.config();

try {
    config = {
        PORT: process.env.PORT,
        AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
        AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
        AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        SECRET_KEY: process.env.SECRET_KEY,
    };     
} 
catch (error) {
    console.log(error);
}

export default config; 
