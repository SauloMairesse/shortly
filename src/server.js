import express, {json} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routers/router';

dotenv.config()

const app = express();
app.use(cors())
app.use(json())

//Routas
app.use(router)

//configuracao da porta
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor em pé na porta ${port}!`);
})