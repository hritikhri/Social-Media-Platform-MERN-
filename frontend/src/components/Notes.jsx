import React from 'react'

export const Notes = (notes) => {
  
  return (
    <div className="notes">
        <div className="notes-up">{notes}</div>
        <div className="notes-bottom"></div>
    </div>
  )
}
