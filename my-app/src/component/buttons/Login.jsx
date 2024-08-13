// import React, { useState } from 'react';
// import '../css/login.css';

// const hardcodedUser = {
//   username: 'testuser',
//   password: 'password123'
// };

// const LoginModal = ({ isOpen, onClose }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (username === hardcodedUser.username && password === hardcodedUser.password) {
//       alert('Login successful!');
//       onClose();
//     } else {
//       alert('Invalid username or password');
//     }
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();
//     alert('Registration is not implemented yet.');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>X</button>
//         {isRegistering ? (
//           <div className="modal-body">
//             <h2>Register</h2>
//             <form onSubmit={handleRegister}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 required
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button type="submit">Register</button>
//             </form>
//             <p>
//               Already have an account?{' '}
//               <a href="#" onClick={() => setIsRegistering(false)}>Login here</a>
//             </p>
//           </div>
//         ) : (
//           <div className="modal-body">
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 required
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button type="submit">Login</button>
//             </form>
//             <p>
//               Don't have an account?{' '}
//               <a href="#" onClick={() => setIsRegistering(true)}>Register here</a>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginModal;
