var express = require('express');
var net 	 = require('net');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var AsyncLock = require('node-async-locks').AsyncLock;
const spawn = require('threads').spawn;
var Op = Sequelize.Op;
var HistorySend = models.HistorySend;
var HistorySendItem = models.HistorySendItem;
var Account = models.Account;
var AccountItem = models.AccountItem;
var AccountItemAditional = models.AccountItemAditional;
var RemoteDevice = models.RemoteDevice;

async function sendSocketMessage(primary_device, secondary_device, message_data, tentativa, typeRemote) {
    // send payload to specific remote device with websocket connection...
    var client = new net.Socket();
        client.setTimeout(5000); // set timeout to 1 seconds...

    var device_ip = primary_device.split(':')[0];
    var device_port = Number(primary_device.split(':')[1]);

    client.connect(device_port, device_ip, function() {
        console.log('CONNECTED TO: '+ device_ip +':'+ device_port + " send history " + message_data.id);
        client.write(JSON.stringify(message_data));
        typeRemoteSend(message_data.id, typeRemote);
    });
    client.on('data', function(data){
        console.log('DATA RECEIVED FROM '+ device_ip +':'+ device_port +':');
        console.log(''+data);
        checkSend(message_data.id);
        client.end();
        client.destroy();
    });

    client.on('close', function(){
        console.log('CONNECTION CLOSED TO: '+ device_ip +':'+ device_port);
        client.end();
        client.destroy();
    });

    client.on('error', async function(error){
        console.log('CONNECTION ERROR TO: '+ device_ip +':'+ device_port);
        console.error(error);
        client.end();
        client.destroy();

        var history = await HistorySend.findById(message_data.id);
        if(history.sendedAt == null){
            if(tentativa <= 2){
                tentativa++;
                sendSocketMessage(primary_device, secondary_device, message_data, tentativa, 2);
            }
            else{
                if(secondary_device != null) {
                    sendSocketMessage(secondary_device, null, message_data, 1, 2);
                }
            } 
        }
    }); 
    client.on('timeout', async function(){
        console.log('CONNECTION TIMEOUT TO: '+ device_ip +':'+ device_port);
        client.end();
        client.destroy();

        var history = await HistorySend.findById(message_data.id);
        if(history.sendedAt == null){
            if(tentativa <= 2){
                tentativa++;
                sendSocketMessage(primary_device, secondary_device, message_data, tentativa, 2);
            }
            else{
                if(secondary_device != null) {
                    sendSocketMessage(secondary_device, null, message_data, 1, 2);
                }
            } 
        }   
    });
}

async function typeRemoteSend(history_send_id, typeRemote){
    var history_send  = await HistorySend.findById(history_send_id);
    history_send.update({
        typeRemoteSend: typeRemote
    });
}

async function checkSend(history_send_id){
    var history_send  = await HistorySend.findById(history_send_id);
    history_send.update({
        sendedAt: new Date(),
        flg_send: 1
    });
}

async function sendResponse(res, accounts, items) {
    var account = accounts;
    // retrieve account all items...
    // var items = await account.getAccountItems();

    if(items.length == 0)
        console.log('Não encontrado os Items da conta '+ account.id + ' primeira vez');

    if(items.length == 0 || items == null){
        items = await AccountItem.findAll({
            where:{
                account_id: account.id
            }
        });
    }

    if(items.length == 0)
        console.log('Não encontrado os Items da conta '+ account.id + ' segunda vez');

    // looping for items to...
    for (var i = 0; i < items.length; i++) {
        var aditionals = await items[i].getAccountItemAditionals();
        var remoteDeviceProduction = await RemoteDevice.findById(items[i].remote_device_production_id);
        
        items[i] = items[i].dataValues;
        items[i].aditionals = aditionals;
        items[i].remoteDeviceProduction = remoteDeviceProduction;
    }

    account = account.dataValues;

    if(account.remote_device_conference_id != null) {
        await sendConferece(account, items);
    }

    // filtering imediatelly items to send...
    var items_to_send_imediatelly = underscore.filter(items, function(el){
        return (el.prepare_time === null || el.prepare_time === 0);
    });

    if(items_to_send_imediatelly.length != 0)
        await prepareAccountsToSend(items_to_send_imediatelly, true, account);

    items = underscore.reject(items, function(el){
        return (el.prepare_time === null || el.prepare_time === 0);
    });
    
    if(items.length != 0)
        await prepareAccountsToSend(items, false, account);

    res.status(201);
    res.send('');
}

async function sendConferece(account,items){

    if(account.remote_device_conference_id != null) {
        var confAccountData = underscore.clone(account);
        confAccountData.items = items;
        // get conference remote device info...
        confAccountData.remoteDeviceConference = await RemoteDevice.findById(account.remote_device_conference_id);

        var primary_device = confAccountData.remoteDeviceConference.device_ip + ":" + confAccountData.remoteDeviceConference.device_port;
        
        if(confAccountData != null){
            var historySend = new HistorySend();
                historySend.account_id = confAccountData.id;
                historySend.remote_device = primary_device;
                historySend.max_prepare_time = null;
                historySend.screenType = 2;
            var objSavedConf = await historySend.save();
            var account_send = confAccountData;
            account_send.items = confAccountData.items;
            
            objSavedConf = objSavedConf.dataValues;
            delete objSaved.screenType;
            delete objSaved.typeRemoteSend;
            delete objSaved.createdAt;
            objSavedConf.items = [];

            account_send.items = underscore.sortBy(account_send.items, 'prepare_time').reverse();

            var hsi_saved = [];

            for(var x = 0; x < account_send.items.length; x++) {
                var historySendItem = new HistorySendItem();
                    historySendItem.history_send_id = objSavedConf.id;
                    historySendItem.account_item_id = account_send.items[x].id;
                    historySendItem.screenType = 2;
                
                if(x == 0)
                    historySendItem.flg_first_item = 1;

                var hsi = await historySendItem.save();
                console.log("salvo item id " + hsi.id + " do history id " + objSavedConf.id);
                historySendItem = historySendItem.dataValues;
                delete historySendItem.createdAt;
                delete historySendItem.deletedAt;
                delete historySendItem.screenType;
                delete historySendItem.flg_first_item;
            }
            
            sendSocketMessage(primary_device, null, objSavedConf, 1, 1);
        }
    }
}

async function prepareAccountsToSend(items, imediatelly , account) {
    // identifying remote devices to send account...
    var rds = underscore.groupBy(items, function(item){
        if(item.remoteDeviceProduction != null) {
            var ip   = item.remoteDeviceProduction.device_ip,
                port = item.remoteDeviceProduction.device_port;
            return ip +":"+ port;
        }
        else
            return null;
    });

    rds = underscore.toArray(rds);

    for(var i = 0; i < rds.length; i++){
        var device_ip = rds[i][0].remoteDeviceProduction.device_ip, 
            device_port = rds[i][0].remoteDeviceProduction.device_port;

        var mestra_ip = rds[i][0].remoteDeviceProduction.mestra_ip, 
            mestra_port = rds[i][0].remoteDeviceProduction.mestra_port;

        rds[i] = {
            remote_device: device_ip +":"+ device_port,
            mestra_device: mestra_ip +":"+ mestra_port,
            items: rds[i],
            account: underscore.clone(account)
        }
    }

    for(var x = 0; x < rds.length; x++) {
        rds[x].max_prepare_time = -1;
        for(var y = 0; y < rds[x].items.length; y++){
            if(rds[x].items[y].prepare_time > rds[x].max_prepare_time) {
                rds[x].max_prepare_time = rds[x].items[y].prepare_time;
            }
        }
    }

    
    var rds_order_list = underscore.sortBy(rds, 'max_prepare_time').reverse();
    var max_prepare_time = rds_order_list[0].max_prepare_time;

    for (let i = 0; i < rds_order_list.length; i++) {
        var historySend = new HistorySend();
            historySend.account_id = rds_order_list[i].account.id;
            historySend.remote_device = rds_order_list[i].remote_device;
            historySend.max_prepare_time = rds_order_list[i].max_prepare_time;
            historySend.screenType = 1;
            historySend.mestra_device = rds_order_list[i].mestra_device;
        var objSaved = await historySend.save();
        var rd_to_send = rds_order_list[i];
        
        objSaved = objSaved.dataValues;

        delete objSaved.screenType;
        delete objSaved.typeRemoteSend;
        delete objSaved.createdAt;
        objSaved.items = [];

        rd_to_send.items = underscore.sortBy(rd_to_send.items, 'prepare_time').reverse();

        var hsi_saved = [];

        for(var x = 0; x < rd_to_send.items.length; x++) {
            var historySendItem = new HistorySendItem();
                historySendItem.history_send_id = objSaved.id;
                historySendItem.account_item_id = rd_to_send.items[x].id;
                historySendItem.screenType = 1;
            
            if(x == 0)
                historySendItem.flg_first_item = 1;

                var hsi = await historySendItem.save();
                console.log("salvo item id " + hsi.id + " do history id " + objSaved.id);
                historySendItem = historySendItem.dataValues;
                delete historySendItem.createdAt;
                delete historySendItem.deletedAt;
                delete historySendItem.screenType;
                delete historySendItem.flg_first_item;

            
            hsi_saved.push(hsi);
        }

        if(!imediatelly) {
            if(objSaved.max_prepare_time == max_prepare_time) {
                console.log('sending directly to '+ rd_to_send.remote_device);

                var primary_device = rd_to_send.remote_device;
                var secondary_device = rd_to_send.mestra_device;
                
                sendSocketMessage(primary_device, secondary_device, objSaved, 1, 1);
            }
        }
        else {
            console.log('sending directly to ZERADOS '+ rd_to_send.remote_device);

            var primary_device = rd_to_send.remote_device;
            var secondary_device = rd_to_send.mestra_device;
            
            sendSocketMessage(primary_device, secondary_device, objSaved, 1, 1);
        }
    }
}

async function saveAccountDB(accountData, res) {
    var rds = await RemoteDevice.findAll({ deletedAt: null });
    
    if(rds != null && rds.length > 0) {4
        if(accountData.items != null && accountData.items.length > 0) {
            var account = new Account();
                account.pid         = accountData.pid;
                account.type        = accountData.type;
                account.number      = accountData.number;
                account.status_code = 0; // every starts with 0 (pending production...)

            // if account has conference remote device...
            if(accountData.remote_device_conference != null) {
                rds.forEach(rd => {
                    // obtain id of conference remote device...
                    if(rd.pid == accountData.remote_device_conference.pid) {
                        account.remote_device_conference_id = rd.id;
                    }
                });
            }
            var accountSaved = await account.save();
            var itemsSaved = [];
            for(var i = 0; i < accountData.items.length; i++) {
                var accountItemSaved = await saveAccountItemDB(accountData.items[i], accountSaved, rds);
                
                itemsSaved.push(accountItemSaved);

                if(accountData.items[i].aditionals != null && accountData.items[i].aditionals.length > 0) {
                    for(var a = 0; a < accountData.items[i].aditionals.length; a++) {
                        var accountItemAditionalSaved = await saveAccountItemAditionalDB(accountData.items[i].aditionals[a], accountItemSaved);                        
                    }
                }
            }

            sendResponse(res, accountSaved, itemsSaved);
        }
        else {
            res.status(406);
            res.send('Nenhum item foi enviado para esta conta!');
        }
    }
    else {
        res.status(406);
        res.send('Nenhum dispositivo remoto associado!');
    }
}

async function saveAccountItemDB(itemData, account, rds) {
    var accountItem = new AccountItem();
        accountItem.pid 			= itemData.pid;
        accountItem.account_id      = account.id;
        accountItem.name 			= itemData.name;
        accountItem.quantity 		= itemData.quantity;
        accountItem.prepare_time 	= itemData.prepare_time;
        accountItem.combo_name 		= itemData.combo_name;
        accountItem.status_code 	= 0; // every starts with 0 (pending production...)

    // if item has production remote device...
    if(itemData.remote_device_production != null) {
        rds.forEach(rd => {
            // obtain id of production remote device...
            if(rd.pid == itemData.remote_device_production.pid) {
                accountItem.remote_device_production_id = rd.id;
            }
        });
    }

    var accountItemSaved = await accountItem.save();

    return accountItemSaved;
}

async function saveAccountItemAditionalDB(aditionalData, accountItem) {
    var accountItemAditional = new AccountItemAditional();
        accountItemAditional.name            = aditionalData.name;
        accountItemAditional.account_item_id = accountItem.id;
    
    var accountItemAditionalSaved = await accountItemAditional.save();

    return accountItemAditionalSaved;
}

// Create account
router.post('/', async function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        console.log(JSON.stringify(req.body));
        saveAccountDB(req.body, res);
    }
    else {
        res.status(406);
        res.send('Nenhuma informação foi encontrada no corpo da requisição');
    }
});

// List accounts
router.get('/', function(req, res, next) {
  	Account.findAll({}).then(items => {
		if(items.length > 0) {
            res.json(items);
        }
        else {
            res.status(404);
            res.send('');
        }
	});
});

// Get account data by id
router.get('/:account_id', function(req, res, next) {
    Account.findById(req.params.account_id).then(item => {
        res.json(item);
    });
});

// Get account items
router.get('/:account_id/items', function(req, res, next) {
    AccountItem.findAll({
        where: {
            account_id: req.params.account_id
        }
    }).then(items => {
      if(items.length > 0) {
          res.json(items);
      }
      else {
          res.status(404);
          res.send('');
      }
  });
});

router.delete('/items', function(req, res) {
    AccountItem.findAll({
        where: {
            status_code: {
                [Op.ne]: 2 // Items Not Completed
            },
            remote_device_production_id: req.query.remote_device_id,
            deletedAt: null // Not Excluded
        }
    }).then(items => {
        items.forEach(item => {
            item.destroy({
                truncate: true
            });
        });
        res.send('');
    });
});

// Get account items not completed
async function sendItemsNotCompletedResponse(res, accounts,remote_device_production_id) {
    for(var i = 0; i < accounts.length; i++) {
        var sqlQuery  = "select tai.* ";
            sqlQuery += "from tbl_account_items as tai ";
            sqlQuery += "join tbl_history_send_items as hsi on hsi.account_item_id = tai.id ";
            sqlQuery += "join tbl_history_send as ths on ths.id = hsi.history_send_id ";
            sqlQuery += "where tai.account_id = "+ accounts[i].id +" ";
            sqlQuery += "  and tai.remote_device_production_id = "+ remote_device_production_id +" ";
            sqlQuery += "  and tai.status_code <> 2 ";
            sqlQuery += "  and ths.typeRemoteSend = 1 ";
            sqlQuery += "  and ths.flg_send = 1 ";
            sqlQuery += "group by tai.pid";
        
        var items = await models.sequelize.query(sqlQuery);
        accounts[i].items = items[0];
        if(items[0].length === 0){
            delete accounts[i];
        }
        else{
            for(var x = 0; x < accounts[i].items.length; x++) {
                accounts[i].items[x].aditionals = await AccountItemAditional.findAll({
                    where: {
                        account_item_id: accounts[i].items[x].id,
                    }
                });
            }
        }
    }
    res.json(accounts);
}

router.get('/items/notcompleted', function(req, res, next){
    var sqlQuery  = "SELECT acc.* ";
        sqlQuery += "FROM tbl_account_items        AS tai ";
        sqlQuery += "INNER JOIN tbl_accounts       AS acc ON acc.id = tai.account_id ";
        sqlQuery += "INNER JOIN tbl_history_send   as ths ON ths.account_id = acc.id ";
        sqlQuery += "WHERE tai.status_code <> 2 ";
        sqlQuery += "   AND tai.deletedAt is null ";
        sqlQuery += "   AND tai.remote_device_production_id = '"+ req.query.remote_device_id +"' ";
        sqlQuery += "GROUP BY acc.id";
    
    models.sequelize.query(sqlQuery).then(results => {
            if(results[0].length > 0) {
                sendItemsNotCompletedResponse(res, results[0],req.query.remote_device_id);
            }
            else {
                res.status(404);
                res.send('');
            }
        });
});

// Get account items completed
async function sendItemsCompletedResponse(res, accounts) {
    for(var i = 0; i < accounts.length; i++) {
        accounts[i].items = await AccountItem.findAll({
            where: {
                account_id: accounts[i].id,
                finishedAt: {
                    [Op.ne]: null
                },
                sync: 0
            }
        });
        
        for(var x = 0; x < accounts[i].items.length; x++) {
            accounts[i].items[x].aditionals = await AccountItemAditional.findAll({
                where: {
                    account_item_id: accounts[i].items[x].id
                }
            });
        }
    }

    res.json(accounts);
}

router.get('/items/completed', function(req, res, next) {
    var sqlQuery =  "SELECT act.* ";
        sqlQuery += "FROM tbl_accounts AS act ";
        sqlQuery += "INNER JOIN tbl_account_items AS itm ON itm.account_id = act.id ";
        sqlQuery += "WHERE itm.finishedAt IS NOT NULL ";
        sqlQuery += "   AND itm.sync = 0 ";
        sqlQuery += "GROUP BY act.id";
    
    models.sequelize.query(sqlQuery).then(results => {
        if(results[0].length > 0) {
            sendItemsCompletedResponse(res, results[0]);
        }
        else {
            res.status(404);
            res.send('');
        }
    });
});

async function sendHistorySendAccountData(req, res) {
    var itemsEncontrados = false;
    var history_send = await HistorySend.findById(req.params.history_send_id);
    if(history_send != null){
        var account = await history_send.getAccount();

        account = account.dataValues;
        account.items = [];
        
        var items = await HistorySendItem.findAll({
            where: {
                history_send_id: history_send.id
            }
        });

        console.log("Quantidade de items: " + items.length + " no history " + history_send.id);

        for(var i = 0; i < 10 && itemsEncontrados == false; i++) {
            if(items.length <= 0){
                items = await HistorySendItem.findAll({
                    where: {
                        history_send_id: history_send.id
                    }
                });
                console.log(i + 'º tentativa de achar os items da conta ' + account.number + " via history " + history_send.id);
            }
            else
                itemsEncontrados = true;
        }

        if(items.length > 0){
            for(var i = 0; i < items.length; i++) {
                var item_data = await AccountItem.findById(items[i].account_item_id);
                item_data = item_data.dataValues;

                var aditionals = await AccountItemAditional.findAll({
                    where: {
                        account_item_id: item_data.id
                    }
                });

                item_data.aditionals = aditionals;

                account.items.push(item_data);
            }

            checkSend(history_send.id);
            res.json(account);
        }
        else{
            res.status(406);
            res.send('Nenhum histórico de envio encontrado com o código informado!');
        }
    }
    else {
        res.status(406);
        res.send('Nenhum histórico de envio encontrado com o código informado!');
    }
}

router.get('/history/send/:history_send_id', function(req, res, next) {
    sendHistorySendAccountData(req, res);
});

// Check syncronized items
async function updateSyncItems(res, accounts) {
    for(var i = 0; i < accounts.length; i++){
        account = accounts[i];
        for(var x = 0; x < account.items.length; x++){
            item = account.items[x];
            if(item.sync) {
                var item_model = await AccountItem.findById(item.id);
                item_model.update({ sync: true });
            }
        }
    }

    res.status(200);
    res.send();
}

router.put('/items/sync', function(req, res, next) {
    updateSyncItems(res, req.body);
});

async function sendRemoteDeviceConferenceUpdate(account_id, item_data) {
    var account = await Account.findById(account_id);
    var account_data = account.dataValues;
        account_data.items = [];
        account_data.items.push(item_data);
        account_data.remoteDeviceConference = await RemoteDevice.findById(account.remote_device_conference_id);
        if(account_data.remoteDeviceConference != null){
            var primary_device = account_data.remoteDeviceConference.device_ip +":"+ account_data.remoteDeviceConference.device_port;

            if(account_data != null){
                var historySend = new HistorySend();
                    historySend.account_id = account_data.id;
                    historySend.remote_device = primary_device;
                    historySend.max_prepare_time = null;
                    historySend.screenType = 2;
                var objSaved = await historySend.save();
                var account_send = account_data;
                account_send.items = account_data.items;
                
                objSaved = objSaved.dataValues;
                objSaved.items = [];

                account_send.items = underscore.sortBy(account_send.items, 'prepare_time').reverse();

                for(var x = 0; x < account_send.items.length; x++) {
                    var historySendItem = new HistorySendItem();
                        historySendItem.history_send_id = objSaved.id;
                        historySendItem.account_item_id = account_send.items[x].id;
                        historySendItem.screenType = 2;
                    
                    if(x == 0)
                        historySendItem.flg_first_item = 1;

                        await historySendItem.save();
                            
                    objSaved.items.push(historySendItem);
                };
                
            if(account_data.remoteDeviceConference != null) {
                sendSocketMessage(
                    primary_device,
                    null, 
                    objSaved,
                    1,
                    1
                );
            }
        }
    }
}

// Check begining item preparation
router.put('/:account_id/items/:account_item_id/begin', function(req, res, next) {
    Account.findById(req.params.account_id).then(result =>{
        result.update({
            flg_novo: 0
        })
    });

    AccountItem.findById(req.params.account_item_id).then(item => {
        switch(item.status_code) {
            case 0: // preparo pendente
                item.update({
                    startedAt: new Date(),
                    status_code: 1
                }).then(item_model => {
                    sendRemoteDeviceConferenceUpdate(req.params.account_id, item_model.dataValues);

                    res.status(200);
                    res.send();
                });
                break;
            case 1: // preparo iniciado
                res.status(406);
                res.send('O preparo do item informado já foi iniciado!');
                break;
            case 2: // preparo finalizado
                res.status(406);
                res.send('O preparo do item informado já foi finalizado!');
                break;
        }
    });
    
    sendSchedule(req.params.account_item_id);

});

async function sendSchedule(item_id) {

    var historySendItem = await HistorySendItem.findAll({
        where:{
                account_item_id: item_id,
                screenType: 1
            }
        });

    if(historySendItem != null){
        if(historySendItem[0].flg_first_item === 1){
            var historySend = await HistorySend.findById(historySendItem[0].history_send_id);
            var historySends = await HistorySend.findAll({
                where:{
                    account_id:historySend.account_id,
                    sendedAt: null,
                    screenType: 1,
                    flg_send: 0
            }});
            historySends = underscore.reject(historySends, function(el){
                return (el.id === historySend.id || el.max_prepare_time === 0);
            });
            if(historySends.length != 0){
                for(var i = 0; i < historySends.length; i++){
                    var historySendData_model = historySends[i];

                    historySendData = historySendData_model.dataValues;
                    historySendData.items = await HistorySendItem.findAll({where:{history_send_id: historySendData.id}});
                   
                    var max_prepare_time = (historySend.max_prepare_time - historySendData.max_prepare_time);
            
                    var execution_date = new Date(Date.now()+(max_prepare_time*1000)+1000);
                    
                    historySendData_model.update({
                        flg_send: 1
                    });

                    console.log('scheduling '+ historySendData.remote_device + ' at '+ execution_date);

                    schedule.scheduleJob(execution_date, function(historySendData,historySendData_model){
                        console.log('sending to '+ historySendData.remote_device);
                        
                        var primary_device = historySendData.remote_device;
                        var secondary_device = historySendData.mestra_device;
                        delete historySendData.remote_device;

                        sendSocketMessage(primary_device, secondary_device, historySendData, 1, 1);
                    }.bind(null,historySendData,historySendData_model));
                }
            }
        }
    }
}

// Check ending item preparation
router.put('/:account_id/items/:account_item_id/end', function(req, res, next) {
    AccountItem.findById(req.params.account_item_id).then(item => {
        switch(item.status_code) {
            case 0: // preparo pendente
                res.status(406);
                res.send('O preparo do item informado ainda não foi iniciado!');
                break;
            case 1: // preparo iniciado
                item.update({
                    finishedAt: new Date(),
                    status_code: 2
                }).then(item_model => {
                    sendRemoteDeviceConferenceUpdate(req.params.account_id, item_model.dataValues);
                    if(req.body.deliveryRemoteDevice.device_ip != null && req.body.deliveryRemoteDevice.device_port != null)
                        sendRemoteDeviceEntrega(req.params.account_id, item_model.dataValues, req.body.deliveryRemoteDevice);
                    res.status(200);
                    res.send();
                });
                break;
            case 2: // preparo finalizado
                res.status(406);
                res.send('O preparo do item informado já foi finalizado!');
                break;
        }
    });


});

async function sendRemoteDeviceEntrega(account_id, item_data, remoteDevice){
    var account = [];
    account = await Account.findById(account_id);
    account = account.dataValues;
    if(account.type == 1 || account.type == 5){
        account.items = [];
        //if(item_data.prepare_time === 0){
            account.items.push(item_data);
            SaveHistorySendEntrega(account, remoteDevice);
        /*}
        else{
            var accountItems = await AccountItem.findAll({
                where:{
                    account_id: account_id,
                    prepare_time: {
                        [Op.ne]: 0 
                    }
                }
            });
            
            var items = underscore.reject(accountItems, function(el){
                return (el.status_code != 2);
            });
            if(accountItems.length == items.length){
                account.items = accountItems;
                SaveHistorySendEntrega(account, remoteDevice);
            }
        }*/
    }
};

async function SaveHistorySendEntrega(account_data, remoteDevice){
    var account = underscore.clone(account_data);
    var primary_device = remoteDevice.device_ip +":"+ remoteDevice.device_port;
        var historySend = new HistorySend();
            historySend.account_id = account.id;
            historySend.remote_device = account.remote_device;
            historySend.max_prepare_time = null;
            historySend.screenType = 3;
        var objSaved = await historySend.save();
        var account_send = account;
        
        objSaved = objSaved.dataValues;
        objSaved.items = [];

        account_send.items = underscore.sortBy(account_send.items, 'prepare_time').reverse();

        for(var x = 0; x < account_send.items.length; x++) {
            var historySendItem = new HistorySendItem();
                historySendItem.history_send_id = objSaved.id;
                historySendItem.account_item_id = account_send.items[x].id;
                historySendItem.screenType = 3;
            
            if(x == 0){
                historySendItem.flg_first_item = 1;
                historySendItem.flg_send = 1;
            }
                await historySendItem.save();
                    
            objSaved.items.push(historySendItem);
        }

    sendSocketMessage(primary_device, null, objSaved, 1, 1);

};

// Get account item aditionals
router.get('/:account_id/items/:account_item_id/aditionals', function(req, res, next) {
    AccountItemAditional.findAll({
        where: {
            account_item_id: req.params.account_item_id
        }
    }).then(items => {
      if(items.length > 0) {
          res.json(items);
      }
      else {
          res.status(404);
          res.send('');
      }
  });
});

// Create account
router.post('/teste', async function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        console.log(JSON.stringify(req.body));
        res.status(201);
        res.send('Sucesso!');
    }
    else {
        res.status(406);
        res.send('Nenhuma informação foi encontrada no corpo da requisição');
    }
});

module.exports = router;