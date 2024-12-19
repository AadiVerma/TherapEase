import React, { useState } from 'react';
import Navbar from '../navbar/Navbar.jsx';
const doctorsData = [
    {
        name: 'Dr. Aditi Sharma',
        hospital: 'Apollo Hospital',
        specialty: 'Psychologist',
        area: 'Delhi',
        experience: 12,
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        name: 'Dr. Rajesh Kumar',
        hospital: 'Fortis Hospital',
        specialty: 'Mental Health Expert',
        area: 'Mumbai',
        experience: 15,
        profilePic: 'https://randomuser.me/api/portraits/men/43.jpg',
      },
      {
        name: 'Dr. Priya Nair',
        hospital: 'AIIMS',
        specialty: 'Therapist',
        area: 'Kochi',
        experience: 8,
        profilePic: 'https://randomuser.me/api/portraits/women/24.jpg',
      },
      {
        name: 'Dr. Arjun Mehta',
        hospital: 'Max Healthcare',
        specialty: 'Psychiatrist',
        area: 'Pune',
        experience: 10,
        profilePic: 'https://randomuser.me/api/portraits/men/29.jpg',
      },
      {
        name: 'Dr. Sunita Verma',
        hospital: 'Manipal Hospital',
        specialty: 'Behavioral Therapist',
        area: 'Bangalore',
        experience: 14,
        profilePic: 'https://randomuser.me/api/portraits/women/55.jpg',
      },
      {
        name: 'Dr. Vivek Gupta',
        hospital: 'Narayana Health',
        specialty: 'Counseling Psychologist',
        area: 'Chennai',
        experience: 18,
        profilePic: 'https://randomuser.me/api/portraits/men/35.jpg',
      },
      {
        name: 'Dr. Kavita Das',
        hospital: 'Medanta Hospital',
        specialty: 'Clinical Psychologist',
        area: 'Gurgaon',
        experience: 11,
        profilePic: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      {
        name: 'Dr. Anil Joshi',
        hospital: 'Ruby Hall Clinic',
        specialty: 'Psychotherapist',
        area: 'Pune',
        experience: 9,
        profilePic: 'https://randomuser.me/api/portraits/men/48.jpg',
      },
      {
        name: 'Dr. Richa Malhotra',
        hospital: 'Lilavati Hospital',
        specialty: 'Child Psychiatrist',
        area: 'Mumbai',
        experience: 16,
        profilePic: 'https://randomuser.me/api/portraits/women/51.jpg',
      },
      {
        name: 'Dr. Amit Patel',
        hospital: 'Kokilaben Dhirubhai Ambani Hospital',
        specialty: 'Addiction Specialist',
        area: 'Ahmedabad',
        experience: 13,
        profilePic: 'https://randomuser.me/api/portraits/men/36.jpg',
      },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleClosePopup = () => {
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctorsData.filter((doctor) =>
    doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
        
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Find Your Doctor</h1>
        <input
          type="text"
          placeholder="Search by hospital or area"
          value={searchTerm}
          onChange={handleSearch}
          className="mt-4 px-4 py-2 w-1/2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
         <img 
          src={doctor.profilePic} 
          alt={doctor.name} 
          className="w-full h-auto object-cover aspect-square" 
        />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
              <p className="text-gray-600"><strong>Hospital:</strong> {doctor.hospital}</p>
              <p className="text-gray-600"><strong>Specialty:</strong> {doctor.specialty}</p>
              <p className="text-gray-600"><strong>Area:</strong> {doctor.area}</p>
              <p className="text-gray-600"><strong>Experience:</strong> {doctor.experience} years</p>
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book Appointment</h2>
            <p className="text-gray-600 mb-2"><strong>Doctor:</strong> {selectedDoctor.name}</p>
            <p className="text-gray-600 mb-2"><strong>Hospital:</strong> {selectedDoctor.hospital}</p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Select Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Your Concern</label>
        <textarea
          placeholder="Briefly describe your concern"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

            <button
              onClick={handleClosePopup}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>

            <button
              onClick={handleClosePopup}
              className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
