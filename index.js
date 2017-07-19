const app = require('express')();
const fs = require('fs');
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    fs.readFile('./data/todos.json', (err, data) => {
        if (err) return;
        data = JSON.parse(data);
        res.render('index', {
            data: data
        })
    });
});

app.get('/addTodo/:text', (req, res) => {
    if (req.params.text) {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) res.json({
                success: false,
                error: err
            });
            data = JSON.parse(data);
            data.data.push({
                name: req.params.text,
                checked: 0
            });
            fs.writeFile('./data/todos.json', JSON.stringify(data), (err2) => {
                if (err2) res.json({
                    success: false,
                    error: err2
                });
                else res.json({
                    success: true,
                    index: data.data.length
                });
            });
        });
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/deleteTodo/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) res.json({
                success: false,
                error: err
            });
            data = JSON.parse(data);
            data.data.splice(req.params.id, 1);
            fs.writeFile('./data/todos.json', JSON.stringify(data), (err2) => {
                if (err2) res.json({
                    success: false,
                    error: err2
                });
                else res.json({
                    success: true
                });
            });
        });
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/toggle/:id/:state', (req, res) => {
    if (req.params.id && req.params.state) {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) res.json({
                success: false,
                error: err
            });
            data = JSON.parse(data);
            data.data[req.params.id].checked = req.params.state;
            fs.writeFile('./data/todos.json', JSON.stringify(data), (err2) => {
                if (err2) res.json({
                    success: false,
                    error: err2
                });
                else res.json({
                    success: true
                });
            });
        });
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});