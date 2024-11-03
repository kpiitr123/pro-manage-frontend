import React, { useState } from 'react';
import '../styles/AddPeopleModal.css';

const AddPeopleModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddPerson = (e) => {
    // Simulate adding a person to the board
    console.log("Adding person with email:", email);
    setIsAdded(true);  // Set to true to display the confirmation message
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!isAdded ? (
          <>
            <h2>Add People to the board</h2>
            <form>
              <input
                type="email"
                value={email}
                placeholder="Enter the email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                <button type="button" className="add-button" onClick={handleAddPerson}>Add Email</button>
              </div>
            </form>
          </>
        ) : (
          <div className="confirmation-content">
            <p>{email} added to board</p>
            <button className="confirm-button" onClick={onClose}>Okay, got it!</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPeopleModal;
