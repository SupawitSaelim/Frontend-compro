// frontend code
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');


const base_url = 'http://202.151.188.200:11437';

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    try {
        const response = await fetchDataFromBackend();

        const message = {
            type: 'success',
            message: 'Data fetched successfully',
        };

        res.render('index', {
            users: response,
            message: ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

app.post('/add', async (req, res) => {
    try {
        const newUser = {
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            zipcode: req.body.zipcode,
        };
        console.log(newUser)

        const response = await axios.post(base_url + '/add', newUser);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.delete(base_url + '/delete/' + id);

        console.log('User deleted successfully');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = {
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            zipcode: req.body.zipcode,
        };
        await axios.put(`${base_url}/update/${id}`, updatedUser);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


app.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await fetchDataFromBackend();
        const user = users.find(user => user._id === id);

        if (!user) {
            return res.redirect('/');
        }
        res.render('edit_users', {
            title: 'Edit User',
            user: user,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


app.listen(5500, () => {
    console.log('Server started on port 5500');
});

async function fetchDataFromBackend() {
    try {
        const response = await axios.get(base_url + '/users');
        return response.data;
    } catch (error) {
        throw error;
    }
}

