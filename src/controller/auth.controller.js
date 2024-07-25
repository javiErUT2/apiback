import bcrypt from 'bcryptjs' 
import { pool } from '../database/config.js'
import { generateToken } from '../helpers/jwt.js';

export const createUser = async (req, res) => {
    try {
        const { body } = req;
        const { fullname, role_id, password, username} = body;

        if (!fullname || !role_id || !password || !username) {
            return res.status(400).json({ error: 'Faltan campos por llenar' });
        }   

        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(password, salt);


        const [rows] = await pool.query('INSERT INTO users SET ?', [body]);

        const token = await generateToken(rows.insertId, fullname, role_id);


        res.status(201).json({
            ok: true,
            message: 'Usuario creado',
            id: rows.insertId,
            token
         });

        

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const userLogin = async (req, res) => {
    const { username, password } = req.body
    console.log(username)
  
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [
        username,
      ])

      const user = rows[0]
  
      console.log(user)
     if(!user) {
        return res.status(400).json({
          ok: false,
          message: 'Usuario o contraseña incorrectos',
        })
}
  
      //Validate password
      const validPassword = bcrypt.compareSync(password, user.password)
  
      if (!validPassword) {
        return res.status(400).json({
          ok: false,
          message: 'User or password incorrect',
        })
      }
  
      const { id, fullname, role_id } = user

      //Generate JWT
      const token = await generateToken(id, fullname, role_id);
  
      res.status(200).json({
        ok: true,
        uid: id,
        name: fullname,
        rol: role_id,
        token,
      })
    } catch (error) {
      console.log(error)
  
      return res.status(500).json({
        ok: false,
        message: 'Error logging in',
      })
    }
  }

  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params
      const { body } = req
  
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'No id provided',
        })
      }
  
      //Encrypt password
      if (body.userPassword !== undefined) {
        const salt = bcrypt.genSaltSync()
        body.userPassword = bcrypt.hashSync(body.userPassword, salt)
      }
  
      await pool.query('UPDATE users SET ? WHERE id = ?', [body, id])
  
      res.status(201).json({
        ok: true,
        message: 'User updated',
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        ok: false,
        message: 'Error updating user',
      })
    }
  }

  export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params
  
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'No id provided',
        })
      }
  
      await pool.query('DELETE FROM users WHERE user = ?', [id])
  
      res.status(201).json({
        ok: true,
        message: 'User deleted',
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        ok: false,
        message: 'Error deleting user',
      })
    }
  }

