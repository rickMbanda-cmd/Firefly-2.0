// Define subjects for each class
const subjectsByClass = {
  'Playgroup': ['language', 'reading', 'environment'],
  'PP1': ['language', 'reading', 'environment'],
  'PP2': ['language', 'reading', 'environment'],
  'Grade 1': ['maths', 'english', 'kiswahili', 'integrated', 'creative'],
  'Grade 2': ['maths', 'english', 'kiswahili', 'integrated', 'creative'],
  'Grade 3': ['maths', 'english', 'kiswahili', 'integrated', 'creative'],
  'Grade 4': ['maths', 'english', 'kiswahili', 'cre_environmental', 'kusoma', 'ss_crts_cre'],
  'Grade 5': ['maths', 'english', 'kiswahili', 'cre_environmental', 'kusoma', 'ss_crts_cre'],
  'Grade 6': ['maths', 'english', 'kiswahili', 'cre_environmental', 'kusoma', 'ss_crts_cre'],
  'Grade 7': ['maths', 'english', 'kiswahili', 'ss', 'pretech', 'crts', 'agri_n', 'cre'],
  'Grade 8': ['maths', 'english', 'kiswahili', 'ss', 'pretech', 'crts', 'agri_n', 'cre'],
  'Grade 9': ['maths', 'english', 'kiswahili', 'ss', 'pretech', 'crts', 'agri_n', 'cre']
};

// Get all possible subjects across all classes for debugging
export const getAllSubjects = () => {
  const allSubjects = new Set();
  Object.values(subjectsByClass).forEach(subjects => {
    subjects.forEach(subject => allSubjects.add(subject));
  });
  return Array.from(allSubjects);
};

// Function to get subjects for a specific class
export const getSubjectsByClass = (className) => {
  if (!className) return subjectsByClass['Grade 1'];
  return subjectsByClass[className] || subjectsByClass['Grade 1'];
};

export const getSubjectDisplayName = (subject) => {
  const displayNames = {
    maths: 'Maths',
    english: 'English',
    kiswahili: 'Kiswahili',
    language: 'Language',
    reading: 'Reading',
    environment: 'Environment',
    integrated: 'Integrated',
    creative: 'Creative',
    cre_environmental: 'CRE&Environmental',
    kusoma: 'Kusoma',
    ss_crts_cre: 'S/S &CRT/S &CRE',
    ss: 'S/S',
    pretech: 'Pretech',
    crts: 'Crt/S',
    agri_n: 'Agri/N',
    cre: 'CRE'
  };
  return displayNames[subject] || subject;
};

// Function to get rubric based on mean score (using acronyms)
export const getRubric = (mean) => {
  if (mean >= 80) return 'E.E'; // Exceeding Expectations
  if (mean >= 65) return 'M.E'; // Meeting Expectations  
  if (mean >= 50) return 'A.E'; // Approaching Expectations
  return 'B.E'; // Below Expectations
};