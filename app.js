var express =  require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

//parametros de la conexion 
var conexion = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'articulosdb'
});

conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('conexion exitosa');
    }
});

app.get('/', function(request,response){
    response.send('Ruta de inicio');
})

app.listen('3000', function(){
    console.log("Server OK")
});

//Muestra todos los articulos
app.get('/api/articulos', (request, response)=>{
    conexion.query('select * from articulos', (error, filas)=>{
        if(error){
            throw error;
        }else{
            response.send(filas);
        }
    })
});

//Muestra solo un articulo filtrado por el id
app.get('/api/articulos/:id', (request, response)=>{
    conexion.query('select * from articulos where id = ?', [request.params.id], (error, fila)=>{
        if(error){
            throw error;
        }else{
            //response.send(fila);
            response.send(fila[0].descripcion)
        }
    })
});

//Insertar un articulo en la db
app.post('/api/articulos', (request, response)=>{
    let data = {descripcion:request.body.descripcion, precio:request.body.precio, stock:request.body.stock}
    let sql = "insert into articulos set ?";
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            //response.send(fila);
            response.send(results)
        }
    });
});

//Modifica un articulo en la db
app.put('/api/articulos/:id', (request, response)=>{
    let id = request.params.id;
    let descripcion = request.body.descripcion;
    let precio = request.body.precio;
    let stock = request.body.stock;
    let sql = "update articulos set descripcion = ?, precio = ?, stock = ? where id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            //response.send(fila);
            response.send(results)
        }
    });
});

//Elimina un articulo en la db
app.delete('/api/articulos/:id', (request, response)=>{
    conexion.query('delete from articulos where id = ?', [request.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            //response.send(fila);
            response.send(filas)
        }
    })
})