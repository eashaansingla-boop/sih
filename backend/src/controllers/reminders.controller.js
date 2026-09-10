const getReminders = async (req, res, next) => {
  return res.status(200).json({ success: true, count: 2, data: [
    { id: 'rem-1', mine: 'Jharia Pit-3', title: 'Weekly Slope Inspection Due', due_date: '2026-09-08' },
    { id: 'rem-2', mine: 'Talcher OCP', title: 'Monthly Dust Suppression Audit Due', due_date: '2026-09-09' },
  ] });
};
const createReminder = async (req, res, next) => res.status(201).json({ success: true, message: 'Reminder created', data: req.body });

module.exports = { getReminders, createReminder };
