import React from 'react'

const BotCard = ({ title = 'Untitled', description = '' }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="mt-3 flex gap-2">
        <a href="#/bot" className="text-sm text-blue-600">Open</a>
        <a href="#/analytics" className="text-sm text-slate-600">Analytics</a>
      </div>
    </div>
  )
}

export default BotCard
