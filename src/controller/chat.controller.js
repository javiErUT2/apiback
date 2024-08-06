import axios from 'axios';
import { pool } from '../database/config.js';

export async function sendMessage(req, res) {

    const { message, idChat } = req.body
    console.log(req.body)
    console.log(message)
   

    try {
        const url = 'https://graph.facebook.com/v20.0/331209570084524/messages';
        const accessToken = 'EAAwzliYKTZBwBOZCZAMd7s2ZCS5zAAOuGYLUjasnHlwcaBrKbCLc1jCI8TvRLNJYiuIMufGxVCzoQBOyLbgFOVYuIZBlYZBlDz9uWLmNUg0aBFqBWrZAHBvHZBxnXa3tJ3iQtGZBReF8WRvgrYZBLIBVYDWQeU2ISkA2IefVDmdyBrggWOj7WDdZBqucXlQTnGsIXNfSZAxjJPFZC1k6SBxl49IjVsZBm7ZAfQZD';
        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: '5219982933230', 
            type: 'text',
            text: {
                preview_url: false,
                body: message 
            }
        };

        const response = await axios.post(url, data, {
            params: {
                access_token: accessToken
            }
        });

        const envio = await pool.query('INSERT INTO message (chat_id, sender, message) VALUES (?, 1, ?)', [idChat, message])
        console.log(envio)

        res.json(response.data);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function getChats(req, res) {

    const userId = req.id
    try {
        const [rows] = await pool.query(
            "SELECT COALESCE(GROUP_CONCAT(n.number_id SEPARATOR ','), '') AS phone_numbers FROM users_numbers n WHERE n.user_id = ?",
            [userId]
          );

        const phoneNumbers = rows[0].phone_numbers ? rows[0].phone_numbers.split(',') : []

        console.log(phoneNumbers)

        const [chats] = await pool.query(`
            SELECT c.*
            FROM chat c
            JOIN number n ON c.our_number = n.idnumber
            WHERE n.idnumber IN (?)
          `, [phoneNumbers]);

        res.json({phoneNumbers, chats})
    } catch(error) {
        console.error(error)
        res.status(500).json({error})
    }
} 

export async function getMessages(req, res) {

    const { id } = req.params

    try {
        const [rows] = await pool.query('SELECT * FROM message WHERE chat_id = (?)', [id])


        console.log(rows)
        res.status(200).json(rows)
    }catch(error) {
        console.error(error)
        res.status(500).json({error})
    }

}