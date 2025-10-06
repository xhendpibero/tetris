import React from 'react'

const MobileNextHoldBar: React.FC = () => {
  return (
    <div className="next-hold-bar">
      <div className="mobile-preview-section">
        <div className="panel-title">NEXT</div>
        <div className="piece-preview next">
          <div className="preview-placeholder">
            <div className="placeholder-text">Next</div>
          </div>
        </div>
      </div>
      <div className="mobile-preview-section">
        <div className="panel-title">HOLD</div>
        <div className="piece-preview hold">
          <div className="preview-placeholder">
            <div className="placeholder-text">Hold</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNextHoldBar
