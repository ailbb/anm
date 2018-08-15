module.exports = function () {
    let p = require('./path')();
    let sqlite3 = require(p("sqlite3"));

    let db = new sqlite3.Database(p("/code/resource/sqlite3.db"), function(error) {
        if (error) throw error;
    });

    function run(sql, callback) {
        // console.log(sql);
        db.run(sql,function(error, results){
            if(error) console.error(error);
            if(callback) callback(results); // 获取数据
        });
    }

    /**
     * 查询
     * @param sql
     * @param callback
     * @param isEach
     */
    function query(sql, callback, isEach) {
        if(!isEach)
            db.all(sql, function (error, results){
                if (error) throw error;

                callback(results); // 获取数据
            });
        else
            db.each(sql, function(error, row) {
                if (error) throw error;

                callback(row); // 获取数据
            });
    }

    /**
     * 查询
     * @param sql
     * @param callback
     * @param isEach
     */
    function queryCondition(sql, cond, callback, isEach) {
        let where = " WHERE 1=1 ";

        if(cond) for(let o in cond) {
            let w = cond[o].toString().replace(/s+/g, ""); // 将空格全部去掉
            where += ` AND ${o} = '${w}' `;
        }


        return query(sql + where, callback, isEach);
    }

    return {run, query, queryCondition};
};