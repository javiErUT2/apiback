import bcrypt from 'bcryptjs' 
import { pool } from '../database/config.js'
import { generateToken } from '../helpers/jwt.js';

export const createUser = async (req, res) => {
  try {
    const { body } = req;
    const { phone_numbers, ...userDetails } = body;

    if (!userDetails.username || !userDetails.fullname || !userDetails.role_id || !userDetails.password) {
      return res.status(400).json({
        ok: false,
        message: 'Missing required fields',
      });
    }

    // Encrypt password
    if (userDetails.password) {
      const salt = bcrypt.genSaltSync();
      userDetails.password = bcrypt.hashSync(userDetails.password, salt);
    }

    // Insert user into database
    const [result] = await pool.query('INSERT INTO users SET ?', [userDetails]);
    const userId = result.insertId;

    // Insert phone numbers into database
    if (phone_numbers && Array.isArray(phone_numbers)) {
      const phoneNumberQueries = phone_numbers.map(number => 
        pool.query('INSERT INTO users_numbers (user_id, number_id) VALUES (?, ?)', [userId, number])
      );
      await Promise.all(phoneNumberQueries);
    }

    res.status(201).json({
      ok: true,
      message: 'User created successfully',
      userId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error creating user',
    });
  }
};


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
      const { id } = req.params;
      const { body } = req;
  
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'No id provided',
        });
      }
  
      // Encrypt password
      if (body.userPassword !== undefined) {
        const salt = bcrypt.genSaltSync();
        body.userPassword = bcrypt.hashSync(body.userPassword, salt);
      }
  
      // Extract phone numbers from body
      const phoneNumbers = body.phone_numbers || [];
      delete body.phone_numbers; // Remove phone numbers from body to update only user data
  
      // Start a transaction
      await pool.query('START TRANSACTION');
  
      // Update user information only if there are fields to update
      if (Object.keys(body).length > 0) {
        await pool.query('UPDATE users SET ? WHERE id = ?', [body, id]);
      }
  
      // Get current phone numbers from the database
      const [currentNumbers] = await pool.query('SELECT number_id FROM users_numbers WHERE user_id = ?', [id]);
      const currentPhoneNumbers = currentNumbers.map(row => row.number_id);
  
      // Find numbers to delete and to add
      const numbersToDelete = currentPhoneNumbers.filter(number => !phoneNumbers.includes(number));
      const numbersToAdd = phoneNumbers.filter(number => !currentPhoneNumbers.includes(number));
  
      // Delete phone numbers that are no longer in the body
      if (numbersToDelete.length > 0) {
        await pool.query('DELETE FROM users_numbers WHERE user_id = ? AND number_id IN (?)', [id, numbersToDelete]);
      }
  
      // Add new phone numbers
      if (numbersToAdd.length > 0) {
        const values = numbersToAdd.map(number => [id, number]);
        await pool.query('INSERT INTO users_numbers (user_id, number_id) VALUES ?', [values]);
      }
  
      // Commit the transaction
      await pool.query('COMMIT');
  
      res.status(201).json({
        ok: true,
        message: 'User updated',
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      await pool.query('ROLLBACK');
      console.log(error);
      return res.status(500).json({
        ok: false,
        message: 'Error updating user',
      });
    }
  };

  export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params
  
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'No id provided',
        })
      }
  
      await pool.query('DELETE FROM users WHERE id = ?', [id])
  
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

  export const getUsers = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT u.*, COALESCE(GROUP_CONCAT(n.number_id), '') AS phone_numbers FROM users u LEFT JOIN users_numbers n ON u.id = n.user_id GROUP BY u.id;")
      console.log(rows)
      

      const users = rows.map((user) => {
        return {
          ...user,
          phone_numbers: user.phone_numbers ? user.phone_numbers.split(',') : [],
        }
      })
      const numbers = await pool.query('SELECT * FROM number')

      res.status(200).json({
        ok: true,
        users,
        numbers : numbers[0]
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        ok: false,
        message: 'Error getting users',
      })
    }
  }

  export const createNumber = async (req, res) => {
    try {
      const { number } = req.body
  
      if (!number) {
        return res.status(400).json({
          ok: false,
          message: 'Missing required fields',
        })
      }
  
      await pool.query('INSERT INTO number (number) VALUES (?)', [number])
  
      res.status(201).json({
        ok: true,
        message: 'Number created',
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        ok: false,
        message: 'Error creating number',
      })
    }
  }

  export const logged = async (req, res) => {
    res.status(200).json({ ok: true, message: 'User logged' })
  }

