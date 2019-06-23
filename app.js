var createError 	= require('http-errors');
var express 		= require('express');
var cors 			= require('cors');
var path 			= require('path');
var cookieParser 	= require('cookie-parser');
var logger 			= require('morgan');

var indexRouter = require('./routes/index');
var autenticacaoRouter = require('./routes/autenticacao');
var accountsRouter = require('./routes/accounts');
var registroSensorRouter = require('./routes/registroSensor');
var dispositivoRouter = require('./routes/dispositivo');
var sensorRouter = require('./routes/sensor');
var empreendimentoRouter = require('./routes/empreendimento');
var clienteRouter = require('./routes/cliente');
var receiverRouter = require('./routes/receiver');
var estadoRouter = require('./routes/estado');
var municipioRouter = require('./routes/municipio');
var notificationRouter = require('./routes/notification');
var usuario = require('./routes/usuario');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/accounts', accountsRouter);
app.use('/registro-sensor', registroSensorRouter);
app.use('/dispositivo', dispositivoRouter);
app.use('/sensor', sensorRouter);
app.use('/empreendimento', empreendimentoRouter);
app.use('/cliente', clienteRouter);
app.use('/receiver', receiverRouter);
app.use('/autenticacao', autenticacaoRouter);
app.use('/estado', estadoRouter);
app.use('/municipio', municipioRouter);
app.use('/notification', notificationRouter);
app.use('/usuario', usuario);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
