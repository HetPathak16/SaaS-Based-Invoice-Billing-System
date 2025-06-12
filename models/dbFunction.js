const db = require('./db');
const jwt =require('jsonwebtoken')
require('dotenv').config();

const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.insertData = (table, data) => {
 // Remove keys where value is null or undefined
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
  );
  const fields = Object.keys(filteredData).join(', ');
  const values = Object.values(filteredData);
  const placeholders = values.map(() => '?').join(', ');
  const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
  return runQuery(query, values);
};

exports.selectData = (table, conditions = {}) => {
    let query = `SELECT * FROM ${table}`;
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    if (keys.length) {
        const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
        query += ` WHERE ${whereClause}`;
    }
    return runQuery(query, values);
};

exports.updateData = (table, data, conditions) => {
    if (!data || !conditions) {
    throw new Error('Both data and conditions must be provided');
    }
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const conditionClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
    const conditionValues = Object.values(conditions);
    const query = `UPDATE ${table} SET ${fields} WHERE ${conditionClause}`;
    console.log(query)
    return runQuery(query, [...values, ...conditionValues]);
};

exports.deleteData = (table, conditions) => {
    const conditionClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
    const conditionValues = Object.values(conditions);
    const query = `DELETE FROM ${table} WHERE ${conditionClause}`;
    return runQuery(query, conditionValues);
};

exports.generateToken = (id,role) =>{
    const secretKey = process.env.JWT_SECRET; 
    return jwt.sign({ id, role}, secretKey, { expiresIn: '8h' });
}