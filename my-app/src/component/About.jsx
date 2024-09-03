import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../css/about.css';


const About = () => {
  const [isModalOpen, setModalOpen] = useState(false);


  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
 
  return (
    <div className="about-page">
      <main className="about-content">
        <section className="about-section">
          <h1>About Demmacs Watches</h1>
          <p>At Demmacs Watches, we blend timeless elegance with modern technology to offer you premium timepieces. Our collection is designed to suit various tastes and preferences, from classic styles to innovative designs.</p>
          <p>We are committed to excellence in both craftsmanship and customer service, ensuring that every watch you purchase from us is not just a product, but a part of your story.</p>
        </section>
        <section className="services-section">
          <h2>Customize Your Watch</h2>
          <p>Want something uniquely yours? We offer customization options that let you design your watch to match your style. Choose from various straps, dials, and features to create a timepiece that’s truly one-of-a-kind.</p>
          <p>Start your customization journey today and make a statement with a watch that reflects your individuality.</p>
          <Link to="/about" className="cta-button">Customize Your Watch</Link>
        </section>
        <section className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img src="/assets/default.jpg" alt="John Doe" />
              <h3>Christian</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <img src="/assets/default.jpg" alt="Jane Smith" />
              <h3>Skov</h3>
              <p>Creative Director</p>
            </div>
            <div className="team-member">
              <img src="/assets/default.jpg" alt="Emily Johnson" />
              <h3>Skarvil</h3>
              <p>Marketing Specialist</p>
            </div>
          </div>
        </section>
      </main>
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />

    </div>
  );
};

export default About;
