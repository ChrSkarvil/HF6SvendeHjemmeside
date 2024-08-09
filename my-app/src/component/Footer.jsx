import React from "react";
import "../css/footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-light">
      <div className="container">
        <div className="col-md-9">
          <h4>Contact Us</h4>
          <p>Email: Demmacs@gmail.com</p>
          <p>Phone: (+45) 12-34-56-78</p>
          <p>Address: Munkebjergvej 360 no scope</p>
        </div>
        <div className="col-md-3">
          <h4>Follow Us</h4>
          <p>Stay connected on social media:</p>
          <div className="social-icons">
            <a href="#" className="icon-link">
                <img src="./assets/fb.png" alt="Facebook" />
            </a>
            <a href="#" className="icon-link">
                <img src="./assets/tw.png" alt="Twitter" />
            </a>
            <a href="#" className="icon-link">
                <img src="./assets/insta.png" alt="Instagram" />
            </a>
            </div>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Demmacs - Almin and Christian</p>
        </div>
      </div>
    </footer>
  );
}
