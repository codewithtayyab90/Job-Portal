const Message = require('../models/Message')
const Application = require('../models/Application')
const User = require('../models/User')
const sendEmail = require('../db-configuration/email.js')

const UNLOCKED_STATUSES = ['interview', 'offered', 'hired']
const ONLINE_WINDOW = 2 * 60 * 1000
const EMAIL_COOLDOWN = 10 * 60 * 1000

function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
    })
}

async function getChatContext(applicationId, userId){
    const application = await Application.findById(applicationId).populate('job')
    if(!application){
        return { error: { status: 404, message: 'Application not found' } }
    }
    const candidateId = application.candidate.toString()
    const recruiterId = application.job?.recruiter?.toString()

    if(userId !== candidateId && userId !== recruiterId){
        return { error: { status: 403, message: 'Not allowed' } }
    }
    if(!UNLOCKED_STATUSES.includes(application.status)){
        return { error: { status: 403, message: 'Chat is not unlocked yet' } }
    }
    return { application, candidateId, recruiterId }
}

const getMessages = async(req, res)=>{
    try{
        const { applicationId } = req.params
        const ctx = await getChatContext(applicationId, req.user.id)
        if(ctx.error){
            return res.status(ctx.error.status).json({ message: ctx.error.message })
        }
        const messages = await Message.find({ application: applicationId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name role')
        res.status(200).json({ messages })
    }catch(err){
        console.log("get messages error", err)
        res.status(500).json({ message: err.message })
    }
}

const sendMessage = async(req, res)=>{
    try{
        const { applicationId } = req.params
        const { text } = req.body

        if(!text || !text.trim()){
            return res.status(400).json({ message: 'Message cannot be empty' })
        }

        const ctx = await getChatContext(applicationId, req.user.id)
        if(ctx.error){
            return res.status(ctx.error.status).json({ message: ctx.error.message })
        }

        const previous = await Message.findOne({
            application: applicationId,
            sender: req.user.id
        }).sort({ createdAt: -1 })

        const message = await Message.create({
            application: applicationId,
            sender: req.user.id,
            text
        })

        const recipientId = req.user.id === ctx.candidateId ? ctx.recruiterId : ctx.candidateId
        const recipient = await User.findById(recipientId)
        const sender = await User.findById(req.user.id)

        const recipientOffline = !recipient?.lastActiveAt ||
            Date.now() - recipient.lastActiveAt.getTime() > ONLINE_WINDOW
        const alreadyNotified = previous &&
            Date.now() - previous.createdAt.getTime() < EMAIL_COOLDOWN

        if(recipient && recipientOffline && !alreadyNotified){
            const dashboardPath = recipient.role === 'recruiter' ? '/dashboard' : '/my-applications'
            sendEmail({
                to: recipient.email,
                subject: `New message from ${sender.name} - JobPortal`,
                html: `<p><b>${escapeHtml(sender.name)}</b> sent you a message about <b>${escapeHtml(ctx.application.job.title)}</b>.</p>
                       <p><a href="${process.env.FRONTEND_URL}${dashboardPath}">Open JobPortal to reply</a></p>`
            }).catch(function(err){
                console.log("chat email error", err.message)
            })
        }

        const populated = await message.populate('sender', 'name role')
        res.status(201).json({ message: populated })
    }catch(err){
        console.log("send message error", err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getMessages, sendMessage }