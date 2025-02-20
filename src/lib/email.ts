// src/lib/email.ts

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


export async function sendContactEmail(
    name: string,
    email: string,
    message: string
) {
    try {
        await transporter.sendMail({
            from: email,
            to: process.env.NODEMAILER_USER,
            subject: `Nouveau message de contact de ${name}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>${message}</p>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { success: false, error: 'Erreur lors de l\'envoi du message' };
    }
}


export async function moderatorRequestEmail(
    name: string,
    email: string,
    id: string,
) {
    try {
        await transporter.sendMail({
            from: email,
            to: process.env.NODEMAILER_USER,
            subject: `Demande modérateur de ${name}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>l'utilisateur ${name} avec l'id : ${id}, à fait une demande pour passer modérateur</p>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { success: false, error: 'Erreur lors de l\'envoi du message' };
    }
}


export async function sendModeratorRejectionEmail(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre demande de modérateur a été refusée',
        html: `<p>Bonjour,</p>
               <p>Après examen de votre demande, nous avons décidé de ne pas vous accorder le statut de modérateur.</p>
               <p>Si vous pensez qu'il y a une erreur ou souhaitez en discuter, vous pouvez nous contacter via <a href="http://localhost:5173/contact">notre formulaire de contact</a>.</p>
               <p>Merci de votre compréhension.</p>`
    });
}

export async function sendModeratorApprovalEmail(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre demande de modérateur a été approuvée',
        html: `<p>Bonjour,</p>
               <p>Nous avons le plaisir de vous informer que votre demande pour devenir modérateur a été approuvée !</p>
               <p>Vous avez maintenant accès aux fonctionnalités de modération sur notre plateforme.</p>
               <p>Merci de votre engagement dans notre communauté.</p>
               <p>L'équipe des Petits Cadrans</p>`
    });
}


export async function submitArticle(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre article a bien été soumis',
        html: `<p>Bonjour,</p>
               <p>Votre article a bien été soumis, il est maintenant en modération et vous serez avertit de l'évolution de son statut</p>
               `
    });
}

export async function submitUpdatedArticle(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre article a bien été mis à jour',
        html: `<p>Bonjour,</p>
               <p>Votre article a bien été mis à jour, nous vérifions juste que tout soit ok avant de le remettre en ligne :) </p>
               `
    });
}

export async function deletedArticle(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre article a bien été supprimé',
        html: `<p>Bonjour,</p>
               <p>Votre article a bien été supprimé, n'hésitez pas à en proposer un autre, à bientôt. </p>
               `
    });
}



export async function sendArticlePublishedEmail(email: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre article a été publié !',
        html: `<p>Bonjour,</p>
               <p>Nous avons le plaisir de vous informer que votre article a été validé et est maintenant publié sur le site !</p>
               <p>Merci de votre contribution aux Petits Cadrans.</p>`
    });
}

export async function sendArticleRefusedEmail(email: string, reason: string) {
    await transporter.sendMail({
        from: '"Les Petits Cadrans" <no-reply@lespetitscadrans.com>',
        to: email,
        subject: 'Votre article a été refusé',
        html: `<p>Bonjour,</p>
               <p>Votre article a été refusé pour la raison suivante :</p>
               <blockquote style="border-left: 4px solid red; padding-left: 10px;">${reason}</blockquote>
               <p>Nous vous invitons à le modifier et à le soumettre à nouveau si possible.</p>
               <p>Merci de votre compréhension.</p>`
    });
}



