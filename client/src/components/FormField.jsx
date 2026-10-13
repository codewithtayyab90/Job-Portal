export function inputClass(hasError){
    return `bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition ${
        hasError ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
    }`
}

function FormField({label, error, children, className = "mb-5"}){
    return(
        <div className={className}>
            <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{error}</p>
            )}
        </div>
    )
}
export default FormField