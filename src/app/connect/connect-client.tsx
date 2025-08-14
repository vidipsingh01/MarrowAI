'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Doctor } from '@/lib/doctors'; // Import the type for props

// The component now receives the doctors data as a prop
const ConnectClientPage: React.FC<{ doctors: Doctor[] }> = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const CARDS_PER_PAGE = 6;
  const specialties = ['all', 'Oncology', 'Hematology', 'Pediatric Hematology', 'Transplant Medicine'];

  // All this logic now runs on the 'doctors' array passed in via props
  const filteredDoctors = doctors.filter(doctor => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchesSearch =
      doctor.name.toLowerCase().includes(lowerCaseSearch) ||
      doctor.specialty.toLowerCase().includes(lowerCaseSearch) ||
      doctor.institution.toLowerCase().includes(lowerCaseSearch) ||
      doctor.location.toLowerCase().includes(lowerCaseSearch) ||
      doctor.diseaseExpertise.some(disease => disease.toLowerCase().includes(lowerCaseSearch));
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const indexOfLastCard = currentPage * CARDS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
  const currentCards = filteredDoctors.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredDoctors.length / CARDS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // The entire JSX remains the same as before
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Connect with Specialists</h1>
          <p className="text-lg text-gray-600">Find expert doctors using real data from the AAMDS network.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search name, institution, disease..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
                Showing <span className="font-semibold">{currentCards.length}</span> of <span className="font-semibold">{filteredDoctors.length}</span> specialists
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCards.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col">
              <div className="relative">
                <img src={doctor.image} alt={doctor.name} className="w-full h-56 object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-800">{doctor.rating}</span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div>
                  <p className="text-base font-semibold text-blue-600">{doctor.designation}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{doctor.institution}</p>
                </div>
                 <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-gray-500" /> Disease Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.diseaseExpertise.slice(0, 3).map(disease => (
                      <span key={disease} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">{disease}</span>
                    ))}
                    {doctor.diseaseExpertise.length > 3 && (
                        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">+{doctor.diseaseExpertise.length - 3} more</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm my-4 flex-grow">{doctor.description}</p>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400" /> <span>{doctor.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>
                <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    >
                    {page}
                    </button>
                ))}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )}
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-lg mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Specialists Found</h3>
              <p className="text-gray-600 mb-4">Your search and filter combination did not return any results. Please try a different query.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('all');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectClientPage;