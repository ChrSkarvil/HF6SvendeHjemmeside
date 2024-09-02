import React, { useState } from 'react';
import LoginModal from './LoginModal';
import Register from './Register';

const AuthManager = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div>
      <button onClick={openLogin}>Login</button>
      <button onClick={openRegister}>Register</button>
      <LoginModal isOpen={isLoginOpen} onClose={closeModals} />
      <Register isOpen={isRegisterOpen} onClose={closeModals} />
    </div>
  );
};

export default AuthManager;
