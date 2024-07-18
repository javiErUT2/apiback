import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: user.id,
            email: user.email
        };
    })
}