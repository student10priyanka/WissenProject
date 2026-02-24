const Employee = require("../models/Employee");
const Team = require("../models/Team");

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, teamId, batch } = req.body;

    const employee = new Employee({
      name,
      email,
      teamId,
      batch
    });

    await employee.save();
    res.status(201).json({ message: "Employee created", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("teamId");
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("teamId");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("teamId");
    res.status(200).json({ message: "Employee updated", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
