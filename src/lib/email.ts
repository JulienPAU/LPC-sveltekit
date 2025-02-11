import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

export async function sendResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:5173/auth/reset-password?token=${token}`;
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<p>Bonjour,</p>
		       <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
		       <a href="${resetLink}">${resetLink}</a>
		       <p>Ce lien expirera dans 1 heure.</p>`
    });
}
