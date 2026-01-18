require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_database';

// Import models
const User = require('../models/User');
const Class = require('../models/Class');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Material = require('../models/Material');
const Marks = require('../models/Marks');

// Seed Data
const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Class.deleteMany({}),
      Quiz.deleteMany({}),
      Assignment.deleteMany({}),
      Material.deleteMany({}),
      Marks.deleteMany({})
    ]);

    // Create Users
    console.log('👤 Creating users...');
    
    // Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('   ✓ Admin created: admin@lms.com');

    // Head of Department
    const head = await User.create({
      name: 'Dr. Imran Siddiqui',
      email: 'head@lms.com',
      password: 'head1234',
      role: 'head'
    });
    console.log('   ✓ Head created: head@lms.com');

    // Teachers - Pakistani Names (Rashid Mukhtar as first teacher)
    const teachers = await User.create([
      { name: 'Rashid Mukhtar', email: 'rashid.mukhtar@lms.com', password: 'teacher123', role: 'teacher' },
      { name: 'Dr. Farhan Ahmed', email: 'farhan.ahmed@lms.com', password: 'teacher123', role: 'teacher' },
      { name: 'Prof. Ayesha Khan', email: 'ayesha.khan@lms.com', password: 'teacher123', role: 'teacher' },
      { name: 'Dr. Bilal Hussain', email: 'bilal.hussain@lms.com', password: 'teacher123', role: 'teacher' },
      { name: 'Prof. Sana Malik', email: 'sana.malik@lms.com', password: 'teacher123', role: 'teacher' }
    ]);
    console.log('   ✓ 5 Teachers created');

    // Students - All 43 Pakistani Names
    const studentData = [
      { name: 'Ahmed Ali', email: 'ahmed.ali@lms.com' },
      { name: 'Ahmed Mujtaba', email: 'ahmed.mujtaba@lms.com' },
      { name: 'Ahmed Suleman', email: 'ahmed.suleman@lms.com' },
      { name: 'Umar Hassan', email: 'umar.hassan@lms.com' },
      { name: 'Tumazir Fatima', email: 'tumazir.fatima@lms.com' },
      { name: 'Ahsan Shahid', email: 'ahsan.shahid@lms.com' },
      { name: 'Aman Malik', email: 'aman.malik@lms.com' },
      { name: 'Dawood Iqbal', email: 'dawood.iqbal@lms.com' },
      { name: 'Fahad Khan', email: 'fahad.khan@lms.com' },
      { name: 'Haroon Khalid', email: 'haroon.khalid@lms.com' },
      { name: 'Haseeb Amjad', email: 'haseeb.amjad@lms.com' },
      { name: 'Haseeb Zahid', email: 'haseeb.zahid@lms.com' },
      { name: 'M. Huzaifa', email: 'm.huzaifa@lms.com' },
      { name: 'Ihtisham Islam', email: 'ihtisham.islam@lms.com' },
      { name: 'Kaleem Hassan', email: 'kaleem.hassan@lms.com' },
      { name: 'Mahad Kamran', email: 'mahad.kamran@lms.com' },
      { name: 'Mudassar Akram', email: 'mudassar.akram@lms.com' },
      { name: 'M. Anees', email: 'm.anees@lms.com' },
      { name: 'Mujtaba Ghulam', email: 'mujtaba.ghulam@lms.com' },
      { name: 'Saim Kashmiri', email: 'saim.kashmiri@lms.com' },
      { name: 'Salar Khan', email: 'salar.khan@lms.com' },
      { name: 'Umer Malik', email: 'umer.malik@lms.com' },
      { name: 'Uzair Ahmed', email: 'uzair.ahmed@lms.com' },
      { name: 'Laiba Zahoor', email: 'laiba.zahoor@lms.com' },
      { name: 'Laiba Attique', email: 'laiba.attique@lms.com' },
      { name: 'Laiba Razzaq', email: 'laiba.razzaq@lms.com' },
      { name: 'Areej Iman', email: 'areej.iman@lms.com' },
      { name: 'Awais Naseem', email: 'awais.naseem@lms.com' },
      { name: 'Ayesha Faryad', email: 'ayesha.faryad@lms.com' },
      { name: 'Eman Fatima', email: 'eman.fatima@lms.com' },
      { name: 'Fizza Ch', email: 'fizza.ch@lms.com' },
      { name: 'Hammad Anwar', email: 'hammad.anwar@lms.com' },
      { name: 'Irsa Noor', email: 'irsa.noor@lms.com' },
      { name: 'Meesam Abbas', email: 'meesam.abbas@lms.com' },
      { name: 'Mustafa Zafar', email: 'mustafa.zafar@lms.com' },
      { name: 'Shahid Nabi', email: 'shahid.nabi@lms.com' },
      { name: 'Syeda Aaila', email: 'syeda.aaila@lms.com' },
      { name: 'Syeda Bisma', email: 'syeda.bisma@lms.com' },
      { name: 'Syeda Fareha', email: 'syeda.fareha@lms.com' },
      { name: 'Syeda Zainab', email: 'syeda.zainab@lms.com' },
      { name: 'Maryam Farooq', email: 'maryam.farooq@lms.com' },
      { name: 'Warda Irfan', email: 'warda.irfan@lms.com' },
      { name: 'Amna', email: 'amna@lms.com' }
    ];

const students = await User.create(
  studentData.map(s => ({
    name: s.name,
    email: s.email,
    password: 'student123',
    role: 'student'
  }))
);


    console.log(`   ✓ ${students.length} Students created`);

    // Create Classes - Software Engineering Subjects
    console.log('📚 Creating Software Engineering classes...');
    const classes = await Class.create([
      {
        classname: 'Object Oriented Programming',
        description: 'Learn OOP concepts including classes, objects, inheritance, polymorphism, encapsulation, and abstraction using C++ and Java.',
        section: 'BSE-6A',
        teacher: teachers[0]._id, // Rashid Mukhtar
        students: students.slice(0, 15).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Data Structures & Algorithms',
        description: 'Comprehensive study of data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching, dynamic programming).',
        section: 'BSE-6A',
        teacher: teachers[1]._id, // Dr. Farhan Ahmed
        students: students.slice(0, 15).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Software Engineering',
        description: 'Software development lifecycle, agile methodologies, requirements engineering, design patterns, and project management.',
        section: 'BSE-6A',
        teacher: teachers[2]._id, // Prof. Ayesha Khan
        students: students.slice(0, 15).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Database Systems',
        description: 'Relational database design, SQL, normalization, indexing, transactions, and introduction to NoSQL databases.',
        section: 'BSE-6A',
        teacher: teachers[3]._id, // Dr. Bilal Hussain
        students: students.slice(15, 30).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Web Engineering',
        description: 'Full-stack web development with HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB.',
        section: 'BSE-6B',
        teacher: teachers[0]._id, // Rashid Mukhtar
        students: students.slice(15, 30).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Operating Systems',
        description: 'Process management, memory management, file systems, CPU scheduling, and synchronization mechanisms.',
        section: 'BSE-6B',
        teacher: teachers[4]._id, // Prof. Sana Malik
        students: students.slice(30).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Computer Networks',
        description: 'OSI model, TCP/IP, routing protocols, network security, and socket programming.',
        section: 'BSE-6B',
        teacher: teachers[1]._id, // Dr. Farhan Ahmed
        students: students.slice(30).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      },
      {
        classname: 'Software Design & Architecture',
        description: 'Design patterns, architectural patterns, UML diagrams, and software quality attributes.',
        section: 'BSE-6A',
        teacher: teachers[2]._id, // Prof. Ayesha Khan
        students: students.slice(0, 22).map(s => s._id),
        semester: 'Fall 2025',
        academicYear: '2025'
      }
    ]);
    console.log(`   ✓ ${classes.length} Classes created`);

    // Update user assigned classes
    console.log('🔗 Linking users to classes...');
    for (const cls of classes) {
      await User.updateOne(
        { _id: cls.teacher },
        { $addToSet: { assignedClasses: cls._id } }
      );
      await User.updateMany(
        { _id: { $in: cls.students } },
        { $addToSet: { assignedClasses: cls._id } }
      );
    }

    // Create Quizzes
    console.log('📝 Creating quizzes...');
    const quizzes = await Quiz.create([
      {
        classId: classes[0]._id, // OOP
        title: 'OOP Fundamentals Quiz',
        description: 'Test your understanding of Object Oriented Programming concepts',
        questions: [
          { question: 'What is encapsulation?', options: ['Hiding implementation details', 'Inheriting properties', 'Creating objects', 'Overloading methods'], answer: 'Hiding implementation details', points: 2 },
          { question: 'Which keyword is used for inheritance in Java?', options: ['inherits', 'extends', 'implements', 'super'], answer: 'extends', points: 2 },
          { question: 'What is polymorphism?', options: ['One interface, multiple implementations', 'Multiple inheritance', 'Data hiding', 'Object creation'], answer: 'One interface, multiple implementations', points: 2 },
          { question: 'What is an abstract class?', options: ['A class that cannot be instantiated', 'A class with no methods', 'A final class', 'A static class'], answer: 'A class that cannot be instantiated', points: 2 },
          { question: 'Which is NOT an OOP principle?', options: ['Abstraction', 'Encapsulation', 'Compilation', 'Inheritance'], answer: 'Compilation', points: 2 }
        ],
        timeLimit: 15,
        isPublished: true,
        createdBy: teachers[0]._id
      },
      {
        classId: classes[1]._id, // DSA
        title: 'Data Structures Quiz',
        description: 'Test your knowledge of data structures',
        questions: [
          { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 'O(log n)', points: 3 },
          { question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 'Stack', points: 3 },
          { question: 'What is a balanced binary tree?', options: ['All leaves at same level', 'Height difference ≤ 1', 'Complete tree', 'Full tree'], answer: 'Height difference ≤ 1', points: 3 },
          { question: 'Which sorting algorithm has best average case?', options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], answer: 'Quick Sort', points: 3 },
          { question: 'What is a graph with no cycles called?', options: ['Tree', 'DAG', 'Forest', 'All of above'], answer: 'All of above', points: 3 }
        ],
        timeLimit: 20,
        isPublished: true,
        createdBy: teachers[1]._id
      },
      {
        classId: classes[2]._id, // SE
        title: 'Software Engineering Concepts',
        description: 'SDLC and Agile methodology quiz',
        questions: [
          { question: 'What does SDLC stand for?', options: ['Software Development Life Cycle', 'System Design Life Cycle', 'Software Design Logic Control', 'System Development Logic Cycle'], answer: 'Software Development Life Cycle', points: 2 },
          { question: 'Which is NOT an Agile methodology?', options: ['Scrum', 'Kanban', 'Waterfall', 'XP'], answer: 'Waterfall', points: 2 },
          { question: 'What is a sprint in Scrum?', options: ['A meeting', 'A time-boxed iteration', 'A document', 'A role'], answer: 'A time-boxed iteration', points: 2 },
          { question: 'Who is the Product Owner?', options: ['Developer', 'Stakeholder representative', 'Tester', 'Manager'], answer: 'Stakeholder representative', points: 2 },
          { question: 'What is technical debt?', options: ['Project budget', 'Shortcuts in code', 'Hardware cost', 'Team salary'], answer: 'Shortcuts in code', points: 2 }
        ],
        timeLimit: 15,
        isPublished: true,
        createdBy: teachers[2]._id
      },
      {
        classId: classes[3]._id, // Database
        title: 'Database Fundamentals',
        description: 'SQL and database design concepts',
        questions: [
          { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], answer: 'Structured Query Language', points: 2 },
          { question: 'Which is a DDL command?', options: ['SELECT', 'INSERT', 'CREATE', 'UPDATE'], answer: 'CREATE', points: 2 },
          { question: 'What is normalization?', options: ['Adding redundancy', 'Removing redundancy', 'Creating indexes', 'Joining tables'], answer: 'Removing redundancy', points: 2 },
          { question: 'What is a primary key?', options: ['Any column', 'Unique identifier', 'Foreign reference', 'Index column'], answer: 'Unique identifier', points: 2 },
          { question: 'Which normal form removes transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: '3NF', points: 2 }
        ],
        timeLimit: 15,
        isPublished: true,
        createdBy: teachers[3]._id
      },
      {
        classId: classes[4]._id, // Web Engineering
        title: 'Web Development Basics',
        description: 'HTML, CSS, JavaScript fundamentals',
        questions: [
          { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language'], answer: 'Hyper Text Markup Language', points: 2 },
          { question: 'Which is a JavaScript framework?', options: ['Django', 'React', 'Laravel', 'Flask'], answer: 'React', points: 2 },
          { question: 'What is the DOM?', options: ['Document Object Model', 'Data Object Model', 'Document Order Model', 'Digital Object Model'], answer: 'Document Object Model', points: 2 },
          { question: 'CSS stands for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], answer: 'Cascading Style Sheets', points: 2 },
          { question: 'What is REST API?', options: ['A database', 'An architectural style', 'A programming language', 'A framework'], answer: 'An architectural style', points: 2 }
        ],
        timeLimit: 15,
        isPublished: true,
        createdBy: teachers[0]._id
      }
    ]);
    console.log(`   ✓ ${quizzes.length} Quizzes created`);

    // Add quiz submissions for some students
    console.log('✍️  Adding quiz submissions...');
    for (let i = 0; i < 5; i++) {
      const quiz = quizzes[i];
      const classStudents = classes[i].students.slice(0, 5);
      
      for (const studentId of classStudents) {
        const answers = quiz.questions.map((q, idx) => ({
          questionId: q._id,
          selectedAnswer: Math.random() > 0.3 ? q.answer : q.options[0],
          isCorrect: Math.random() > 0.3
        }));
        
        const correctCount = answers.filter(a => a.isCorrect).length;
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        const marks = Math.round((correctCount / quiz.questions.length) * totalPoints);
        
        quiz.submissions.push({
          studentId,
          answers,
          marks,
          totalPoints,
          percentage: (marks / totalPoints) * 100,
          submittedAt: new Date()
        });
      }
      await quiz.save();
    }

    // Create Assignments
    console.log('📋 Creating assignments...');
    const assignments = await Assignment.create([
      {
        classId: classes[0]._id,
        title: 'OOP Project - Banking System',
        description: 'Design and implement a banking system using OOP principles. Include classes for Account, Customer, Transaction, and Bank.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        totalMarks: 100,
        createdBy: teachers[0]._id
      },
      {
        classId: classes[1]._id,
        title: 'DSA Assignment - Sorting Algorithms',
        description: 'Implement and compare the performance of Quick Sort, Merge Sort, and Heap Sort with different input sizes.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        totalMarks: 50,
        createdBy: teachers[1]._id
      },
      {
        classId: classes[2]._id,
        title: 'SE Assignment - Requirements Document',
        description: 'Create a Software Requirements Specification (SRS) document for a university management system.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalMarks: 50,
        createdBy: teachers[2]._id
      },
      {
        classId: classes[3]._id,
        title: 'Database Design Project',
        description: 'Design an ER diagram and implement a normalized database for an e-commerce platform.',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        totalMarks: 100,
        createdBy: teachers[3]._id
      },
      {
        classId: classes[4]._id,
        title: 'Full Stack Web Application',
        description: 'Build a complete MERN stack application with authentication, CRUD operations, and responsive design.',
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        totalMarks: 150,
        createdBy: teachers[0]._id
      },
      {
        classId: classes[5]._id,
        title: 'OS Lab - Process Scheduling',
        description: 'Implement FCFS, SJF, and Round Robin scheduling algorithms and compare their performance.',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        totalMarks: 75,
        createdBy: teachers[4]._id
      }
    ]);
    console.log(`   ✓ ${assignments.length} Assignments created`);

    // Create Materials
    console.log('📖 Creating materials...');
    const materials = await Material.create([
      {
        classId: classes[0]._id,
        title: 'OOP Lecture 1 - Introduction to Classes',
        description: 'Introduction to classes, objects, and basic OOP concepts',
        fileUrl: '/uploads/materials/oop-lecture-1.pdf',
        fileName: 'oop-lecture-1.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[0]._id,
        type: 'lecture',
        weekNumber: 1
      },
      {
        classId: classes[0]._id,
        title: 'OOP Lecture 2 - Inheritance & Polymorphism',
        description: 'Deep dive into inheritance and polymorphism',
        fileUrl: '/uploads/materials/oop-lecture-2.pdf',
        fileName: 'oop-lecture-2.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[0]._id,
        type: 'lecture',
        weekNumber: 2
      },
      {
        classId: classes[1]._id,
        title: 'DSA - Arrays and Linked Lists',
        description: 'Understanding linear data structures',
        fileUrl: '/uploads/materials/dsa-arrays.pdf',
        fileName: 'dsa-arrays.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[1]._id,
        type: 'lecture',
        weekNumber: 1
      },
      {
        classId: classes[1]._id,
        title: 'DSA - Trees and Graphs',
        description: 'Non-linear data structures',
        fileUrl: '/uploads/materials/dsa-trees.pdf',
        fileName: 'dsa-trees.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[1]._id,
        type: 'lecture',
        weekNumber: 3
      },
      {
        classId: classes[2]._id,
        title: 'SDLC Models Overview',
        description: 'Waterfall, Agile, Spiral, and V-Model',
        fileUrl: '/uploads/materials/sdlc-models.pdf',
        fileName: 'sdlc-models.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[2]._id,
        type: 'lecture',
        weekNumber: 1
      },
      {
        classId: classes[3]._id,
        title: 'SQL Fundamentals',
        description: 'DDL, DML, and DCL commands',
        fileUrl: '/uploads/materials/sql-basics.pdf',
        fileName: 'sql-basics.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[3]._id,
        type: 'lecture',
        weekNumber: 1
      },
      {
        classId: classes[4]._id,
        title: 'React.js Fundamentals',
        description: 'Components, Props, State, and Hooks',
        fileUrl: '/uploads/materials/react-basics.pdf',
        fileName: 'react-basics.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[0]._id,
        type: 'lecture',
        weekNumber: 4
      },
      {
        classId: classes[5]._id,
        title: 'Process Management',
        description: 'Process states, PCB, and context switching',
        fileUrl: '/uploads/materials/os-process.pdf',
        fileName: 'os-process.pdf',
        fileType: 'application/pdf',
        uploadedBy: teachers[4]._id,
        type: 'lecture',
        weekNumber: 2
      }
    ]);
    console.log(`   ✓ ${materials.length} Materials created`);

    // Create Marks
    console.log('📊 Creating marks...');
    const marksData = [];
    
    // Add marks for first 10 students in class 0 (OOP)
    for (let i = 0; i < 10; i++) {
      marksData.push({
        studentId: students[i]._id,
        classId: classes[0]._id,
        type: 'quiz',
        title: 'OOP Quiz 1',
        marks: Math.floor(Math.random() * 20) + 30,
        totalMarks: 50,
        remarks: 'Good effort'
      });
      marksData.push({
        studentId: students[i]._id,
        classId: classes[0]._id,
        type: 'assignment',
        title: 'OOP Assignment 1',
        marks: Math.floor(Math.random() * 30) + 60,
        totalMarks: 100,
        remarks: 'Well done'
      });
    }

    // Add marks for students in class 1 (DSA)
    for (let i = 0; i < 10; i++) {
      marksData.push({
        studentId: students[i]._id,
        classId: classes[1]._id,
        type: 'quiz',
        title: 'DSA Quiz 1',
        marks: Math.floor(Math.random() * 15) + 25,
        totalMarks: 50,
        remarks: 'Keep improving'
      });
    }

    // Add marks for students in class 3 (Database)
    for (let i = 15; i < 25; i++) {
      marksData.push({
        studentId: students[i]._id,
        classId: classes[3]._id,
        type: 'midterm',
        title: 'Database Midterm',
        marks: Math.floor(Math.random() * 30) + 50,
        totalMarks: 100,
        remarks: 'Good understanding'
      });
    }

    const marks = await Marks.create(marksData);
    console.log(`   ✓ ${marks.length} Marks entries created`);

    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 LOGIN CREDENTIALS:\n');
    console.log('┌─────────────┬──────────────────────────┬──────────────┐');
    console.log('│ Role        │ Email                    │ Password     │');
    console.log('├─────────────┼──────────────────────────┼──────────────┤');
    console.log('│ Admin       │ admin@lms.com            │ admin123     │');
    console.log('│ Head        │ head@lms.com             │ head1234     │');
    console.log('│ Teacher     │ rashid.mukhtar@lms.com   │ teacher123   │');
    console.log('│ Teacher     │ farhan.ahmed@lms.com     │ teacher123   │');
    console.log('│ Teacher     │ ayesha.khan@lms.com      │ teacher123   │');
    console.log('│ Student     │ ahmed.ali@lms.com        │ student123   │');
    console.log('│ Student     │ umar.hassan@lms.com      │ student123   │');
    console.log('│ Student     │ laiba.zahoor@lms.com     │ student123   │');
    console.log('└─────────────┴──────────────────────────┴──────────────┘');
    console.log('\n📊 DATA SUMMARY:');
    console.log(`   • Users: 1 Admin, 1 Head, 5 Teachers, ${students.length} Students`);
    console.log(`   • Classes: ${classes.length} Software Engineering courses`);
    console.log(`   • Quizzes: ${quizzes.length}`);
    console.log(`   • Assignments: ${assignments.length}`);
    console.log(`   • Materials: ${materials.length}`);
    console.log(`   • Marks: ${marks.length} entries`);
    console.log('\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
