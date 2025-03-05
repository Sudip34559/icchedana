import React from "react";
import "./Support.css";

const SupportPage = () => {
  return (
    <div className="support-container">
      <h1>Support Page</h1>

      <p>
        We are here to assist you with any queries or concerns you may have.
        Please feel free to reach out to us through the following contact
        options:
      </p>

      <div className="contact-info">
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:bimalaproduction58@gmail.com">
            bimalaproduction58@gmail.com
          </a>
        </p>

        <p>
          <strong>Registered Address:</strong>
        </p>
        <address>
          Flat A-1, S-E,
          <br />
          2/22 Netaji Subhas Chandra Bose Road,
          <br />
          P.S. Regent Park, Ashoke Nagar,
          <br />
          Kolkata, Kolkata 700040
        </address>
      </div>

      <div className="assistance-options">
        <h2>Our team is available to help you with:</h2>
        <ul>
          <li>Technical Support</li>
          <li>Product Inquiries</li>
          <li>Order Assistance</li>
          <li>Account Issues</li>
          <li>General Questions</li>
        </ul>
        <p>
          For a faster response, please provide detailed information about your
          issue or request when contacting us.
        </p>
      </div>

      <p>
        Thank you for reaching out, and we look forward to resolving your
        concerns promptly!
      </p>
    </div>
  );
};

export default SupportPage;
