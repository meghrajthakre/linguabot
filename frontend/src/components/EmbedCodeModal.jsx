import React from 'react'

const EmbedCodeModal = ({ open = false, onClose = () => { } }) => {
    if (!open) return null

    const code = `<script src=\"https://cdn.example.com/widget.min.js\"></script>`

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded max-w-lg w-full">
                <h4 className="font-semibold mb-2">Embed Code</h4>
                <pre className="p-3 bg-slate-100 rounded text-sm overflow-auto">{code}</pre>
                <div className="mt-3 flex justify-end">
                    <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">Close</button>
                </div>
            </div>
        </div>
    )
}

export default EmbedCodeModal
