function StatusStepper({ currentStatus }){
    const stages = ['applied', 'shortlisted', 'interview', 'offered', 'hired']
    const isRejected = currentStatus === 'rejected'
    const currentIndex = stages.indexOf(currentStatus)

    return(
        <div className="flex items-center gap-1 mt-3">
            {stages.map((stage, i) => (
                <div key={stage} className="flex items-center flex-1">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        isRejected ? 'bg-[#E23F5E]/30' :
                        i <= currentIndex ? 'bg-[#17A673]' : 'bg-[#171B2E]/15'
                    }`} />
                    {i < stages.length - 1 && (
                        <div className={`h-[3px] flex-1 ${
                            isRejected ? 'bg-[#E23F5E]/30' :
                            i < currentIndex ? 'bg-[#17A673]' : 'bg-[#171B2E]/15'
                        }`} />
                    )}
                </div>
            ))}
            <span className="ml-2 text-xs font-mono-tag uppercase tracking-wide"
                style={{color: isRejected ? '#E23F5E' : '#17A673'}}>
                {isRejected ? 'Rejected' : currentStatus}
            </span>
        </div>
    )
}
export default StatusStepper