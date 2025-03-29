import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/models/index.js'; // Ensure the file extension is included in ES modules
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload; // Returns user details
    } catch (error) {
        throw new Error('Invalid Google token');
    }
}

export async function googleLogin(req, res) {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "Token is required" });

        const googleUser = await verifyGoogleToken(token);
        if (!googleUser) return res.status(401).json({ message: "Google authentication failed" });

        let user = await db.user.findOne({ where: { email: googleUser.email } });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await db.user.create({
                firstName: googleUser.given_name,
                lastName:googleUser.family_name,
                email: googleUser.email,
                hashedPassword:"passw",
                provider: "google",
            });
        }

        // Generate JWT token for authentication
        const authToken = jwt.sign(
            { id: user.id, email: user.email, role:"other" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token: authToken, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
