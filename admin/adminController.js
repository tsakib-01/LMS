// controllers/adminController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');

/**
 * PUT /admin/assignstudent/:id
 * Body: { studentId } OR { studentIds: [id1, id2, ...] }
 * :id is classId
 */
exports.assignStudentsToClass = async (req, res) => {
  const classId = req.params.id;
  let { studentId, studentIds } = req.body;

  // Normalize to array
  let studentsToAssign = [];
  if (Array.isArray(studentIds) && studentIds.length > 0) {
    studentsToAssign = studentIds;
  } else if (studentId) {
    studentsToAssign = [studentId];
  } else {
    return res.status(400).json({ message: 'Provide studentId or studentIds in request body' });
  }

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    return res.status(400).json({ message: 'Invalid class id' });
  }
  const invalidId = studentsToAssign.some(id => !mongoose.Types.ObjectId.isValid(id));
  if (invalidId) return res.status(400).json({ message: 'One or more invalid student ids' });

  // Ensure class exists
  const cls = await Class.findById(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });

  // Filter students that exist and have role 'student'
  const studentDocs = await User.find({ _id: { $in: studentsToAssign }, role: 'student' }).select('_id name email');
  if (!studentDocs.length) {
    return res.status(404).json({ message: 'No valid student users found for provided ids' });
  }

  const foundIds = studentDocs.map(s => s._id);

  // Start a session to ensure both updates happen atomically (requires replica set for true transactions)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Add students to Class.students using $addToSet to avoid duplicates
    await Class.updateOne(
      { _id: classId },
      { $addToSet: { students: { $each: foundIds } } },
      { session }
    );

    // 2) Add classId to each User.assignedClasses (also $addToSet to avoid duplicates)
    await User.updateMany(
      { _id: { $in: foundIds } },
      { $addToSet: { assignedClasses: mongoose.Types.ObjectId(classId) } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Return updated class (populated)
    const updatedClass = await Class.findById(classId)
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    return res.status(200).json({
      message: 'Students assigned to class successfully',
      class: updatedClass,
      studentsAssigned: foundIds.map(id => id.toString())
    });
  } catch (err) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error assigning students to class:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
