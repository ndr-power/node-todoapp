const app = require('express')();
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const port = 3000;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    let returnData = renderTodos().catch(e => {res.json({success: false, error: e})});
    res.render('index', {data: returnData});
});

app.get('/addTodo/:text', (req, res) => {
    if (req.params.text) {
        let returnData = manageTodos('add', req.params.text, res);
        res.json(returnData);
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/deleteTodo/:id', (req, res) => {
    if (req.params.id) {
        let returnData = manageTodos('delete', req.params.id, res);
        res.json(returnData);
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/toggle/:id/:state', (req, res) => {
    if (req.params.id && req.params.state) {
        let returnData = manageTodos('toggle', [req.params.id, req.params.state]);
        res.json(returnData);
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
        let data = await readFile('./data/todos.json');
        data = JSON.parse(data);
        return data;
}

async function manageTodos(_type, _param) {
    try {
        let data = await readFile('./data/todos.json');
        data = JSON.parse(data);
        switch (_type) {
            case 'add':
               data = addTodo(data, _param);
                break;
            case 'delete':
                data = deleteTodo(data, _params);
                break;
            case 'toggle':
                data = toggleTodo(data, _param);
                break;
        }

        await writeFile('./data/todos.json', JSON.stringify(data))

        return {
            success: true,
            index: data.data.length
        };
    } catch (e) {
        return {
            success: false,
            error: e
        };
    }
}
function addTodo(_data, _param){
    return data.data.push({
                    name: _param,
                    checked: 0
                });
}
function deleteTodo(_data, _param){
    return data.data.splice(_param, 1);
}
function toggleTodo(_data, _param){
    return data.data[_param[0]].checked = _param[1];
}
