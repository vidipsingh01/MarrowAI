export interface Doctor {
  id: number;
  name: string;
  institution: string;
  location: string;
  diseaseExpertise: string[];
  designation: string;
  specialty: string;
  description: string;
  rating: number;
  image: string;
  experience: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Yasmin Abaza, MD",
    institution: "Robert H. Lurie Comprehensive Cancer Center of Northwestern University",
    location: "Chicago, Illinois, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Oncology",
    designation: "Hematologist-Oncologist",
    description: "A leading specialist at Northwestern University, Dr. Abaza focuses on treating a spectrum of hematologic malignancies including AML, Aplastic Anemia, and MDS.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces",
    experience: "16+ years"
  },
  {
    id: 2,
    name: "Dr. Omar Abdel-Wahab, MD",
    institution: "Memorial Sloan-Kettering Cancer Center",
    location: "New York City, New York, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Oncology",
    designation: "Medical Oncologist",
    description: "Practicing at Memorial Sloan-Kettering, Dr. Abdel-Wahab is renowned for his work in AML, MDS, and other myeloproliferative neoplasms.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces",
    experience: "18+ years"
  },
  {
    id: 3,
    name: "Dr. Gregory Abel, MD, MPH",
    institution: "Dana-Farber Cancer Institute",
    location: "Boston, Massachusetts, United States",
    diseaseExpertise: ["Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Hematology",
    designation: "Clinical Hematologist",
    description: "Associated with the Dana-Farber Cancer Institute, Dr. Abel provides expert care for patients with MDS and various myeloproliferative neoplasms.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "20+ years"
  },
  {
    id: 4,
    name: "Dr. Suneet Agarwal, MD, PhD",
    institution: "Boston Children's Hospital",
    location: "Boston, Massachusetts, United States",
    diseaseExpertise: ["Aplastic Anemia", "Pediatric"],
    specialty: "Pediatric Hematology",
    designation: "Pediatric Hematologist-Oncologist",
    description: "Dr. Agarwal is a specialist at Boston Children's Hospital, focusing on pediatric cases of aplastic anemia and other bone marrow failure syndromes.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "15+ years"
  },
  {
    id: 5,
    name: "Dr. Hassan Alkhateeb, MD",
    institution: "Mayo Clinic - Rochester",
    location: "Rochester, Minnesota, United States",
    diseaseExpertise: ["AML", "Aplastic Anemia", "CLL", "CMML", "MDS", "MPN", "PNH", "Pediatric"],
    specialty: "Hematology",
    designation: "Consultant, Hematology",
    description: "Dr. Alkhateeb of the Mayo Clinic has a broad expertise covering a wide range of hematologic conditions from AML and MDS to pediatric blood disorders.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces",
    experience: "12+ years"
  },
  {
    id: 6,
    name: "Dr. Amanda Przespolewski, DO",
    institution: "Roswell Park Comprehensive Cancer Center",
    location: "Buffalo, New York, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "MDS", "MPN", "PNH"],
    specialty: "Oncology",
    designation: "Leukemia Specialist",
    description: "At Roswell Park, Dr. Przespolewski specializes in complex blood disorders, including AML, Aplastic Anemia, and Paroxysmal Nocturnal Hemoglobinuria (PNH).",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces",
    experience: "10+ years"
  },
  {
    id: 7,
    name: "Dr. Cecilia Arana Yi, MD, MSHS, FACP",
    institution: "Mayo Clinic, Phoenix, AZ",
    location: "Phoenix, Arizona, United States",
    diseaseExpertise: ["AML", "Aplastic Anemia", "CLL", "CMML", "GVHD", "MDS", "MPN", "PNH", "PRCA"],
    specialty: "Transplant Medicine",
    designation: "Hematology & BMT Specialist",
    description: "Dr. Arana Yi provides comprehensive care at the Mayo Clinic, with deep expertise in bone marrow transplant (BMT), GVHD, and a wide array of blood disorders.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?q=80&w=853&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "14+ years"
  },
  {
    id: 8,
    name: "Dr. David Araten, MD",
    institution: "NYU School of Medicine",
    location: "New York City, New York, United States",
    diseaseExpertise: ["Paroxysmal Nocturnal Hemoglobinuria (PNH)"],
    specialty: "Hematology",
    designation: "PNH Specialist",
    description: "Dr. Araten is a leading authority on Paroxysmal Nocturnal Hemoglobinuria (PNH), conducting research and providing specialized care at NYU.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop&crop=faces",
    experience: "22+ years"
  },
  {
    id: 9,
    name: "Dr. Ehab Atallah, MD",
    institution: "Froedtert Hospital & MCW",
    location: "Milwaukee, Wisconsin, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "MDS", "MPN"],
    specialty: "Oncology",
    designation: "Professor of Medicine",
    description: "At Froedtert & the Medical College of Wisconsin, Dr. Atallah is focused on advancing treatments for AML, MDS, and other related neoplasms.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612276529731-4b21494e6d71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "17+ years"
  },
  {
    id: 10,
    name: "Dr. Daria Babushok, MD, PhD",
    institution: "Hospital of the University of Pennsylvania",
    location: "Philadelphia, Pennsylvania, United States",
    diseaseExpertise: ["Aplastic Anemia", "Myeloproliferative Neoplasms (MPN)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)"],
    specialty: "Hematology",
    designation: "Hematologist-Oncologist",
    description: "Dr. Babushok is a distinguished physician at the Hospital of the University of Pennsylvania specializing in bone marrow failure syndromes.",
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1681996428751-93e0294fe98d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "12+ years"
  },
  {
    id: 11,
    name: "Dr. Talha Badar, MBBS, MD",
    institution: "Mayo Clinic - Jacksonville",
    location: "Jacksonville, Florida, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Oncology",
    designation: "Medical Oncologist",
    description: "Practicing at the Mayo Clinic in Jacksonville, Dr. Badar is an expert in treating myeloid malignancies including AML and MDS.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "11+ years"
  },
  {
    id: 12,
    name: "Dr. Maria Baer, MD",
    institution: "University of Maryland Greenebaum Comprehensive Cancer Center",
    location: "Baltimore, Maryland, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Hematology",
    designation: "Director, Hematologic Malignancies",
    description: "Dr. Baer leads the hematologic malignancies program at the University of Maryland, with a focus on AML, Aplastic Anemia, and MDS.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    experience: "25+ years"
  },
  {
    id: 13,
    name: "Dr. Suresh Balasubramanian",
    institution: "Karmanos Cancer Institute",
    location: "Detroit, Michigan, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)", "Pure Red Cell Aplasia (PRCA)"],
    specialty: "Hematology",
    designation: "Hematologist",
    description: "Dr. Balasubramanian provides expert care at Karmanos Cancer Institute for a wide range of hematologic disorders.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1700041785712-649e859d9909?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGRvY3RvcnxlbnwwfDB8MHx8fDA%3D",
    experience: "14+ years"
  },
  {
    id: 14,
    name: "Dr. Brian Ball, MD",
    institution: "City of Hope",
    location: "Duarte, California, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)"],
    specialty: "Oncology",
    designation: "Assistant Clinical Professor",
    description: "At City of Hope, Dr. Ball focuses on treating AML, Aplastic Anemia, and Myelodysplastic Syndromes.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1666887360742-974c8fce8e6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxkb2N0b3J8ZW58MHx8MHx8fDA%3D",
    experience: "9+ years"
  },
  {
    id: 15,
    name: "Dr. Praneeth Baratam, MBBS",
    institution: "Medical University of South Carolina",
    location: "Charleston, South Carolina, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)"],
    specialty: "Hematology",
    designation: "Hematologist-Oncologist",
    description: "Dr. Baratam specializes in a broad spectrum of blood cancers and disorders at the Medical University of South Carolina.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRvY3RvcnxlbnwwfDB8MHx8fDA%3D",
    experience: "8+ years"
  },
  {
    id: 16,
    name: "Dr. Taha Bat, MD",
    institution: "UT Southwestern Medical Center",
    location: "Dallas, Texas, United States",
    diseaseExpertise: ["Aplastic Anemia", "Paroxysmal Nocturnal Hemoglobinuria (PNH)"],
    specialty: "Hematology",
    designation: "Clinical Hematologist",
    description: "Dr. Bat is a key specialist at UT Southwestern, with a dedicated focus on Aplastic Anemia and PNH.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8MHwwfHx8MA%3D%3D",
    experience: "10+ years"
  },
  {
    id: 17,
    name: "Dr. David Beck, MD, PhD",
    institution: "NYU Grossman School of Medicine",
    location: "New York, New York, United States",
    diseaseExpertise: [],
    specialty: "Hematology",
    designation: "Physician-Scientist",
    description: "Dr. Beck is a physician-scientist at NYU Grossman School of Medicine, researching and treating hematologic conditions.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces",
    experience: "11+ years"
  },
  {
    id: 18,
    name: "Dr. Pamela Becker, MD, PhD",
    institution: "City of Hope",
    location: "Duarte, California, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)"],
    specialty: "Oncology",
    designation: "Professor, Hematology & HCT",
    description: "A leading professor at City of Hope, Dr. Becker is an authority on the treatment of Acute Myeloid Leukemia (AML).",
    rating: 4.9,
    image: "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRvY3RvcnxlbnwwfDB8MHx8fDA%3D",
    experience: "28+ years"
  },
  {
    id: 19,
    name: "Dr. Rafael Bejar, MD, PhD",
    institution: "UC San Diego Health",
    location: "San Diego, California, United States",
    diseaseExpertise: ["Myelodysplastic Syndromes (MDS)"],
    specialty: "Hematology",
    designation: "MDS Specialist",
    description: "Dr. Bejar is a renowned specialist in Myelodysplastic Syndromes (MDS) at UC San Diego Health, leading research and clinical trials.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=faces",
    experience: "18+ years"
  },
  {
    id: 20,
    name: "Dr. Alison Bertuch, MD, PhD",
    institution: "Texas Children's Hospital",
    location: "Houston, Texas, United States",
    diseaseExpertise: ["Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)", "Pediatric"],
    specialty: "Pediatric Hematology",
    designation: "Pediatric Hematologist-Oncologist",
    description: "Dr. Bertuch specializes in pediatric blood disorders and bone marrow failure syndromes at Texas Children's Hospital.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=faces",
    experience: "20+ years"
  },
  {
    id: 21,
    name: "Dr. Vijaya Bhatt, MD",
    institution: "University of Nebraska Medical Center",
    location: "Omaha, Nebraska, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)"],
    specialty: "Oncology",
    designation: "Associate Professor",
    description: "Dr. Bhatt treats a wide array of hematologic malignancies at the University of Nebraska Medical Center.",
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1661551577028-80cfb8e4d236?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGRvY3RvcnxlbnwwfDB8MHx8fDA%3D",
    experience: "13+ years"
  },
  {
    id: 22,
    name: "Dr. Morey Blinder, MD",
    institution: "Washington University in St. Louis",
    location: "Saint Louis, Missouri, United States",
    diseaseExpertise: ["Aplastic Anemia", "Chronic Lymphocytic Leukemia (CLL)", "Chronic Myelomonocytic Leukaemia (CMML)"],
    specialty: "Hematology",
    designation: "Professor of Medicine",
    description: "Dr. Blinder is a Professor of Medicine at Washington University, specializing in chronic leukemias and aplastic anemia.",
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1661551577028-80cfb8e4d236?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGRvY3RvcnxlbnwwfDB8MHx8fDA%3D",
    experience: "30+ years"
  },
  {
    id: 23,
    name: "Dr. Jaap Jan Boelens, M.D.",
    institution: "Memorial Sloan Kettering Cancer Center",
    location: "New York, New York, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Aplastic Anemia", "Pediatric"],
    specialty: "Pediatric Transplant Medicine",
    designation: "Chief, Pediatric Stem Cell Transplantation",
    description: "Dr. Boelens leads the pediatric stem cell transplantation service at Memorial Sloan Kettering, with a focus on AML and Aplastic Anemia.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582895361887-24daa40c8667?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjkyfHxkb2N0b3J8ZW58MHwwfDB8fHww",
    experience: "22+ years"
  },
  {
    id: 24,
    name: "Dr. Kelly Bolton, MD, PhD",
    institution: "Washington University School of Medicine",
    location: "St. Louis, Missouri, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Oncology",
    designation: "Assistant Professor of Medicine",
    description: "At Washington University, Dr. Bolton focuses on the genetic predisposition to myeloid malignancies like AML and MDS.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=faces",
    experience: "8+ years"
  },
  {
    id: 25,
    name: "Dr. Carmem Bonfim, MD, PhD",
    institution: "Duke University Medical Center",
    location: "Durham, North Carolina, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Myelodysplastic Syndromes (MDS)", "Paroxysmal Nocturnal Hemoglobinuria (PNH)", "Pediatric"],
    specialty: "Pediatric Hematology",
    designation: "Pediatric BMT Specialist",
    description: "Dr. Bonfim is a pediatric bone marrow transplant specialist at Duke, treating conditions like AML, MDS, and PNH in children.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=faces",
    experience: "19+ years"
  },
  {
    id: 26,
    name: "Dr. Uma Borate, MBBS",
    institution: "The Ohio State University Comprehensive Cancer Center",
    location: "Columbus, Ohio, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Myelodysplastic Syndromes (MDS)", "Myeloproliferative Neoplasms (MPN)"],
    specialty: "Oncology",
    designation: "Leukemia Program Director",
    description: "Dr. Borate directs the leukemia program at OSU, providing expert care for patients with AML, MDS, and MPN.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=400&fit=crop&crop=faces",
    experience: "15+ years"
  },
  {
    id: 27,
    name: "Dr. Danielle Brander, MD",
    institution: "Duke Cancer Center",
    location: "Durham, North Carolina, United States",
    diseaseExpertise: ["Chronic Lymphocytic Leukemia (CLL)"],
    specialty: "Hematology",
    designation: "CLL Specialist",
    description: "At Duke Cancer Center, Dr. Brander is a leading expert in the treatment and research of Chronic Lymphocytic Leukemia (CLL).",
    rating: 4.9,
    image: "https://plus.unsplash.com/premium_photo-1681842900431-71d2a3a80a33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzI5fHxkb2N0b3J8ZW58MHwwfDB8fHww",
    experience: "12+ years"
  },
  {
    id: 28,
    name: "Dr. Benjamin Braun, MD, PhD",
    institution: "University of California-San Francisco",
    location: "San Francisco, California, United States",
    diseaseExpertise: ["Acute Myeloid Leukemia (AML)", "Pediatric"],
    specialty: "Pediatric Oncology",
    designation: "Pediatric Oncologist",
    description: "Dr. Braun specializes in pediatric Acute Myeloid Leukemia (AML) at UCSF, focusing on developing novel therapies.",
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1661492071612-98d26885614a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzUzfHxkb2N0b3J8ZW58MHwwfDB8fHww",
    experience: "14+ years"
  },
  {
    id: 29,
    name: "Dr. Robert A. Brodsky, MD",
    institution: "Johns Hopkins",
    location: "Baltimore, Maryland, United States",
    diseaseExpertise: ["Aplastic Anemia"],
    specialty: "Hematology",
    designation: "Director, Division of Hematology",
    description: "Dr. Brodsky is the Director of Hematology at Johns Hopkins and a world-renowned expert in Aplastic Anemia.",
    rating: 5.0,
    image: "https://plus.unsplash.com/premium_photo-1681995318495-bbc49e7c3487?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDA5fHxkb2N0b3J8ZW58MHwwfDB8fHww",
    experience: "30+ years"
  }
];

export const getDoctorData = (): Doctor[] => {
  // For now, it simply returns our local array.
  // In the future, this is where you would put your database query,
  // e.g., const data = await db.query('SELECT * FROM doctors');
  return doctors;
};