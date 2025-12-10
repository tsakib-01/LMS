Admin routes must be here
// Fizzah Chaudhary (SP23-BSE-013) GET /admin/ - Renders admin dashboard with totals
router.get('/', async (req, res) => {
  try {
    const [classesCount, teachersCount, studentsCount] = await Promise.all([
      ClassModel.countDocuments({}),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' })
    ]);

    return res.render('admin/dashboard', {
      totals: {
        classes: classesCount,
        teachers: teachersCount,
        students: studentsCount
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).send('Server Error');
  }
});
