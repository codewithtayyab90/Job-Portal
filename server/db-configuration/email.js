async function sendEmail({ to, subject, html }){
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { email: process.env.EMAIL_FROM },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html
        })
    })

    if(!response.ok){
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send email')
    }

    return response.json()
}

module.exports = sendEmail