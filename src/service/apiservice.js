const https = require("https");


function EnviarMensajeWhatsapp(texto,number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": "52992317865",
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "Hola"
        }
    });
    const options = {
        host : "graph.facebook.com",
        path : "/v20.0/331209570084524/messages",
        method : "POST",
        body : data,
        headers :  {
            "Content-Type" : "application/json",
            Authorization : "Bearer EAAwzliYKTZBwBO71zaEqfRk0RcwoZBZBMeRKte0U7vJHr1bEhUpoPZCKE9E6LpJ8nrfy8FnthYe8MrYUKHWUoATG4O3AFxpI4LhPN5zw35ZB2QscG6mqdpyfi7yWtKS5y8ZCF3DbzPH9CFBGjRO8tnHuw5CKoGlKUO0KHOylvnV9HdPuQ0XC6LOZBQH3XhKJggr79miP1CJmC50gFN8KwimA41ZAZBUAZD"

        }
    
    };
    const req = https.request(options,res => {
        res.on("data",d=>{
            process.stdout.write(d);
        });
    });
    req.write(data);
    req.end();
}

module.exports = {
    EnviarMensajeWhatsapp
}