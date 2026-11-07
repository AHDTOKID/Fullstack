const AcademicRecord = require('../models/AcademicRecord');
const User = require('../models/User');

const CLASS_CONFIG = {
  'Grade 10 - Section A': {
    subjects: ['Theoretical Physics', 'Advanced Mathematics', 'Chemistry', 'Literature & Composition', 'History of Art'],
    students: [
      { roll: '001', name: 'Alex Thompson', studentId: '#AT-9920', avatar: 'AT' },
      { roll: '002', name: 'Elena Rodriguez', studentId: '#ER-9921', avatar: 'ER' },
      { roll: '003', name: 'Marcus Chen', studentId: '#MC-9922', avatar: 'MC' },
      { roll: '004', name: 'David Kim', studentId: '#DK-9926', avatar: 'DK' },
      { roll: '005', name: 'Chloe Bennett', studentId: '#CB-9927', avatar: 'CB' },
      { roll: '006', name: 'Lucas Garcia', studentId: '#LG-9928', avatar: 'LG' },
    ],
    sampleMarks: {
      'Theoretical Physics': [
        { roll: '001', status: 'present', marks: '94.5', remarks: 'Outstanding performance in thermodynamics' },
        { roll: '002', status: 'present', marks: '88.0', remarks: 'Improved analytical logic' },
        { roll: '003', status: 'absent', marks: '', remarks: 'Medical leave pending' },
        { roll: '004', status: 'present', marks: '82.5', remarks: 'Strong grasp of kinematics' },
        { roll: '005', status: 'present', marks: '91.0', remarks: 'Excellent lab experimentation' },
        { roll: '006', status: 'present', marks: '74.0', remarks: 'Needs revision on wave optics' },
      ],
      'Advanced Mathematics': [
        { roll: '001', status: 'present', marks: '89.0', remarks: 'Solid mastery of differential calculus' },
        { roll: '002', status: 'present', marks: '95.5', remarks: 'Top scorer in matrix algebra' },
        { roll: '003', status: 'present', marks: '71.0', remarks: 'Good recovery after absence' },
        { roll: '004', status: 'present', marks: '86.0', remarks: 'Consistent problem solving' },
        { roll: '005', status: 'present', marks: '88.5', remarks: 'Well-structured trigonometric proofs' },
        { roll: '006', status: 'present', marks: '79.5', remarks: 'Active participation in tutorial' },
      ],
      'Chemistry': [
        { roll: '001', status: 'present', marks: '92.0', remarks: 'High precision in analytical titration' },
        { roll: '002', status: 'present', marks: '84.5', remarks: 'Good grasp of stoichiometry' },
        { roll: '003', status: 'present', marks: '69.0', remarks: 'Review organic nomenclature' },
        { roll: '004', status: 'present', marks: '90.5', remarks: 'Outstanding experimental analysis' },
        { roll: '005', status: 'present', marks: '87.0', remarks: 'Comprehensive lab report' },
        { roll: '006', status: 'present', marks: '81.0', remarks: 'Solid lab safety and technique' },
      ],
      'Literature & Composition': [
        { roll: '001', status: 'present', marks: '86.0', remarks: 'Thoughtful narrative essay' },
        { roll: '002', status: 'present', marks: '91.5', remarks: 'Superb textual critique' },
        { roll: '003', status: 'present', marks: '82.0', remarks: 'Creative interpretation of poetry' },
        { roll: '004', status: 'present', marks: '79.0', remarks: 'Clear and persuasive rhetoric' },
        { roll: '005', status: 'present', marks: '96.0', remarks: 'Exceptional literary exposition' },
        { roll: '006', status: 'present', marks: '88.0', remarks: 'Great vocabulary and flow' },
      ],
      'History of Art': [
        { roll: '001', status: 'present', marks: '88.0', remarks: 'Well-researched Renaissance critique' },
        { roll: '002', status: 'present', marks: '93.0', remarks: 'Exceptional visual analysis' },
        { roll: '003', status: 'present', marks: '77.5', remarks: 'Good contextual understanding' },
        { roll: '004', status: 'present', marks: '84.0', remarks: 'Engaging stylistic study' },
        { roll: '005', status: 'present', marks: '90.5', remarks: 'Deep aesthetic insight' },
        { roll: '006', status: 'present', marks: '85.0', remarks: 'Detailed architectural comparison' },
      ],
    },
  },
  'Grade 10 - Section B': {
    subjects: ['Biology', 'English Literature', 'Computer Science', 'Mathematics', 'Geography'],
    students: [
      { roll: '001', name: 'Priya Nair', studentId: '#PN-9924', avatar: 'PN' },
      { roll: '002', name: 'James Wu', studentId: '#JW-9925', avatar: 'JW' },
      { roll: '003', name: 'Aisha Patel', studentId: '#AP-9930', avatar: 'AP' },
      { roll: '004', name: 'Noah Miller', studentId: '#NM-9931', avatar: 'NM' },
      { roll: '005', name: 'Sophia Zhang', studentId: '#SZ-9932', avatar: 'SZ' },
      { roll: '006', name: 'Ethan Davies', studentId: '#ED-9933', avatar: 'ED' },
    ],
    sampleMarks: {
      'Biology': [
        { roll: '001', status: 'present', marks: '96.0', remarks: 'Top performance in cellular genetics' },
        { roll: '002', status: 'present', marks: '84.5', remarks: 'Detailed anatomical diagrams' },
        { roll: '003', status: 'present', marks: '89.0', remarks: 'Consistent and thorough lab work' },
        { roll: '004', status: 'present', marks: '76.5', remarks: 'Good effort on taxonomy' },
        { roll: '005', status: 'present', marks: '92.0', remarks: 'Excellent experimental design' },
        { roll: '006', status: 'present', marks: '71.0', remarks: 'Needs revision on ecosystem cycles' },
      ],
      'Computer Science': [
        { roll: '001', status: 'present', marks: '98.5', remarks: 'Flawless algorithm design and code quality' },
        { roll: '002', status: 'present', marks: '91.0', remarks: 'Efficient data structure implementation' },
        { roll: '003', status: 'present', marks: '86.0', remarks: 'Clean and modular functions' },
        { roll: '004', status: 'present', marks: '83.5', remarks: 'Solid understanding of OOP' },
        { roll: '005', status: 'present', marks: '95.0', remarks: 'High marks in system design' },
        { roll: '006', status: 'present', marks: '88.0', remarks: 'Well-documented final project' },
      ],
      'English Literature': [
        { roll: '001', status: 'present', marks: '92.0', remarks: 'Expressive prose analysis' },
        { roll: '002', status: 'present', marks: '79.0', remarks: 'Good comprehension of dramatic irony' },
        { roll: '003', status: 'present', marks: '88.5', remarks: 'Compelling thematic comparison' },
        { roll: '004', status: 'present', marks: '74.0', remarks: 'Work on structured conclusions' },
        { roll: '005', status: 'present', marks: '90.0', remarks: 'Thoughtful historical context' },
        { roll: '006', status: 'present', marks: '85.5', remarks: 'Engaging verbal seminar debate' },
      ],
      'Mathematics': [
        { roll: '001', status: 'present', marks: '94.0', remarks: 'High accuracy in geometry & trigonometry' },
        { roll: '002', status: 'present', marks: '82.5', remarks: 'Solid algebraic simplification' },
        { roll: '003', status: 'present', marks: '87.0', remarks: 'Good speed and precision' },
        { roll: '004', status: 'present', marks: '78.0', remarks: 'Steady progress in quadratics' },
        { roll: '005', status: 'present', marks: '91.5', remarks: 'Excellent coordinate geometry' },
        { roll: '006', status: 'present', marks: '80.0', remarks: 'Show step-by-step calculations' },
      ],
      'Geography': [
        { roll: '001', status: 'present', marks: '91.0', remarks: 'Comprehensive cartographic evaluation' },
        { roll: '002', status: 'present', marks: '86.0', remarks: 'Good climate data synthesis' },
        { roll: '003', status: 'present', marks: '90.0', remarks: 'Insightful demographic case study' },
        { roll: '004', status: 'present', marks: '81.5', remarks: 'Clear topographical map reading' },
        { roll: '005', status: 'present', marks: '89.0', remarks: 'Strong tectonic analysis' },
        { roll: '006', status: 'present', marks: '83.0', remarks: 'Solid environmental report' },
      ],
    },
  },
  'Grade 11 - Section A': {
    subjects: ['Advanced Mathematics', 'Theoretical Physics', 'Organic Chemistry', 'Computer Systems', 'Physics Lab'],
    students: [
      { roll: '001', name: 'Sasha Petrov', studentId: '#SP-9923', avatar: 'SP' },
      { roll: '002', name: 'Benjamin Hayes', studentId: '#BH-9935', avatar: 'BH' },
      { roll: '003', name: 'Maya Lin', studentId: '#ML-9936', avatar: 'ML' },
      { roll: '004', name: 'Oliver Queen', studentId: '#OQ-9937', avatar: 'OQ' },
      { roll: '005', name: 'Fatima Zahra', studentId: '#FZ-9938', avatar: 'FZ' },
    ],
    sampleMarks: {
      'Advanced Mathematics': [
        { roll: '001', status: 'present', marks: '95.0', remarks: 'Mastery of multivariable differentiation' },
        { roll: '002', status: 'present', marks: '88.5', remarks: 'Strong linear algebra foundations' },
        { roll: '003', status: 'present', marks: '92.0', remarks: 'Precise convergence proofs' },
        { roll: '004', status: 'present', marks: '84.0', remarks: 'Good vector calculus computation' },
        { roll: '005', status: 'present', marks: '91.0', remarks: 'Insightful geometric transformations' },
      ],
      'Theoretical Physics': [
        { roll: '001', status: 'present', marks: '97.0', remarks: 'Exceptional quantum mechanics intuition' },
        { roll: '002', status: 'present', marks: '86.0', remarks: 'Solid electromagnetic field calculations' },
        { roll: '003', status: 'present', marks: '89.5', remarks: 'Detailed relativistic derivation' },
        { roll: '004', status: 'present', marks: '81.0', remarks: 'Good thermodynamic analysis' },
        { roll: '005', status: 'present', marks: '93.5', remarks: 'Outstanding particle model paper' },
      ],
      'Organic Chemistry': [
        { roll: '001', status: 'present', marks: '90.0', remarks: 'Complex synthesis pathways mapped clearly' },
        { roll: '002', status: 'present', marks: '83.0', remarks: 'Good spectroscopy interpretation' },
        { roll: '003', status: 'present', marks: '94.0', remarks: 'Flawless reaction mechanism analysis' },
        { roll: '004', status: 'present', marks: '78.5', remarks: 'Review stereochemistry configurations' },
        { roll: '005', status: 'present', marks: '89.0', remarks: 'High accuracy in chromatography lab' },
      ],
      'Computer Systems': [
        { roll: '001', status: 'present', marks: '93.0', remarks: 'Excellent memory allocation & assembly code' },
        { roll: '002', status: 'present', marks: '91.5', remarks: 'Strong CPU pipeline simulation' },
        { roll: '003', status: 'present', marks: '87.0', remarks: 'Clean network protocol design' },
        { roll: '004', status: 'present', marks: '85.0', remarks: 'Good OS kernel threading project' },
        { roll: '005', status: 'present', marks: '96.0', remarks: 'Outstanding concurrency benchmark' },
      ],
      'Physics Lab': [
        { roll: '001', status: 'present', marks: '96.0', remarks: 'Minimal error margins in optics apparatus' },
        { roll: '002', status: 'present', marks: '89.0', remarks: 'Detailed error propagation analysis' },
        { roll: '003', status: 'present', marks: '93.0', remarks: 'Excellent oscilloscope calibration' },
        { roll: '004', status: 'present', marks: '86.5', remarks: 'Consistent experimental technique' },
        { roll: '005', status: 'present', marks: '94.0', remarks: 'Superb precision and data plotting' },
      ],
    },
  },
  'Grade 11 - Section B': {
    subjects: ['Economics', 'Business Studies', 'Accountancy', 'Statistics', 'Applied Math'],
    students: [
      { roll: '001', name: 'Daniel Foster', studentId: '#DF-9940', avatar: 'DF' },
      { roll: '002', name: 'Zoe Washington', studentId: '#ZW-9941', avatar: 'ZW' },
      { roll: '003', name: 'Liam Gallagher', studentId: '#LG-9942', avatar: 'LG' },
      { roll: '004', name: 'Hannah Abbott', studentId: '#HA-9943', avatar: 'HA' },
    ],
    sampleMarks: {
      'Economics': [
        { roll: '001', status: 'present', marks: '91.0', remarks: 'Insightful macroeconomic policy debate' },
        { roll: '002', status: 'present', marks: '94.5', remarks: 'Top paper on fiscal policy elasticity' },
        { roll: '003', status: 'present', marks: '82.0', remarks: 'Good market equilibrium diagrams' },
        { roll: '004', status: 'present', marks: '88.0', remarks: 'Clear analysis of trade deficits' },
      ],
      'Accountancy': [
        { roll: '001', status: 'present', marks: '93.5', remarks: 'Flawless balance sheet & cash flow model' },
        { roll: '002', status: 'present', marks: '89.0', remarks: 'Accurate depreciation scheduling' },
        { roll: '003', status: 'present', marks: '85.0', remarks: 'Strong ledger reconciliation' },
        { roll: '004', status: 'present', marks: '92.0', remarks: 'Comprehensive audit simulation' },
      ],
      'Business Studies': [
        { roll: '001', status: 'present', marks: '87.0', remarks: 'Strategic SWOT analysis' },
        { roll: '002', status: 'present', marks: '96.0', remarks: 'Winning corporate marketing case' },
        { roll: '003', status: 'present', marks: '80.5', remarks: 'Solid operational management plan' },
        { roll: '004', status: 'present', marks: '89.0', remarks: 'Engaging organizational leadership essay' },
      ],
      'Statistics': [
        { roll: '001', status: 'present', marks: '90.0', remarks: 'High accuracy in hypothesis testing' },
        { roll: '002', status: 'present', marks: '92.5', remarks: 'Rigorous regression analysis' },
        { roll: '003', status: 'present', marks: '84.0', remarks: 'Good variance calculations' },
        { roll: '004', status: 'present', marks: '91.0', remarks: 'Excellent confidence interval modeling' },
      ],
      'Applied Math': [
        { roll: '001', status: 'present', marks: '88.0', remarks: 'Strong financial mathematics application' },
        { roll: '002', status: 'present', marks: '90.0', remarks: 'Clear optimization problem formulation' },
        { roll: '003', status: 'present', marks: '81.5', remarks: 'Good linear programming solutions' },
        { roll: '004', status: 'present', marks: '87.5', remarks: 'Consistent compound interest models' },
      ],
    },
  },
  'Grade 12 - Section A': {
    subjects: ['Quantum Mechanics', 'Biochemistry', 'Advanced Statistics', 'Research Seminar', 'Capstone Project'],
    students: [
      { roll: '001', name: 'William Clark', studentId: '#WC-9950', avatar: 'WC' },
      { roll: '002', name: 'Victoria Sterling', studentId: '#VS-9951', avatar: 'VS' },
      { roll: '003', name: 'Christopher Nolan', studentId: '#CN-9952', avatar: 'CN' },
    ],
    sampleMarks: {
      'Quantum Mechanics': [
        { roll: '001', status: 'present', marks: '96.5', remarks: 'Superb Hamiltonian operator solutions' },
        { roll: '002', status: 'present', marks: '94.0', remarks: 'Exceptional Schrödinger wave packet derivation' },
        { roll: '003', status: 'present', marks: '91.0', remarks: 'Deep insight into quantum entanglement' },
      ],
      'Biochemistry': [
        { roll: '001', status: 'present', marks: '93.0', remarks: 'Detailed enzyme kinetics breakdown' },
        { roll: '002', status: 'present', marks: '97.5', remarks: 'Flawless metabolic pathway synthesis' },
        { roll: '003', status: 'present', marks: '89.0', remarks: 'Solid protein folding analysis' },
      ],
      'Advanced Statistics': [
        { roll: '001', status: 'present', marks: '91.5', remarks: 'Robust Bayesian inference modeling' },
        { roll: '002', status: 'present', marks: '95.0', remarks: 'Excellent multivariate regression' },
        { roll: '003', status: 'present', marks: '88.5', remarks: 'High precision Markov chains' },
      ],
      'Research Seminar': [
        { roll: '001', status: 'present', marks: '95.0', remarks: 'Engaging defense and literature review' },
        { roll: '002', status: 'present', marks: '98.0', remarks: 'Outstanding original methodology' },
        { roll: '003', status: 'present', marks: '92.0', remarks: 'Persuasive scientific discourse' },
      ],
      'Capstone Project': [
        { roll: '001', status: 'present', marks: '97.0', remarks: 'Exceptional prototype and peer presentation' },
        { roll: '002', status: 'present', marks: '99.0', remarks: 'Publication-quality scientific thesis' },
        { roll: '003', status: 'present', marks: '94.0', remarks: 'Comprehensive technical execution' },
      ],
    },
  },
};

// Synchronize any registered students in MongoDB User collection into the class roster
const syncRegisteredStudents = async (record, className) => {
  const registeredStudents = await User.find({
    role: 'student',
    studentClass: className,
  });

  let modified = false;
  for (const stu of registeredStudents) {
    const exists = record.records.some(
      (r) =>
        (stu.studentId && r.studentId === stu.studentId) ||
        r.studentName.toLowerCase() === stu.name.toLowerCase()
    );
    if (!exists) {
      const nextRollNum = String(record.records.length + 1).padStart(3, '0');
      const avatarStr = stu.initials || stu.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
      record.records.push({
        roll: stu.rollNumber || nextRollNum,
        studentName: stu.name,
        studentId: stu.studentId || `#ST-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: avatarStr,
        status: 'present',
        marks: '89.0',
        remarks: 'Active class participation & consistent academic performance',
      });
      modified = true;
    }
  }

  if (modified) {
    await record.save();
  }
  return record;
};

// GET /api/records
exports.getRecords = async (req, res) => {
  try {
    const className = req.query.className || 'Grade 10 - Section A';
    const cfg = CLASS_CONFIG[className] || CLASS_CONFIG['Grade 10 - Section A'];
    const subject = req.query.subject || cfg.subjects[0];
    const term = req.query.term || 'Final Examination 2024';

    let record = await AcademicRecord.findOne({ className, subject, term });

    if (!record) {
      // Build from configured roster & sample marks for this class & subject
      const sampleList = cfg.sampleMarks[subject] || [];
      const recordsToSeed = cfg.students.map((st) => {
        const foundSample = sampleList.find((s) => s.roll === st.roll) || {};
        return {
          roll: st.roll,
          studentName: st.name,
          studentId: st.studentId,
          avatar: st.avatar,
          status: foundSample.status || 'present',
          marks: foundSample.marks !== undefined ? foundSample.marks : '85.0',
          remarks: foundSample.remarks || 'Satisfactory academic progress',
        };
      });

      record = await AcademicRecord.create({
        className,
        subject,
        term,
        maxMarks: 100,
        records: recordsToSeed,
      });
    }

    // Always synchronize registered students in this class
    await syncRegisteredStudents(record, className);

    res.json({
      success: true,
      data: record,
      availableClasses: Object.keys(CLASS_CONFIG),
      availableSubjects: cfg.subjects,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/records – Save / Update records
exports.saveRecords = async (req, res) => {
  try {
    const { className, subject, term, maxMarks, records } = req.body;
    if (!className || !subject || !records) {
      return res.status(400).json({ success: false, message: 'Class name, subject, and records are required' });
    }

    let record = await AcademicRecord.findOne({
      className,
      subject,
      term: term || 'Final Examination 2024',
    });

    if (!record) {
      record = new AcademicRecord({
        className,
        subject,
        term: term || 'Final Examination 2024',
      });
    }

    record.maxMarks = maxMarks || 100;
    record.records = records;
    record.lastUpdatedBy = req.user._id;

    await record.save();

    res.json({
      success: true,
      message: 'Academic records saved successfully',
      data: record,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/records/my – Student's personal grade card across all subjects
exports.getMyRecords = async (req, res) => {
  try {
    const studentName = req.user.name;
    const studentClass = req.user.studentClass || 'Grade 10 - Section A';
    const cfg = CLASS_CONFIG[studentClass] || CLASS_CONFIG['Grade 10 - Section A'];

    const studentSubjects = cfg.subjects;
    const reportCard = [];

    for (const subj of studentSubjects) {
      let record = await AcademicRecord.findOne({
        className: studentClass,
        subject: subj,
        term: 'Final Examination 2024',
      });

      if (!record) {
        const sampleList = cfg.sampleMarks[subj] || [];
        const recordsToSeed = cfg.students.map((st) => {
          const foundSample = sampleList.find((s) => s.roll === st.roll) || {};
          return {
            roll: st.roll,
            studentName: st.name,
            studentId: st.studentId,
            avatar: st.avatar,
            status: foundSample.status || 'present',
            marks: foundSample.marks !== undefined ? foundSample.marks : '85.0',
            remarks: foundSample.remarks || 'Satisfactory academic progress',
          };
        });

        record = await AcademicRecord.create({
          className: studentClass,
          subject: subj,
          term: 'Final Examination 2024',
          maxMarks: 100,
          records: recordsToSeed,
        });
      }

      await syncRegisteredStudents(record, studentClass);

      const myEntry = record.records.find(
        (r) =>
          (req.user.studentId && r.studentId === req.user.studentId) ||
          r.studentName.toLowerCase() === studentName.toLowerCase()
      ) || {
        roll: req.user.rollNumber || '001',
        studentName: req.user.name,
        studentId: req.user.studentId || '',
        status: 'present',
        marks: '89.0',
        remarks: 'Consistent analytical effort',
      };

      reportCard.push({
        subject: subj,
        marks: myEntry ? myEntry.marks : 'N/A',
        maxMarks: record.maxMarks,
        status: myEntry ? myEntry.status : 'present',
        remarks: myEntry ? myEntry.remarks : '',
      });
    }

    res.json({
      success: true,
      studentName,
      studentClass,
      studentId: req.user.studentId,
      reportCard,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.CLASS_CONFIG = CLASS_CONFIG;
