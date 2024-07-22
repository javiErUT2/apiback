export const verificar = (req, res) => {
    try {
        var tokenandercode = "TOKENMETA";
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];

        if (challenge != null && token != null && token == tokenandercode) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }
    } catch (e) {
        console.error('Error en la verificación:', e);
        res.status(400).send();
    }
};

export const recibir = (req, res) => {
    try {
        var entry = req.body["entry"] ? req.body["entry"][0] : undefined;
        var changes = entry ? entry["changes"][0] : undefined;
        var value = changes ? changes["value"] : undefined;
        var metadata = value ? value["metadata"] : undefined;
        var contacts = value ? value["contacts"] : undefined;
        var messages = value ? value["messages"] : undefined;

        if (messages === undefined) return;

        if (metadata && messages && contacts) {
            const { display_phone_number, phone_number_id } = metadata;

           
            const formattedMessages = messages.map(message => {
                if (message.text) {
                    return {
                        ...message,
                        text: message.text.body
                    };
                }
                return message;
            });

            const { name } = contacts[0].profile;

            console.log({ display_phone_number, phone_number_id, messages: formattedMessages, name });
            res.json({ display_phone_number, phone_number_id, messages: formattedMessages, name });
        } else {
            throw new Error("value, messages, or contacts is undefined");
        }
    } catch (e) {
        console.error('Error al procesar el mensaje:', e);
        res.send("EVENT_RECEIVED");
    }
};