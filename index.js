const app = require('express')();
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const port = 3000;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    renderTodos(res);
});

app.get('/addTodo/:text', (req, res) => {
    if (req.params.text) {
        manageTodos('add', req.params.text, res);
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/deleteTodo/:id', (req, res) => {
    if (req.params.id) {
        manageTodos('delete', req.params.id, res);
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/toggle/:id/:state', (req, res) => {
    if (req.params.id && req.params.state) {
        manageTodos('toggle', [req.params.id, req.params.state], res);
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
async function renderTodos(res) {
    try {
        let data = await readFile('./data/todos.json');
        data = JSON.parse(data);
        res.render('index', {
            data: data
        });
    } catch (e) {
        res.send('Error ' + e);
    }
}
async function manageTodos(_type, _param, res) {
    try {
        let data = await readFile('./data/todos.json');
        data = JSON.parse(data);
        switch (_type) {
            case 'add':
                data.data.push({
                    name: _param,
                    checked: 0
                });
                break;
            case 'delete':
                data.data.splice(_param, 1);
                break;
            case 'toggle':
                data.data[_param[0]].checked = _param[1];
                break;
        }

        await writeFile('./data/todos.json', JSON.stringify(data))

        res.json({
            success: true,
            index: data.data.length
        });
    } catch (e) {
        res.json({
            success: false,
            error: e
        });
    }
}