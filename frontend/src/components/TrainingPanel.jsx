import React from 'react'

const TrainingPanel = () => {
    return (
        <div className="p-4 bg-white rounded shadow-sm">
            <h4 className="font-medium mb-2">Training Panel</h4>
            <p className="text-sm text-slate-600 mb-3">Upload FAQs or documents to teach your bot.</p>
            <label className="block mb-2">
                <input type="file" className="block" />
            </label>
            <button className="px-3 py-2 bg-blue-600 text-white rounded">Upload</button>
        </div>
    )
}

export default TrainingPanel
