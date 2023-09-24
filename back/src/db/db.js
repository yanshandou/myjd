/**
 * @description mongoose 连接数据库, 并导出mongoose对象, 供其他模块使用, 以便操作数据库, 该模块只需要连接一次, 所以使用单例模式, 保证只连接一次数据库, 以提高性能
 * @version 1.0.0
 * @author XuJunhao
*/
const mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1:27017"; //本地默认的mongodb服务地址
// const dbName = "jd"; //数据库名称
//配置(高版本的mongoose需要删除这两句配置)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useFindAndModify', false)
//开始连接, 连接成功后会触发mongoose.connection的open事件
mongoose.connect(`mongodb://jd:KTxTLBkYht5AfeiN@43.153.31.148:27017/jd?authMechanism=DEFAULT&authSource=jd`, {
	useNewUrlParser: true, //使用新的url解析器，用于解决一些安全性问题
	useUnifiedTopology: true, //使用统一的拓扑结构
});
//连接对象, 用于监听连接成功或者失败
const db = mongoose.connection;
// 连接失败
db.on("error", (err) => {
	console.error("mongoose connect error", err);
});
// db.once 监听一次open事件, 用于监听连接成功, 一旦连接成功, 就不会再监听, 所以用once, 而不是on, on会一直监听
db.once('open', () => {
    console.log('mongoose连接成功')
})

//导出mongoose对象
module.exports = mongoose;
