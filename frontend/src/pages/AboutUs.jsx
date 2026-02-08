import React from "react";
import { FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";

import TanmayImg from "../assets/Tanmay.jpg";
import SaloniImg from "../assets/Saloni.jpg";
import AmarnathImg from "../assets/Amarnath.jpg";
import PoonamImg from "../assets/Poonam.jpeg";
import DhanashreeImg from "../assets/Dhanashree.jpeg";

const teamMembers = [
  {
    name: "Tanmay Salwe",
    role: "Backend Developer",
    image: TanmayImg,
    bio: "Proficient in designing and developing secure, scalable RESTful APIs and backend systems."
  },
  {
    name: "Saloni Chavande",
    role: "Full-Stack Developer",
    image: SaloniImg,
    bio: "Skilled in frontend and backend development with a focus on clean architecture and performance"
  },
  {
    name: "Dhanashree",
    role: "Backend Developer",
    image: DhanashreeImg,
    bio: "Experienced in server-side development, database management, and API integration."
  },
  {
    name: "Poonam More",
    role: "Frontend Developer",
    image: PoonamImg,
    bio: "Specialized in building responsive user interfaces with attention to usability and design consistency."
  },
  {
    name: "Amarnath Malpuri",
    role: "Backend Developer",
    image: AmarnathImg,
    bio: "Strong in backend logic implementation, authentication mechanisms, and data handling."
  }
];

export default function AboutUs() {
  return (
    <div className="pt-5 mt-5">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Our Dedicated <span className="text-success">Team</span>
          </h1>
          <p className="text-muted">
            The hearts and minds behind SahayaSetu&apos;s mission.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch"
            >
              <div className="card border-0 shadow-sm text-center p-4 h-100 team-card">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-circle mx-auto mb-3 shadow-sm img-fluid"
                  style={{
                    maxWidth: "180px",
                    height: "180px",
                    objectFit: "cover"
                  }}
                />

                <h5 className="fw-bold mb-1">{member.name}</h5>
                <p className="text-success small fw-bold mb-2">
                  {member.role}
                </p>
                <p className="text-muted small mb-4">{member.bio}</p>

                <div className="d-flex justify-content-center gap-3">
                  <FaLinkedin size={22} className="text-primary" />
                  <FaWhatsapp size={22} className="text-success" />
                  <FaEnvelope size={20} className="text-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover styles */}
      <style>
        {`
          .team-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 1rem 2rem rgba(0,0,0,0.25);
          }

          @media (max-width: 576px) {
            .team-card img {
              max-width: 140px;
              height: 140px;
            }
          }
        `}
      </style>
    </div>
  );
}
