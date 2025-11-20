const db = require('../config/db');
const { taskValidation } = require('../middleware/validation');

const createTask = (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, status } = req.body;
  const createdBy = req.user.id;

  db.run(
    `INSERT INTO tasks (title, description, status, createdBy) 
     VALUES (?, ?, ?, ?)`,
    [title, description || '', status || 'pending', createdBy],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating task' });
      }

      db.get(
        `SELECT t.*, u.username as createdByName 
         FROM tasks t 
         JOIN users u ON t.createdBy = u.id 
         WHERE t.id = ?`,
        [this.lastID],
        (err, task) => {
          if (err) {
            return res.status(500).json({ message: 'Error fetching task' });
          }
          res.status(201).json(task);
        }
      );
    }
  );
};

const getTasks = (req, res) => {
  let query = `
    SELECT t.*, u.username as createdByName 
    FROM tasks t 
    JOIN users u ON t.createdBy = u.id
  `;
  let params = [];

  if (req.user.role !== 'admin') {
    query += ' WHERE t.createdBy = ?';
    params = [req.user.id];
  }

  query += ' ORDER BY t.createdAt DESC';

  db.all(query, params, (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    res.json(tasks);
  });
};

const getTaskById = (req, res) => {
  let query = `
    SELECT t.*, u.username as createdByName 
    FROM tasks t 
    JOIN users u ON t.createdBy = u.id 
    WHERE t.id = ?
  `;
  let params = [req.params.id];

  if (req.user.role !== 'admin') {
    query += ' AND t.createdBy = ?';
    params.push(req.user.id);
  }

  db.get(query, params, (err, task) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching task' });
    }
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  });
};

const updateTask = (req, res) => {
  const { error } = taskValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, status } = req.body;
  
  // Check if task exists and user has permission
  let checkQuery = 'SELECT * FROM tasks WHERE id = ?';
  let checkParams = [req.params.id];

  if (req.user.role !== 'admin') {
    checkQuery += ' AND createdBy = ?';
    checkParams.push(req.user.id);
  }

  db.get(checkQuery, checkParams, (err, task) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task
    db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description || '', status || 'pending', req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error updating task' });
        }

        db.get(
          `SELECT t.*, u.username as createdByName 
           FROM tasks t 
           JOIN users u ON t.createdBy = u.id 
           WHERE t.id = ?`,
          [req.params.id],
          (err, updatedTask) => {
            if (err) {
              return res.status(500).json({ message: 'Error fetching updated task' });
            }
            res.json(updatedTask);
          }
        );
      }
    );
  });
};

const deleteTask = (req, res) => {
  let query = 'DELETE FROM tasks WHERE id = ?';
  let params = [req.params.id];

  if (req.user.role !== 'admin') {
    query += ' AND createdBy = ?';
    params.push(req.user.id);
  }

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting task' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};