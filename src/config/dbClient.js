const env = require('dotenv'); // Import dotenv to manage environment variables
env.config(); // Load environment variables from .env file
const MongoClient = require('mongodb').MongoClient; // Import MongoDB client

class dbClient{
    
    //contructor para inicializar el cliente de la base de datos
    constructor(){
        const urlConnection = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_URL}/?retryWrites=true&w=majority&appName=DemoProject`; // url de conexión a la base de datos
        this.client = new MongoClient(urlConnection); //crear una instancia del cliente de MongoDB
        this.connect(); //llamar al método connect para conectar a la base de datos

    }

    //metodo para conectar ala base de datos
    async connect(){
        try {
            await this.client.connect(); //conectar al cliente de MongoDB
            this.db = this.client.db(process.env.DB_NAME); //usar el nombre de la base de datos
            console.log('Conexión exitosa a la base de datos de MongoDB'); //mensaje de éxito
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error); //mensaje de error
            throw error; //lanzar el error para manejarlo en otro lugar
        }
    }
}
module.exports = new dbClient(); //exportar una instancia del cliente de la base de datos