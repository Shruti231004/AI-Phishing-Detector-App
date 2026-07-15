import React from 'react';

const ALL_TEMPLATES = [
  {
    name: '⚠️ Scholarship Scam',
    type: 'danger',
    sender: 'scholarships-b0ard@gmail-verify-support.com',
    body: 'Dear Student, congratulations! You have won a merit scholarship of ₹25,000 from the Official Scholarship Portal. Pay a processing fee of ₹500 today to confirm your scholarship eligibility or it will be cancelled. Click this link immediately to verify your bank account and OTP: scholarship-verify.info/claim',
  },
  {
    name: '⚠️ Tuition Fee Scam',
    type: 'danger',
    sender: 'accounts-vcet@gmail.com',
    body: 'URGENT NOTICE: Your college fee payment is overdue. Your registration will be suspended and you will not be allowed to attend lectures if you do not pay ₹15,000 immediately via GPay/PhonePe to the account upi@vcet-finance. Click here to confirm payment: bit.ly/vcet-fee-pay.',
  },
  {
    name: '⚠️ Placement Scam',
    type: 'danger',
    sender: 'placements.cell@gmail.com',
    body: 'Dear Student, your placement registration is pending. Please confirm your details within 24 hours by visiting bit.ly/placement2026 to avoid cancellation. Note: A refundable training security deposit of ₹499 is required to secure your interviewer slot.',
  },
  {
    name: '⚠️ Lucky Winnings Scam',
    type: 'danger',
    sender: 'tcs-techday-winnings@gmail-awards-verification.com',
    body: 'ALERT: You won a free iPad in the Tech Day Quiz! Claim your prize now by verifying your mobile number and entering the OTP sent to you. Click this link to confirm: tinyurl.com/techday-winnings. Hurry, valid for 1 hour only!',
  },
  {
    name: '✓ Official College Notice',
    type: 'safe',
    sender: 'accounts@vcet.edu.in',
    body: 'Dear Student, this is a reminder that the semester fees for Academic Year 2026-27 should be deposited through the college payment gateway. Please log into the ERP portal using your credentials. Do not share your OTPs or bank details with anyone. Accounts Department.',
  },
];

function ScannerInput({ email, setEmail, message, setMessage, onScan, isScanning }) {
  return (
    <div className="card">
      <h2 className="card-title">🔍 Message Verification Input</h2>

      <label className="field-label">Sender Address (Optional)</label>
      <input
        className="form-input"
        type="text"
        placeholder="e.g. sender@organization.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="field-label">Paste Suspicious Message</label>
      <textarea
        className="form-input form-textarea"
        placeholder="Paste the full email or message body here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="templates-box">
        <span className="templates-title">Load Sample Template</span>
        <div className="templates-flex">
          {ALL_TEMPLATES.map((tpl, index) => (
            <button
              key={index}
              className={`template-pill${tpl.type === 'danger' ? ' danger-pill' : ''}`}
              onClick={() => {
                setEmail(tpl.sender);
                setMessage(tpl.body);
              }}
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      <button className="scan-btn" onClick={onScan} disabled={isScanning}>
        ⚡ Activate Verification Agent
      </button>
    </div>
  );
}

export default ScannerInput;
