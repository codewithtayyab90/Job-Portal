import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import BASE_URL from '../config/api.js'

function Chat({ applicationId }){
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    useEffect(()=>{
        async function loadMessages(){
            try{
                const res = await axios.get(`${BASE_URL}/api/messages/${applicationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setMessages(res.data.messages)
            }catch(err){
                toast.error(err.response?.data?.message || "Could not load messages")
            }
        }
        loadMessages()
    }, [applicationId, refreshKey, token])

    async function sendHandler(e){
        e.preventDefault()
        if(!text.trim()) return
        setSending(true)
        try{
            const res = await axios.post(`${BASE_URL}/api/messages/${applicationId}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMessages([...messages, res.data.message])
            setText('')
        }catch(err){
            toast.error(err.response?.data?.message || "Could not send message")
        }finally{
            setSending(false)
        }
    }

    return(
        <div className="mt-4 border-t-2 border-[#171B2E]/10 pt-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-[#171B2E]">Chat</h4>
                <button
                    type="button"
                    onClick={() => setRefreshKey(refreshKey + 1)}
                    className="text-xs font-semibold text-[#2F3EE0] hover:underline"
                >
                    Refresh
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 bg-[#FBF6EC] rounded-xl p-3">
                {messages.length === 0 && (
                    <p className="text-sm text-[#171B2E]/50">No messages yet. Say hello!</p>
                )}
                {messages.map((m) => {
                    const mine = m.sender?._id === user?._id
                    return(
                        <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                mine
                                    ? 'bg-[#FF5A3C] text-white'
                                    : 'bg-white border-2 border-[#171B2E]/10 text-[#171B2E]'
                            }`}>
                                {!mine && (
                                    <p className="text-xs font-bold mb-0.5 text-[#171B2E]/60">{m.sender?.name}</p>
                                )}
                                <p className="break-words">{m.text}</p>
                                <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-[#171B2E]/40'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <form onSubmit={sendHandler} className="flex gap-2 mt-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg p-2.5 outline-none focus:border-[#FF5A3C]"
                />
                <button
                    type="submit"
                    disabled={sending}
                    className="shrink-0 bg-[#FF5A3C] hover:bg-[#e64d2e] disabled:opacity-60 text-white px-5 rounded-lg font-bold transition"
                >
                    {sending ? '...' : 'Send'}
                </button>
            </form>
        </div>
    )
}
export default Chat