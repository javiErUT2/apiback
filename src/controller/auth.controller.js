import bcrypt from 'bcryptjs'
import { pool } from '../database/config.js'
import { generateToken } from '../helpers/jwt.js';

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos por llenar' });
        }   

        res.status(201).json({ message: 'Usuario creado' });
        

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Faltan campos por llenar' });
        }

        res.status(200).json({ message: 'Usuario logueado' });
    } catch(error) {
        console.error('Error al loguear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    
}

export const userLogin = async (req, res) => {
    const { userName, userPassword } = req.body
  
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE userName = ?', [
        userName,
      ])
  
      const user = rows[0]
  
      if (user.userName === undefined) {
        return res.status(400).json({
          ok: false,
          message: 'User or password incorrect',
        })
      }
  
      //Validate password
      const validPassword = bcrypt.compareSync(userPassword, user.userPassword)
  
      if (!validPassword) {
        return res.status(400).json({
          ok: false,
          message: 'User or password incorrect',
        })
      }
  
      //Generate JWT
      const token = await generateToken(user.idUser, user.userName, user.idRol)
  
      res.status(200).json({
        ok: true,
        uid: user.id,
        name: user.fullName,
        rol: user.idRol,
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
  
      await pool.query('UPDATE users SET ? WHERE idUser = ?', [body, id])
  
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
  
      await pool.query('DELETE FROM users WHERE idUser = ?', [id])
  
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

