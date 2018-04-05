const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID; // 用來建構MongoDBID物件

var url = 'mongodb://140.112.28.194';
var dbName = 'CSX2003_01_HW2';
var mySheet = 'ntnu_40371231h';

// 設定預設port為 1377，若系統環境有設定port值，則以系統環境為主
app.set('port', (process.env.PORT || 1377));

// 設定靜態資料夾
app.use(express.static('public'));

var response = {
    result: true,
    data: [{
        id: 0,
        name: "小米路由器",
        price: 399,
        count: 1,
        image: 'http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490332273.78529474.png?width=160&height=160'
    },
    {
        id: 1,
        name: "米家全景相機",
        price: 7995,
        count: 1,
        image: 'http://i01.appmifile.com/f/i/g/2016overseas/mijiaquanjingxiangji800.png?width=160&height=160'
    }]
};
// for (let i = 0; i < response.data.length; i++) {
//     console.log(response.data[i]);
// }

// 初始化資料
MongoClient.connect(url, function (err, client) {
    if (err) {
        response.result = false;
        response.message = "資料庫連接失敗，" + err.message;
        res.json(response);
        return;
    }
    const db = client.db(dbName);
    db.collection('ntnu_40371231h', (error, collection) => {
        if (error) {
            console.log('資料庫內無名為 ntnu_40371231h 的 collection');
            db.createCollection('ntnu_40371231h');
        } else {
            console.log('資料庫中有名為 ntnu_40371231h 的 collection，等待連線中');
        }
        collection.drop();
        collection.insert(response.data, (error, result) => {
            if (error) {
                console.log('資料插入失敗');
                return;
            }
            console.log('插入 ' + result.insertedCount + ' 筆資料');
        });
        // collection.find().toArray((error, docs) => {
        //     if (error) {
        //         console.log('查詢 student 資料失敗');
        //         return;
        //     }
        //     for (let i = 0; i < docs.length; i++) {
        //         console.log(docs[i]);
        //     }
        // });
        // 確定動作完畢才可將 client 關閉
        client.close();
        console.log('資料庫中斷連線');
    });
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// query 功能
app.get('/query', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");




    MongoClient.connect(url, (error, client) => {
        if (error) {
            console.log('資料庫連接失敗');
        } else {
            console.log('資料庫連接成功');
            const db = client.db(dbName);
            db.collection('ntnu_40371231h', (error, collection) => {
                collection.find().toArray((error, docs) => {
                    if (error) {
                        console.log('查詢 ntnu_40371231h 資料失敗');
                        return;
                    }
                    for (let i = 0; i < docs.length; i++) {
                        // console.log(docs[i]);
                    }
                });
            });

        }
    })


    // TODO 作業二 - 查詢資料       
    // 請將查詢mongodb的程式碼寫在這裡，並改寫下方response，使得查詢結果能送至前端
    MongoClient.connect(url, function (err, client) {
        if (err) {
            response.result = false;
            response.message = "資料庫連接失敗，" + err.message;
            res.json(response);
            return;
        }

        //console.log("資料庫連接成功")

        res.json(response);
    })


})

//insert功能
app.post('/insert', function (req, res) {
    var data = {
        name: req.body.name,
        price: req.body.price,
        count: req.body.count,
        image: req.body.image
    };

    // TODO 作業二 - 新增資料
    // 請將新增資料的程式碼寫在，使得將client送過來的 data 能寫入至 mongodb 中

    var response = {
        result: true,
        data: data
    };
    res.json(response);
})

//update功能
app.post('/update', function (req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name,
        price: req.body.price,
    };


    var response = {
        result: true,
        data: data
    };



    MongoClient.connect(url, function (err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }

        // TODO 作業二 - 更新資料
        // 將mongoDB資料中對應的 data.id 找出來，並更新其 name 和 price 資料
        // https://docs.mongodb.com/manual/tutorial/update-documents/

        var filter = {
            _id: objectID(data._id)
        };

        var update = {
            name: data.name,
            price: data.price
        };
    })
})

// delete功能
app.post('/delete', function (req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name
    };
    var response = {
        result: true,
        data: data
    };

    MongoClient.connect(url, function (err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }
        // TODO 作業二 - 刪除資料
        // 將ID 的資料 從mongodb中刪除
        // https://docs.mongodb.com/manual/tutorial/remove-documents/

        // 查詢要刪除的ID
        var filter = {
            _id: objectID(data._id)
        };

    })

})

// 啟動且等待連接
app.listen(app.get('port'), function () {
    console.log('Server running at http://127.0.0.1:' + app.get('port'))
})