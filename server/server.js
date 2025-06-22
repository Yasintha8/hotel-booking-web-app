import express from 'express';
import "dotenv/config";
import cors from 'cors';

const app = express();
app.use(cors()); //Enable Cross-origin Resource Sharing

app.get('/',(req, res)=> res.send('API is working!'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));