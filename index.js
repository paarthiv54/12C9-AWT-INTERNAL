const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
app.use(express.json());

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 }
});
const Product = new mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = new mongoose.model('User', userSchema);

mongoose.connect("mongodb+srv://paarthivramaraju2004:Paarthiv@cluster0.sap9whx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log(`database connected`);
})
.catch((err) => {
    console.log("error during correction", err);
})

app.get('/api/products', (req, res) => {
    Product.find()
    .then((products) => {
        res.status(200).json(products);
    })
    .catch((err) => {
        res.status(400).json(err);
    })

});

app.get('/api/products/:id', (req, res) => {
    Product.findById(req.params.id)
    .then((product) => {
        res.status(200).json(product);
    })
    .catch((err) => {
        res.status(400).json(err);
    })

});

app.delete('/api/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => {
        res.status(400).json(err);
    })

});

app.post('/api/products', (req, res) => {
    const p = new Product(req.body);
    p.save()
    .then(() => {
        res.status(201).json({message:"Product added"}, p);
    })
    .catch((err) => {
        res.status(400).json(err);
    })
});

app.put('/api/products/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        res.status(201).json({ message: "Product updated" });
    })
    .catch((err) => {
        res.status(400).json(err);
    })
});

app.post('/api/register', (req, res) => {
    const { userName, email, password } = req.body;
    const user = new User({ userName, email, password });
    user.save()
    .then(() => {
        res.status(201).json({ message: "User registered " }, user);
    })
    .catch((err) => {
        res.status(400).json(err);
    })
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
    .then((user) => {
        if (!user) {
            return res.status(401).json({ message: "Invalid " });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid " });
        }
        const token = jwt.sign({ id: user._id }, 'secret_key');
        res.status(200).json({message:"valid user",  token });
    }).catch((err) => {
        res.status(400).json(err);
    })
});

app.listen(3000, () => {
    console.log(`Server started`);
});
