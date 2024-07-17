import axios from 'axios';

export async function sendMessage(req, res) {
    try {
        const url = 'https://graph.facebook.com/v20.0/331209570084524/messages';
        const accessToken = 'TOKENMETA';
        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: '5219982317865', 
            type: 'text',
            text: {
                preview_url: false,
                body: 'PRUEBA'
            }
        };

        const response = await axios.post(url, data, {
            params: {
                access_token: accessToken
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}