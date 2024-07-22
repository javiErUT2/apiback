import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: user.id,
            email: user.email
        };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '28d'
        }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    })
}