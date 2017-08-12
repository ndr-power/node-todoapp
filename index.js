const app = require('express')();
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const port = 3000;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    renderTodos()
    .then(data => {
        res.render('index', {data: data});
    })
    .catch(e => {res.json({success: false, error: e})});
});

app.get('/addTodo/:text', (req, res) => {
    if (req.params.text) {
        manageTodos('add', req.params.text)
            .then(data => {
                res.json(data);
            });
            .catch(e => {res.json({success: false, error: e})});
    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/deleteTodo/:id', (req, res) => {
    if (req.params.id) {
        manageTodos('delete', req.params.id)
        .then(data => {
                    res.json(data);
        })
         .catch(e => {res.json({success: false, error: e})});

    } else {
        res.json({
            success: false,
            error: "invalid parameters"
        });
    }
});
app.get('/toggle/:id/:state', (req, res) => {
    if (req.params.id && req.params.state) {
         manageTodos('toggle', [req.params.id, req.params.state])
         .then(data => {
        res.json(data);
         })
            .catch(e => {res.json({success: false, error: e})});
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
        let data = await readFile('./data/todos.json');
        data = JSON.parse(data);
                console.log(data);

        switch (_type) {
            case 'add':
               data = addTodo(data, _param);
                break;
            case 'delete':
                data = deleteTodo(data, _param);
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
   
}
function addTodo(_data, _param){
    _data.data.push({
                    name: _param,
                    checked: 0
                });
    return _data;
}
function deleteTodo(_data, _param){
     _data.data.splice(_param, 1);
        return _data;

}
function toggleTodo(_data, _param){
     _data.data[_param[0]].checked = _param[1];
    return _data;

    }
