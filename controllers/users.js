const {request, response} = require('express');
const usersModel = require('../models/users');
const pool = require('../db');

const listUsers = async (req = request, res = response) =>{
    let conn;

    try{
        conn = await pool.getConnection();

        const users = await conn.query(usersModel.getALL, (err) =>{
            if(err){
                throw err;
            }
        })
        res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn){
            conn.end();
        }
    }
    
}

const listUserByID = async (req = request, res = response) =>{
    const {id} = req.params;
    let conn;

    if(isNaN(id)){
        res.status(400).json({msg: `The ID ${id} is invalid`});
        return
    }

    try{
        conn = await pool.getConnection();

        const [users] = await conn.query(usersModel.getByID, [id],(err) =>{
            if(err){
                throw err;
            }
        })
        if(!users){
            res.status(404).json({msg: `User with ID ${id} not found`});
            return
        }
        res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn){
            conn.end();
        }
    }
    
}

const addUser = async (req = request, res = response) => {
    const {
        username,
        password,
        email,
        name,
        lastname,
        phonenumber = '',
        role_id,
        is_active = 1
    }= req.body;

    if(!username || !password || !email || !name || !lastname || !phonenumber || !role_id){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const user = [username, password, email, name, lastname, phonenumber, role_id, is_active]

    let conn;

    try{
        conn = await pool.getConnection();

        const [usernameExist] = await conn.query(usersModel.getByUsername, [username], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `Username ${username} already exists`});
            return;
        }

        const [emailExists] = await conn.query(usersModel.getByEmail, [email], (err) => {
            if(err) throw err;
        })
        if (emailExists){
            res.status(409).json({msg: `Email ${email} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow, [...user], (err) =>{
            if(err) throw err;
        })
        if(userAdded.affectedRows === 0){
            throw new Error('User not added');
        }
        res.json({msg: 'User added succesfully'});

     }catch(error){
        console.log(error);
        res.status(500).json(error);
     }finally{
        if(conn) conn.end();
     }
}

module.exports = {listUsers, listUserByID, addUser}


// routes   -     controllers   - models(BD)