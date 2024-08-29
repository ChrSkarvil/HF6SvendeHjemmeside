// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import "../css/watches.css";
// import LoginModal from './LoginModal';

// // Sample watch data
// const watches = [
//   { id: 1, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch1.jpg', owner: { username: 'Owner1', profilePic: './assets/skele.jpg' } },
//   { id: 2, name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', image: './assets/watch2.jpg', owner: { username: 'Owner2', profilePic: './assets/skele.jpg' } },
//   { id: 3, name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', image: './assets/watch3.jpg', owner: { username: 'Owner3', profilePic: './assets/skele.jpg' } },
//   { id: 4, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch4.jpg', owner: { username: 'Owner4', profilePic: './assets/skele.jpg' } },
//   { id: 5, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch3.jpg', owner: { username: 'Owner5', profilePic: './assets/skele.jpg' } },
//   { id: 6, name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', image: './assets/watch2.jpg', owner: { username: 'Owner6', profilePic: './assets/skele.jpg' } },
//   { id: 7, name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', image: './assets/watch3.jpg', owner: { username: 'Owner7', profilePic: './assets/skele.jpg' } },
//   { id: 8, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch4.jpg', owner: { username: 'Owner8', profilePic: './assets/skele.jpg' } },
// ];

// const Watches = () => {
//   const [isModalOpen, setModalOpen] = useState(false);

//   const toggleModal = () => {
//     setModalOpen(!isModalOpen);
//   };

//   return (
//     <div className="watches-page">
//       <div className="watches-content">
//         <div className="watches-gallery">
//           {watches.map(watch => (
//             <Link to={`/product/${watch.id}`} key={watch.id} className="watch-card">
//               <div className="watch-owner">
//                 <img src={watch.owner.profilePic} alt={watch.owner.username} className="owner-pic" />
//                 <p className="owner-username">{watch.owner.username}</p>
//               </div>
//               <img src={watch.image} alt={watch.name} />
//               <div className="watch-info">
//                 <div className="watch-name">Name: {watch.name}</div>
//                 <div className="watch-price">Price: {watch.price}</div>
//                 <div className="watch-description">Description: {watch.description}</div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//       {isModalOpen && <LoginModal isOpen={isModalOpen} onClose={toggleModal} />}
//     </div>
//   );
// };

// export default Watches;
