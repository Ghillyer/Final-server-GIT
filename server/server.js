require('dotenv').config(); 


const express = require('express');
const cors = require('cors');
const mongoose = require('./db'); 


const app = express();




app.use(cors()); 
app.use(express.json()); 





const userRoutes = require('./routes/userRoutes'); 
app.use('/api/users', userRoutes); 



const cardRoutes = require('./routes/cardRoutes');
app.use('/api/cards', cardRoutes);

app.use('/uploads', express.static('uploads'));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
});




