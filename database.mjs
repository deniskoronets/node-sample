import mysql from "mysql";

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

connection.connect();

export default {
    connection,

    select(query, placeholders) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, placeholders, function (error, results) {
                if (error) {
                    throw error;
                }

                resolve(results);
            });
        });
    },

    selectFirst(query, placeholders) {
        return this.select(query, placeholders).then(results => {
            return results[0] ? results[0] : null;
        });
    },
};
