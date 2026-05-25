import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, User, Clock, 
    CheckCircle2, RotateCcw, AlertTriangle, Briefcase, FileText,
    Users, Building2, Award, Calendar, HelpCircle, FileCheck,
    DollarSign, CalendarDays, UserPlus, Star, ShieldAlert,
    TrendingUp, FileSpreadsheet, Download, RefreshCw, X, Check, Printer
} from 'lucide-react';
import '../inventory-pages-custom.css';

// ==========================================
// INITIAL SEED DATA
// ==========================================

const initialEmployees = [
    { id: 'EMP-001', name: 'Ramesh Patil', phone: '9876543210', email: 'ramesh.patil@namustute.com', address: '123, Production Line Road, Pune', dept: 'Production', designation: 'Supervisor', salary: 35000, shift: 'Morning Shift', emergencyContact: 'Suresh Patil (Brother) - 9876543211', joiningDate: '2023-04-12', active: 'Present' },
    { id: 'EMP-002', name: 'Sanjay Deshmukh', phone: '9876543212', email: 'sanjay.deshmukh@namustute.com', address: '45, Sales Lane, Mumbai', dept: 'Sales', designation: 'Manager', salary: 55000, shift: 'Rotational Shift', emergencyContact: 'Sunita Deshmukh (Wife) - 9876543213', joiningDate: '2022-01-15', active: 'Absent' },
    { id: 'EMP-003', name: 'Vikram Joshi', phone: '9876543214', email: 'vikram.joshi@namustute.com', address: '78, Accounts St, Pune', dept: 'Accounts', designation: 'Accountant', salary: 42000, shift: 'Morning Shift', emergencyContact: 'Meena Joshi (Mother) - 9876543215', joiningDate: '2024-02-10', active: 'Present' },
    { id: 'EMP-004', name: 'Anita Deshpukh', phone: '9876543216', email: 'anita.d@namustute.com', address: '89, Warehouse Rd, Thane', dept: 'Warehouse', designation: 'Store Keeper', salary: 28000, shift: 'Morning Shift', emergencyContact: 'Gopal Deshpukh (Father) - 9876543217', joiningDate: '2023-11-01', active: 'Present' },
    { id: 'EMP-005', name: 'Rahul Mehta', phone: '9876543218', email: 'rahul.mehta@namustute.com', address: '12, Admin Ave, Pune', dept: 'Admin', designation: 'Manager', salary: 48000, shift: 'Morning Shift', emergencyContact: 'Karan Mehta (Brother) - 9876543219', joiningDate: '2021-08-20', active: 'Present' },
    { id: 'EMP-006', name: 'Priya Sharma', phone: '9876543220', email: 'priya.sharma@namustute.com', address: '4, HR Street, Mumbai', dept: 'HR', designation: 'Manager', salary: 45000, shift: 'Morning Shift', emergencyContact: 'Ravi Sharma (Husband) - 9876543221', joiningDate: '2022-09-01', active: 'Present' },
    { id: 'EMP-007', name: 'Karan Singh', phone: '9876543222', email: 'karan.singh@namustute.com', address: '56, Factory Rd, Pune', dept: 'Production', designation: 'Machine Operator', salary: 22000, shift: 'Evening Shift', emergencyContact: 'Prem Singh (Father) - 9876543223', joiningDate: '2025-01-10', active: 'Present' },
    { id: 'EMP-008', name: 'Sunil Verma', phone: '9876543224', email: 'sunil.v@namustute.com', address: '88, Retail Lane, Pune', dept: 'Sales', designation: 'Supervisor', salary: 31000, shift: 'Morning Shift', emergencyContact: 'Asha Verma (Mother) - 9876543225', joiningDate: '2024-05-15', active: 'Present' },
    { id: 'EMP-009', name: 'Deepa Rao', phone: '9876543226', email: 'deepa.rao@namustute.com', address: '12, Ledger St, Mumbai', dept: 'Accounts', designation: 'Accountant', salary: 38000, shift: 'Morning Shift', emergencyContact: 'K. Rao (Father) - 9876543227', joiningDate: '2023-07-20', active: 'Present' },
    { id: 'EMP-010', name: 'Vinay Kumar', phone: '9876543228', email: 'vinay.k@namustute.com', address: '99, Cargo St, Thane', dept: 'Warehouse', designation: 'Supervisor', salary: 29000, shift: 'Night Shift', emergencyContact: 'Rita Kumar (Wife) - 9876543229', joiningDate: '2024-10-05', active: 'Present' },
    { id: 'EMP-011', name: 'Megha Gupta', phone: '9876543230', email: 'megha.gupta@namustute.com', address: '22, Talent Rd, Pune', dept: 'HR', designation: 'Supervisor', salary: 33000, shift: 'Morning Shift', emergencyContact: 'Amit Gupta (Brother) - 9876543231', joiningDate: '2024-03-01', active: 'Present' },
    { id: 'EMP-012', name: 'Sandeep Joshi', phone: '9876543232', email: 'sandeep.j@namustute.com', address: '77, Press Line, Pune', dept: 'Production', designation: 'Machine Operator', salary: 21000, shift: 'Evening Shift', emergencyContact: 'Anil Joshi (Father) - 9876543233', joiningDate: '2025-02-15', active: 'Present' }
];

const initialDepartments = [
    { id: 'DEPT-01', name: 'Production', head: 'Ramesh Patil' },
    { id: 'DEPT-02', name: 'Sales', head: 'Sanjay Deshmukh' },
    { id: 'DEPT-03', name: 'Accounts', head: 'Vikram Joshi' },
    { id: 'DEPT-04', name: 'HR', head: 'Priya Sharma' },
    { id: 'DEPT-05', name: 'Warehouse', head: 'Anita Deshpukh' },
    { id: 'DEPT-06', name: 'Admin', head: 'Rahul Mehta' }
];

const initialDesignations = [
    { id: 'DESG-01', title: 'Manager', grade: 'Grade A', baseSalary: 50000 },
    { id: 'DESG-02', title: 'Supervisor', grade: 'Grade B', baseSalary: 35000 },
    { id: 'DESG-03', title: 'Machine Operator', grade: 'Grade C', baseSalary: 20000 },
    { id: 'DESG-04', title: 'Accountant', grade: 'Grade B', baseSalary: 40000 },
    { id: 'DESG-05', title: 'Store Keeper', grade: 'Grade C', baseSalary: 25000 }
];

const initialAttendance = [
    { empId: 'EMP-001', name: 'Ramesh Patil', date: '2026-05-25', timeIn: '08:58 AM', timeOut: '05:05 PM', status: 'Present', late: false },
    { empId: 'EMP-003', name: 'Vikram Joshi', date: '2026-05-25', timeIn: '09:15 AM', timeOut: '05:00 PM', status: 'Present', late: true },
    { empId: 'EMP-004', name: 'Anita Deshpukh', date: '2026-05-25', timeIn: '08:55 AM', timeOut: '05:02 PM', status: 'Present', late: false },
    { empId: 'EMP-005', name: 'Rahul Mehta', date: '2026-05-25', timeIn: '09:02 AM', timeOut: '05:00 PM', status: 'Present', late: false }
];

const initialLeaves = [
    { id: 'LV-101', name: 'Sanjay Deshmukh', type: 'Casual Leave', start: '2026-05-24', end: '2026-05-26', days: 3, reason: 'Family Function', status: 'Approved' },
    { id: 'LV-102', name: 'Anita Deshpukh', type: 'Sick Leave', start: '2026-05-28', end: '2026-05-29', days: 2, reason: 'Dental Treatment', status: 'Pending' },
    { id: 'LV-103', name: 'Ramesh Patil', type: 'Paid Leave', start: '2026-06-05', end: '2026-06-12', days: 8, reason: 'Annual Vacation', status: 'Pending' }
];

const initialLeaveBalances = {
    'EMP-001': { sick: 8, casual: 6, paid: 12 },
    'EMP-002': { sick: 10, casual: 4, paid: 15 },
    'EMP-003': { sick: 12, casual: 8, paid: 18 },
    'EMP-004': { sick: 7, casual: 5, paid: 10 },
    'EMP-005': { sick: 9, casual: 7, paid: 14 }
};

const initialShifts = [
    { id: 'SH-01', name: 'Morning Shift', timing: '06:00 AM - 02:00 PM', type: 'Regular' },
    { id: 'SH-02', name: 'Evening Shift', timing: '02:00 PM - 10:00 PM', type: 'Regular' },
    { id: 'SH-03', name: 'Night Shift', timing: '10:00 PM - 06:00 AM', type: 'Regular' },
    { id: 'SH-04', name: 'Rotational Shift', timing: 'Rotates Weekly', type: 'Flexible' }
];

const initialJobs = [
    { id: 'JOB-01', title: 'Senior Molding Operator', dept: 'Production', openings: 2, status: 'Active' },
    { id: 'JOB-02', title: 'HR Executive', dept: 'HR', openings: 1, status: 'Active' },
    { id: 'JOB-03', title: 'Warehouse Associate', dept: 'Warehouse', openings: 4, status: 'Closed' }
];

const initialCandidates = [
    { id: 'CAN-101', name: 'Amit Sharma', job: 'Senior Molding Operator', stage: 'Interviewing', score: 85, phone: '9812345670', email: 'amit.s@gmail.com' },
    { id: 'CAN-102', name: 'Priti Patel', job: 'HR Executive', stage: 'Offered', score: 92, phone: '9812345671', email: 'priti.p@gmail.com' },
    { id: 'CAN-103', name: 'Raj Kumar', job: 'Senior Molding Operator', stage: 'Applied', score: 70, phone: '9812345672', email: 'raj.k@gmail.com' }
];

const initialPerformance = [
    { empId: 'EMP-001', name: 'Ramesh Patil', kpi: 'Safety Compliance', rating: 5, productivity: 95, comments: 'Excellent execution under pressure' },
    { empId: 'EMP-002', name: 'Sanjay Deshmukh', kpi: 'Sales Quota Achieved', rating: 4, productivity: 78, comments: 'Good, but needs focus on followups' },
    { empId: 'EMP-003', name: 'Vikram Joshi', kpi: 'Audit Integrity', rating: 5, productivity: 90, comments: 'Very meticulous accountant' },
    { empId: 'EMP-004', name: 'Anita Deshpukh', kpi: 'Stock Organization', rating: 4, productivity: 88, comments: 'Keeps store in great order' },
    { empId: 'EMP-005', name: 'Rahul Mehta', kpi: 'Resource Operations', rating: 4, productivity: 85, comments: 'Reliable admin manager' }
];

const initialDocuments = [
    { empId: 'EMP-001', name: 'Ramesh Patil', type: 'Aadhaar', status: 'Verified', fileName: 'aadhar_ramesh.pdf', date: '2023-04-15' },
    { empId: 'EMP-001', name: 'Ramesh Patil', type: 'PAN', status: 'Verified', fileName: 'pan_ramesh.pdf', date: '2023-04-15' },
    { empId: 'EMP-002', name: 'Sanjay Deshmukh', type: 'Resume', status: 'Verified', fileName: 'resume_sanjay.pdf', date: '2022-01-16' },
    { empId: 'EMP-003', name: 'Vikram Joshi', type: 'Certificates', status: 'Pending', fileName: 'degree_vikram.pdf', date: '2024-02-12' },
    { empId: 'EMP-004', name: 'Anita Deshpukh', type: 'Agreements', status: 'Verified', fileName: 'joining_agreement_anita.pdf', date: '2023-11-02' }
];

const initialExpenses = [
    { id: 'EXP-501', name: 'Ramesh Patil', type: 'Travel Expense', amount: 3500, description: 'Client workshop travel to Mumbai', date: '2026-05-10', status: 'Approved' },
    { id: 'EXP-502', name: 'Sanjay Deshmukh', type: 'Food Expense', amount: 1200, description: 'Sales team dinner with prospect', date: '2026-05-18', status: 'Pending' },
    { id: 'EXP-503', name: 'Vikram Joshi', type: 'Travel Expense', amount: 800, description: 'Bank audit site transit', date: '2026-05-22', status: 'Pending' }
];

export default function HRModule() {
    // Left Menu active module navigation
    const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'departments', 'designations', 'attendance', 'leaves', 'payroll', 'shifts', 'recruitment', 'performance', 'documents', 'expenses', 'reports'
    
    // Core state lists
    const [employees, setEmployees] = useState(initialEmployees);
    const [departments, setDepartments] = useState(initialDepartments);
    const [designations, setDesignations] = useState(initialDesignations);
    const [attendance, setAttendance] = useState(initialAttendance);
    const [leaves, setLeaves] = useState(initialLeaves);
    const [leaveBalances, setLeaveBalances] = useState(initialLeaveBalances);
    const [shifts, setShifts] = useState(initialShifts);
    const [jobs, setJobs] = useState(initialJobs);
    const [candidates, setCandidates] = useState(initialCandidates);
    const [performance, setPerformance] = useState(initialPerformance);
    const [documents, setDocuments] = useState(documentsListFiltered() || initialDocuments);
    const [expenses, setExpenses] = useState(initialExpenses);

    function documentsListFiltered() {
        return initialDocuments;
    }

    // Global Search & Filtering States
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');

    // Employees Table Pagination States
    const [empCurrentPage, setEmpCurrentPage] = useState(1);
    const empPageSize = 10;

    // Reset pagination page to 1 when filters or searches change
    React.useEffect(() => {
        setEmpCurrentPage(1);
    }, [searchTerm, deptFilter]);

    // Attendance punch states
    const [hasPunchedToday, setHasPunchedToday] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [qrScannerVisible, setQrScannerVisible] = useState(false);

    // Document Upload Simulation state
    const [uploadingDoc, setUploadingDoc] = useState(false);

    // Selected items for view/detail modals
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);
    
    // Interactive Forms visibility & models
    const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
    const [isAddDesgOpen, setIsAddDesgOpen] = useState(false);
    const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
    const [isAddJobOpen, setIsAddJobOpen] = useState(false);
    const [isAddCandOpen, setIsAddCandOpen] = useState(false);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

    // Individual interactive forms states
    const [newEmp, setNewEmp] = useState({ name: '', phone: '', email: '', address: '', dept: 'Production', designation: 'Supervisor', salary: '', shift: 'Morning Shift', emergencyContact: '', joiningDate: new Date().toISOString().split('T')[0], active: 'Present' });
    const [newDept, setNewDept] = useState({ name: '', head: '' });
    const [newDesg, setNewDesg] = useState({ title: '', grade: 'Grade B', baseSalary: '' });
    const [newLeave, setNewLeave] = useState({ name: 'Ramesh Patil', type: 'Casual Leave', start: '', end: '', reason: '' });
    const [newJob, setNewJob] = useState({ title: '', dept: 'Production', openings: 1 });
    const [newCand, setNewCand] = useState({ name: '', job: 'Senior Molding Operator', phone: '', email: '' });
    const [newReview, setNewReview] = useState({ empId: 'EMP-001', kpi: '', rating: 5, productivity: 85, comments: '' });
    const [newExpense, setNewExpense] = useState({ name: 'Ramesh Patil', type: 'Travel Expense', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    const [newDoc, setNewDoc] = useState({ empId: 'EMP-001', type: 'Aadhaar', fileName: '' });

    // Interactive Payroll adjustments
    const [selectedPayEmpId, setSelectedPayEmpId] = useState('EMP-001');
    const [overtimeHours, setOvertimeHours] = useState(10);
    const [monthlyBonus, setMonthlyBonus] = useState(3000);
    const [monthlyDeduction, setMonthlyDeduction] = useState(1000);

    // Toast alert states
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // Calculate dynamic stats
    const totalEmployeesCount = employees.length;
    const activeDeptsCount = departments.length;
    const presentTodayCount = attendance.filter(a => a.status === 'Present').length;
    const pendingActionsCount = leaves.filter(l => l.status === 'Pending').length + expenses.filter(e => e.status === 'Pending').length;

    // Helper: Dynamic Department Employee count
    const getDeptCount = (deptName) => {
        return employees.filter(e => e.dept.toLowerCase() === deptName.toLowerCase()).length;
    };

    // Dynamic Attendance Rate
    const attendanceRate = Math.round((presentTodayCount / (totalEmployeesCount || 1)) * 100);

    // ==========================================
    // DATA HANDLERS & OPERATIONS
    // ==========================================

    const handleAddEmployee = (e) => {
        e.preventDefault();
        const nextId = `EMP-0${employees.length + 1}`;
        const added = { ...newEmp, id: nextId };
        setEmployees([...employees, added]);
        
        // Setup initial leave balances for new employee
        setLeaveBalances(prev => ({
            ...prev,
            [nextId]: { sick: 10, casual: 8, paid: 15 }
        }));

        setIsAddEmpOpen(false);
        setNewEmp({ name: '', phone: '', email: '', address: '', dept: 'Production', designation: 'Supervisor', salary: '', shift: 'Morning Shift', emergencyContact: '', joiningDate: new Date().toISOString().split('T')[0], active: 'Present' });
        showToast(`Staff member ${added.name} successfully registered with ID ${nextId}!`);
    };

    const handleAddDepartment = (e) => {
        e.preventDefault();
        const nextId = `DEPT-0${departments.length + 1}`;
        setDepartments([...departments, { id: nextId, name: newDept.name, head: newDept.head }]);
        setIsAddDeptOpen(false);
        setNewDept({ name: '', head: '' });
        showToast(`Department "${newDept.name}" created successfully!`);
    };

    const handleAddDesignation = (e) => {
        e.preventDefault();
        const nextId = `DESG-0${designations.length + 1}`;
        setDesignations([...designations, { id: nextId, title: newDesg.title, grade: newDesg.grade, baseSalary: parseFloat(newDesg.baseSalary) || 25000 }]);
        setIsAddDesgOpen(false);
        setNewDesg({ title: '', grade: 'Grade B', baseSalary: '' });
        showToast(`Designation "${newDesg.title}" defined successfully!`);
    };

    const handlePunchToggle = () => {
        if (!hasPunchedToday) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toISOString().split('T')[0];
            
            const newLog = {
                empId: 'ADMIN-00',
                name: 'Sardar Singh (Admin)',
                date: dateStr,
                timeIn: timeStr,
                timeOut: '--:--',
                status: 'Present',
                late: now.getHours() > 9
            };
            setAttendance([newLog, ...attendance]);
            setHasPunchedToday(true);
            showToast('Punch In timestamp sync audited & recorded!');
        } else {
            setAttendance(prev => prev.map(a => {
                if (a.empId === 'ADMIN-00' && a.timeOut === '--:--') {
                    const now = new Date();
                    return { ...a, timeOut: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                }
                return a;
            }));
            setHasPunchedToday(false);
            showToast('Punch Out timestamp saved. Shift completed.');
        }
    };

    const handleApplyLeave = (e) => {
        e.preventDefault();
        const start = new Date(newLeave.start);
        const end = new Date(newLeave.end);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const nextId = `LV-${leaves.length + 101}`;
        const added = {
            id: nextId,
            name: newLeave.name,
            type: newLeave.type,
            start: newLeave.start,
            end: newLeave.end,
            days: diffDays,
            reason: newLeave.reason,
            status: 'Pending'
        };

        setLeaves([added, ...leaves]);
        setIsApplyLeaveOpen(false);
        setNewLeave({ name: 'Ramesh Patil', type: 'Casual Leave', start: '', end: '', reason: '' });
        showToast(`Leave application submitted for approval! Total: ${diffDays} days.`);
    };

    const handleLeaveDecision = (id, status) => {
        setLeaves(prev => prev.map(l => {
            if (l.id === id) {
                // Deduct balances if approved
                if (status === 'Approved') {
                    const emp = employees.find(e => e.name === l.name);
                    if (emp) {
                        const leaveKey = l.type.toLowerCase().includes('sick') ? 'sick' : l.type.toLowerCase().includes('casual') ? 'casual' : 'paid';
                        const currentBalance = leaveBalances[emp.id]?.[leaveKey] || 10;
                        setLeaveBalances(prevBal => ({
                            ...prevBal,
                            [emp.id]: {
                                ...prevBal[emp.id],
                                [leaveKey]: Math.max(0, currentBalance - l.days)
                            }
                        }));
                    }
                }
                return { ...l, status };
            }
            return l;
        }));
        showToast(`Leave request ${id} marked as ${status}.`);
    };

    const handleAddJob = (e) => {
        e.preventDefault();
        const nextId = `JOB-0${jobs.length + 1}`;
        setJobs([...jobs, { id: nextId, title: newJob.title, dept: newJob.dept, openings: parseInt(newJob.openings) || 1, status: 'Active' }]);
        setIsAddJobOpen(false);
        setNewJob({ title: '', dept: 'Production', openings: 1 });
        showToast('New job opening posted successfully!');
    };

    const handleAddCandidate = (e) => {
        e.preventDefault();
        const nextId = `CAN-${candidates.length + 101}`;
        setCandidates([...candidates, { id: nextId, name: newCand.name, job: newCand.job, stage: 'Applied', score: 0, phone: newCand.phone, email: newCand.email }]);
        setIsAddCandOpen(false);
        setNewCand({ name: '', job: 'Senior Molding Operator', phone: '', email: '' });
        showToast(`Candidate ${newCand.name} enrolled in hiring track.`);
    };

    const handleUpdateCandidateStage = (id, nextStage) => {
        setCandidates(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, stage: nextStage, score: nextStage === 'Offered' || nextStage === 'Hired' ? 90 : c.score === 0 ? 65 : c.score };
            }
            return c;
        }));
        showToast(`Candidate pipeline stage shifted to ${nextStage}.`);
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        const emp = employees.find(x => x.id === newReview.empId);
        setPerformance([...performance, {
            empId: newReview.empId,
            name: emp ? emp.name : 'Unknown',
            kpi: newReview.kpi,
            rating: parseInt(newReview.rating),
            productivity: parseInt(newReview.productivity),
            comments: newReview.comments
        }]);
        setIsAddReviewOpen(false);
        setNewReview({ empId: 'EMP-001', kpi: '', rating: 5, productivity: 85, comments: '' });
        showToast(`Performance appraisal scorecard logged.`);
    };

    const handleUploadDocSimulate = (e) => {
        e.preventDefault();
        setUploadingDoc(true);
        setTimeout(() => {
            const emp = employees.find(x => x.id === newDoc.empId);
            setDocuments([
                {
                    empId: newDoc.empId,
                    name: emp ? emp.name : 'Staff Member',
                    type: newDoc.type,
                    status: 'Verified',
                    fileName: newDoc.fileName || `${newDoc.type.toLowerCase()}_store.pdf`,
                    date: new Date().toISOString().split('T')[0]
                },
                ...documents
            ]);
            setUploadingDoc(false);
            setIsUploadDocOpen(false);
            setNewDoc({ empId: 'EMP-001', type: 'Aadhaar', fileName: '' });
            showToast('Document securely uploaded, cataloged & verified!');
        }, 1500);
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        const nextId = `EXP-${expenses.length + 501}`;
        setExpenses([
            {
                id: nextId,
                name: newExpense.name,
                type: newExpense.type,
                amount: parseFloat(newExpense.amount) || 0,
                description: newExpense.description,
                date: newExpense.date,
                status: 'Pending'
            },
            ...expenses
        ]);
        setIsAddExpenseOpen(false);
        setNewExpense({ name: 'Ramesh Patil', type: 'Travel Expense', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
        showToast('Claim sheet submitted for approval review.');
    };

    const handleExpenseDecision = (id, status) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
        showToast(`Expense claim ${id} marked as ${status}.`);
    };

    const handleDeleteEmployee = (id) => {
        if(window.confirm(`Are you sure you want to remove staff member ${id}?`)) {
            setEmployees(prev => prev.filter(e => e.id !== id));
            showToast(`Employee ${id} deleted from roster.`);
        }
    };

    // Calculate individual components for selected payroll employee
    const payEmpObj = employees.find(e => e.id === selectedPayEmpId) || employees[0];
    const baseSalary = payEmpObj ? payEmpObj.salary : 35000;
    const hourlyRate = Math.round(baseSalary / 160);
    const overtimePayout = overtimeHours * Math.round(hourlyRate * 1.5);
    
    // Components matching HRA, PF, TAX requirements
    const compBasic = Math.round(baseSalary * 0.60);
    const compHRA = Math.round(baseSalary * 0.30);
    const compEPF = Math.round(compBasic * 0.12);
    const grossIncome = baseSalary + overtimePayout + monthlyBonus;
    const compTax = grossIncome > 40000 ? Math.round(grossIncome * 0.10) : grossIncome > 25000 ? Math.round(grossIncome * 0.05) : 0;
    const totalDeductions = compEPF + compTax + monthlyDeduction;
    const takeHomeSalary = grossIncome - totalDeductions;

    // Trigger CSV / Excel Roster Report Export
    const handleSimulateCSVDownload = (reportType) => {
        let headers = [];
        let rows = [];

        if (reportType === 'employees') {
            headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Monthly Salary'];
            rows = employees.map(e => [e.id, e.name, e.email, e.phone, e.dept, e.designation, e.joiningDate, `INR ${e.salary}`]);
        } else if (reportType === 'attendance') {
            headers = ['Name', 'Date', 'Clock In', 'Clock Out', 'Status', 'Late Status'];
            rows = attendance.map(a => [a.name, a.date, a.timeIn, a.timeOut, a.status, a.late ? 'Yes' : 'No']);
        } else if (reportType === 'payroll') {
            headers = ['Name', 'Basic Salary', 'HRA', 'Overtime Hours', 'Gross', 'Net Take Home'];
            rows = employees.map(e => {
                const basic = Math.round(e.salary * 0.60);
                const hra = Math.round(e.salary * 0.30);
                return [e.name, `INR ${basic}`, `INR ${hra}`, '10 Hrs', `INR ${e.salary}`, `INR ${Math.round(e.salary * 0.85)}`];
            });
        } else if (reportType === 'leaves') {
            headers = ['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Days Count', 'Status'];
            rows = leaves.map(l => [l.name, l.type, l.start, l.end, l.days, l.status]);
        }

        // CSV content assembly
        const csvContent = [headers.join(','), ...rows.map(row => row.map(item => `"${item}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `saas_namastute_${reportType}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`${reportType.toUpperCase()} spreadsheet downloaded successfully!`, 'success');
    };

    // Calculate Paginated Employees list
    const filteredEmployees = employees.filter(e => {
        const matchQuery = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           e.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = deptFilter === 'All' || e.dept.toLowerCase() === deptFilter.toLowerCase();
        return matchQuery && matchDept;
    });

    const totalEmpPages = Math.ceil(filteredEmployees.length / empPageSize);
    const empStartIndex = (empCurrentPage - 1) * empPageSize;
    const empEndIndex = empStartIndex + empPageSize;
    const paginatedEmployees = filteredEmployees.slice(empStartIndex, empEndIndex);

    return (
        <div className="sub-category-page px-3 py-2">
            {/* Elegant Top Alert Notifications */}
            {toast.show && (
                <div className={`prod-toast prod-toast-${toast.type} d-flex align-items-center shadow-lg border`} style={{ borderLeft: '4px solid #ff9b29' }}>
                    <CheckCircle2 size={18} className="me-2" style={{ color: '#ff9b29' }} />
                    <span>{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: 'success' })}>×</button>
                </div>
            )}

            {/* Premium HRM Portal Header Row */}
            <div className="ss-header-row mb-4 p-4 rounded-3 text-white shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3" 
                 style={{ background: 'linear-gradient(135deg, #1c2b36 0%, #2a3e4d 100%)', borderLeft: '6px solid #ff9b29' }}>
                <div>
                    <h2 className="mb-1 text-white fw-bold d-flex align-items-center gap-2" style={{ fontSize: '24px' }}>
                        <Users strokeWidth={2.5} size={26} style={{ color: '#ff9b29' }} /> HRM Portal & Operations Workspace
                    </h2>
                    <p className="mb-0 text-light" style={{ fontSize: '13px', opacity: 0.85, color: '#ffe0b2' }}>
                        Manage corporate human capital directories, track real-time punch rosters, compute payroll structures, verify secure documents, and process expense claims.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm px-3 py-2 text-nowrap rounded-2 fw-semibold d-flex align-items-center gap-2" 
                            style={{ borderColor: 'rgba(255, 155, 41, 0.4)', color: '#fff' }}
                            onClick={handlePunchToggle}>
                        <Clock size={16} style={{ color: '#ff9b29' }} /> {hasPunchedToday ? 'Punch Out Session' : 'Punch In Roster'}
                    </button>
                    <button className="btn btn-sm px-3 py-2 text-nowrap rounded-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                            style={{ background: '#ff9b29', color: '#fff', border: 'none' }}
                            onClick={() => setIsAddEmpOpen(true)}>
                        <Plus size={16} /> Hire Employee
                    </button>
                </div>
            </div>

            {/* Dynamic Metric Stat Counters */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="ss-stat-card border-0 shadow-sm bg-white p-3.5 position-relative overflow-hidden h-100" style={{ borderLeft: '3px solid #ff9b29' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="text-secondary small fw-bold mb-1">Corporate Roster</h4>
                                <p className="fs-4 fw-bold mb-0" style={{ color: '#1c2b36' }}>{totalEmployeesCount} Headcount</p>
                            </div>
                            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff9b29' }}>
                                <Users size={22} />
                            </div>
                        </div>
                        <div className="mt-2 text-success small fw-semibold">
                            <TrendingUp size={14} className="me-1" /> Active directory members
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="ss-stat-card border-0 shadow-sm bg-white p-3.5 position-relative overflow-hidden h-100" style={{ borderLeft: '3px solid #1c2b36' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="text-secondary small fw-bold mb-1">Departments Active</h4>
                                <p className="fs-4 fw-bold mb-0" style={{ color: '#1c2b36' }}>{activeDeptsCount} Sectors</p>
                            </div>
                            <div className="p-3 rounded-3" style={{ background: 'rgba(28, 43, 54, 0.05)', color: '#1c2b36' }}>
                                <Building2 size={22} />
                            </div>
                        </div>
                        <div className="mt-2 text-secondary small fw-semibold">
                            Production, Sales, HR, Admin
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="ss-stat-card border-0 shadow-sm bg-white p-3.5 position-relative overflow-hidden h-100" style={{ borderLeft: '3px solid #ff9b29' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="text-secondary small fw-bold mb-1">Shift Attendance Rate</h4>
                                <p className="fs-4 fw-bold mb-0" style={{ color: '#1c2b36' }}>{attendanceRate}% Logged</p>
                            </div>
                            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff9b29' }}>
                                <Clock size={22} />
                            </div>
                        </div>
                        <div className="mt-2 text-muted small fw-semibold">
                            {presentTodayCount} of {totalEmployeesCount} present today
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="ss-stat-card border-0 shadow-sm bg-white p-3.5 position-relative overflow-hidden h-100" style={{ borderLeft: '3px solid #ef4444' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="text-secondary small fw-bold mb-1">Inbox Requests</h4>
                                <p className="fs-4 fw-bold mb-0" style={{ color: '#1c2b36' }}>{pendingActionsCount} Pending</p>
                            </div>
                            <div className="p-3 bg-danger-subtle text-danger rounded-3">
                                <ShieldAlert size={22} />
                            </div>
                        </div>
                        <div className="mt-2 text-danger small fw-semibold">
                            Requires manager authorizations
                        </div>
                    </div>
                </div>
            </div>

            {/* Inner Dashboard Layout: Inner Left Sidebar & Active Right workspace */}
            <div className="row g-4">
                {/* 12-Module Sub-Sidebar Menu */}
                <div className="col-12 col-lg-4 col-xl-3">
                    <div className="ss-main-panel shadow-sm border bg-white p-3 rounded-3">
                        <h5 className="fw-bold mb-3 px-2 pb-2 border-bottom d-flex align-items-center justify-content-between text-dark" 
                            style={{ fontSize: '14.5px', borderBottom: '2px solid #f1f5f9' }}>
                            <span className="d-flex align-items-center gap-2">
                                <span style={{ width: '4px', height: '14px', background: '#ff9b29', borderRadius: '2px' }} />
                                HRM SUB-SECTIONS
                            </span>
                            <span className="badge fs-7.5 rounded-pill" style={{ background: 'rgba(255, 155, 41, 0.1)', color: '#ff8926' }}>12 Modules</span>
                        </h5>
                        <div className="d-flex flex-column gap-1.5 navigation-inner-sidebar">
                            {[
                                { id: 'employees', title: '1. Employees Directory', icon: <Users size={15} /> },
                                { id: 'departments', title: '2. Departments Roster', icon: <Building2 size={15} /> },
                                { id: 'designations', title: '3. Designations', icon: <Award size={15} /> },
                                { id: 'attendance', title: '4. Attendance Track', icon: <Clock size={15} /> },
                                { id: 'leaves', title: '5. Leave Management', icon: <Calendar size={15} /> },
                                { id: 'payroll', title: '6. Payroll Manager (IMP)', icon: <DollarSign size={15} />, badge: 'Pay Slip' },
                                { id: 'shifts', title: '7. Shift Assignment', icon: <CalendarDays size={15} /> },
                                { id: 'recruitment', title: '8. Talent Recruitment', icon: <UserPlus size={15} /> },
                                { id: 'performance', title: '9. Performance Ratings', icon: <Star size={15} /> },
                                { id: 'documents', title: '10. Employee Documents', icon: <FileCheck size={15} /> },
                                { id: 'expenses', title: '11. Expense Claims', icon: <ShieldAlert size={15} /> },
                                { id: 'reports', title: '12. HR Reports', icon: <FileSpreadsheet size={15} /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                                    className="btn btn-sm text-start py-2.5 px-3 border-0 transition-all text-nowrap d-flex align-items-center justify-content-between"
                                    style={{ 
                                        fontSize: '13px',
                                        background: activeTab === tab.id ? 'rgba(255, 155, 41, 0.08)' : 'transparent',
                                        color: activeTab === tab.id ? '#ff8926' : '#5b6670',
                                        borderLeft: activeTab === tab.id ? '4px solid #ff9b29' : '4px solid transparent',
                                        paddingLeft: activeTab === tab.id ? '10px' : '12px',
                                        borderRadius: '0 6px 6px 0',
                                        fontWeight: activeTab === tab.id ? '700' : '600'
                                    }}
                                >
                                    <span className="d-flex align-items-center gap-2.5">
                                        <span style={{ color: activeTab === tab.id ? '#ff9b29' : '#888' }}>
                                            {tab.icon}
                                        </span>
                                        {tab.title}
                                    </span>
                                    {tab.badge && (
                                        <span className="badge py-1 px-2 rounded fs-8" style={{
                                            background: activeTab === tab.id ? '#ff9b29' : '#ffe8cc',
                                            color: activeTab === tab.id ? '#fff' : '#d97706',
                                            fontWeight: '700'
                                        }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Workspace Panel */}
                <div className="col-12 col-lg-8 col-xl-9">
                    <div className="ss-main-panel border shadow-sm bg-white p-4 rounded-3 position-relative">
                        
                        {/* ========================================================
                            MODULE 1: EMPLOYEES DIRECTORY (WITH 10-ITEM PAGINATION)
                            ======================================================== */}
                        {activeTab === 'employees' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Employee Roster Directory</h4>
                                        <p className="text-muted small mb-0">Browse through corporate resources, view professional identity profiles, and store records</p>
                                    </div>
                                    <button className="btn btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm text-white" 
                                            style={{ background: '#ff9b29', border: 'none', fontWeight: '600' }} 
                                            onClick={() => setIsAddEmpOpen(true)}>
                                        <Plus size={16} /> Add Employee
                                    </button>
                                </div>

                                <div className="d-flex flex-wrap gap-2.5 mb-3">
                                    <div className="ss-search-wrap flex-grow-1" style={{ maxWidth: '400px' }}>
                                        <Search size={16} />
                                        <input
                                            type="text"
                                            className="ss-search-input"
                                            placeholder="Search by Employee ID, Name or Email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select className="ss-filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                                        <option value="All">All Departments</option>
                                        <option value="Production">Production</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Accounts">Accounts</option>
                                        <option value="HR">HR</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border border-bottom-0">
                                        <thead>
                                            <tr>
                                                <th>Staff ID</th>
                                                <th>Name</th>
                                                <th>Department / Role</th>
                                                <th>Base Salary</th>
                                                <th>Shift Plan</th>
                                                <th>Status</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEmployees.length > 0 ? (
                                                paginatedEmployees.map((item) => (
                                                    <tr key={item.id}>
                                                        <td><span className="ss-code-badge font-monospace" style={{ borderLeft: '3px solid #ff9b29' }}>{item.id}</span></td>
                                                        <td className="ss-item-name">
                                                            <div className="fw-semibold" style={{ color: '#1c2b36' }}>{item.name}</div>
                                                            <div className="small text-muted" style={{ fontSize: '11px' }}>{item.email}</div>
                                                        </td>
                                                        <td>
                                                            <span className="ss-category-tag" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff8926' }}>{item.dept}</span>
                                                            <div className="small text-secondary fw-semibold" style={{ fontSize: '11.5px' }}>{item.designation}</div>
                                                        </td>
                                                        <td className="fw-bold text-dark">₹{item.salary.toLocaleString('en-IN')}</td>
                                                        <td className="text-secondary small fw-semibold">{item.shift}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill px-2.5 py-1.5 font-bold ${
                                                                item.active === 'Present' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                                            }`}>{item.active}</span>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-1.5">
                                                                <button className="btn btn-light btn-sm border" onClick={() => setSelectedProfile(item)} title="View Employee ID Card & Profile">
                                                                    <Eye size={14} style={{ color: '#ff9b29' }} />
                                                                </button>
                                                                <button className="btn btn-light btn-sm border" onClick={() => handleDeleteEmployee(item.id)}>
                                                                    <Trash2 size={14} className="text-danger" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4 text-secondary fw-semibold">No employee records match the active filters.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Premium Roster Pagination Row */}
                                <div className="ss-pagination-row border rounded-bottom">
                                    <div className="text-secondary small fw-bold">
                                        Showing <span className="text-dark">{Math.min(empStartIndex + 1, filteredEmployees.length)}</span> to <span className="text-dark">{Math.min(empEndIndex, filteredEmployees.length)}</span> of <span className="text-dark">{filteredEmployees.length}</span> employees
                                    </div>
                                    {totalEmpPages > 1 && (
                                        <div className="ss-page-controls">
                                            <button 
                                                className="ss-page-btn border shadow-2xs fw-bold" 
                                                disabled={empCurrentPage === 1}
                                                onClick={() => setEmpCurrentPage(empCurrentPage - 1)}
                                                style={{ fontSize: '15px', padding: '0 8px' }}
                                            >
                                                &laquo;
                                            </button>
                                            {[...Array(totalEmpPages)].map((_, i) => (
                                                <button 
                                                    key={i} 
                                                    className={`ss-page-btn border shadow-2xs ${empCurrentPage === i + 1 ? 'active' : ''}`}
                                                    onClick={() => setEmpCurrentPage(i + 1)}
                                                    style={empCurrentPage === i + 1 ? { background: '#ff9b29', borderColor: '#ff9b29', color: '#fff', fontWeight: '700' } : { fontWeight: '600' }}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button 
                                                className="ss-page-btn border shadow-2xs fw-bold" 
                                                disabled={empCurrentPage === totalEmpPages}
                                                onClick={() => setEmpCurrentPage(empCurrentPage + 1)}
                                                style={{ fontSize: '15px', padding: '0 8px' }}
                                            >
                                                &raquo;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 2: DEPARTMENTS
                            ======================================================== */}
                        {activeTab === 'departments' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Corporate Departments</h4>
                                        <p className="text-muted small mb-0">Manage corporate sectors, division directors, and view computed resource totals</p>
                                    </div>
                                    <button className="btn btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm text-white" 
                                            style={{ background: '#ff9b29', border: 'none', fontWeight: '600' }} 
                                            onClick={() => setIsAddDeptOpen(true)}>
                                        <Plus size={16} /> Add Department
                                    </button>
                                </div>

                                <div className="row g-3">
                                    {departments.map((dept) => {
                                        const count = getDeptCount(dept.name);
                                        return (
                                            <div className="col-12 col-md-6 col-xl-4" key={dept.id}>
                                                <div className="card p-3 border shadow-xs hover-shadow transition-all bg-white rounded-3" style={{ borderLeft: '4px solid #ff9b29' }}>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div className="p-2 rounded-2" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff9b29' }}>
                                                            <Building2 size={20} />
                                                        </div>
                                                        <span className="badge rounded-pill px-2.5 py-1" style={{ background: '#f1f5f9', color: '#5b6670', fontWeight: '700' }}>{dept.id}</span>
                                                    </div>
                                                    <h5 className="fw-bold mb-1" style={{ color: '#1c2b36' }}>{dept.name}</h5>
                                                    <div className="small text-muted mb-2.5">
                                                        Director Head: <span className="fw-bold text-dark">{dept.head}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center border-top pt-2.5 mt-1">
                                                        <span className="small text-secondary fw-bold">Roster Headcount:</span>
                                                        <span className="badge px-3 py-1.5 rounded-pill fw-bold" style={{ background: 'rgba(255, 155, 41, 0.1)', color: '#ff8926' }}>{count} Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 3: CORPORATE DESIGNATIONS
                            ======================================================== */}
                        {activeTab === 'designations' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Corporate Designations</h4>
                                        <p className="text-muted small mb-0">Define organizational rank levels, appraisal scales, and structured payroll hierarchies</p>
                                    </div>
                                    <button className="btn btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm text-white" 
                                            style={{ background: '#ff9b29', border: 'none', fontWeight: '600' }} 
                                            onClick={() => setIsAddDesgOpen(true)}>
                                        <Plus size={16} /> Add Designation
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Grade ID</th>
                                                <th>Title / Role Name</th>
                                                <th>Appraisal Scale Rank</th>
                                                <th>Reference Base Salary</th>
                                                <th className="text-end">Hierarchy Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {designations.map((desg) => (
                                                <tr key={desg.id}>
                                                    <td><span className="ss-code-badge font-monospace" style={{ borderLeft: '3px solid #ff9b29' }}>{desg.id}</span></td>
                                                    <td className="fw-bold" style={{ color: '#1c2b36' }}>{desg.title}</td>
                                                    <td>
                                                        <span className="badge border px-2 py-1 rounded-pill" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff8926', borderColor: 'rgba(255, 155, 41, 0.2)' }}>{desg.grade}</span>
                                                    </td>
                                                    <td className="fw-bold text-dark">₹{desg.baseSalary.toLocaleString('en-IN')} / month</td>
                                                    <td className="text-end text-secondary fw-semibold">
                                                        {desg.grade === 'Grade A' ? 'Level 1 Executive' : desg.grade === 'Grade B' ? 'Level 2 Professional' : 'Level 3 Operator'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 4: ATTENDANCE MANAGEMENT
                            ======================================================== */}
                        {activeTab === 'attendance' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Attendance Audits & Logs</h4>
                                        <p className="text-muted small mb-0">Monitor biometric scan status, QR code entry check-ins, and daily audit timelines</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <button className={`btn btn-sm ${biometricEnabled ? 'btn-success text-white' : 'btn-outline-secondary'}`} 
                                                style={biometricEnabled ? { background: '#ff9b29', border: 'none' } : {}}
                                                onClick={() => setBiometricEnabled(!biometricEnabled)}>
                                            Biometric: {biometricEnabled ? 'ON' : 'OFF'}
                                        </button>
                                        <button className="btn btn-sm text-white px-3" style={{ background: '#ff9b29', fontWeight: '600' }} onClick={() => setQrScannerVisible(!qrScannerVisible)}>
                                            QR Check-In Code
                                        </button>
                                    </div>
                                </div>

                                {qrScannerVisible && (
                                    <div className="p-3 bg-light rounded-3 mb-4 text-center border" style={{ borderLeft: '4px solid #ff9b29' }}>
                                        <h6 className="fw-bold mb-2">QR Code Check-In Hub</h6>
                                        <div className="bg-white p-3.5 d-inline-block rounded-3 border mb-2">
                                            {/* Retro simulated QR block */}
                                            <div style={{ width: '120px', height: '120px', background: '#000', border: '5px solid #000', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                                                {[...Array(16)].map((_, i) => (
                                                    <div key={i} style={{ background: (i % 3 === 0 || i % 5 === 0) ? '#fff' : '#000' }} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="small text-muted mb-0">Scan at entry gates to audit timestamps automatically.</p>
                                    </div>
                                )}

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-5">
                                        <div className="p-4 bg-light rounded-3 text-center border h-100 d-flex flex-column justify-content-between" style={{ borderLeft: '4px solid #ff9b29' }}>
                                            <div>
                                                <Clock size={36} className="mb-2 mx-auto animate-pulse" style={{ color: '#ff9b29' }} />
                                                <h5 className="fw-bold" style={{ color: '#1c2b36' }}>Daily Shift Punch</h5>
                                                <p className="small text-muted mb-3">Sync audit timestamps dynamically under administrative protocols.</p>
                                            </div>
                                            <button className={`btn btn-lg w-100 text-white`} style={{ background: hasPunchedToday ? '#ef4444' : '#ff9b29', fontWeight: '700', border: 'none' }} onClick={handlePunchToggle}>
                                                {hasPunchedToday ? '✔ Punch Out Shift Session' : 'Punch In Roster Now'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                        <div className="p-4 bg-light rounded-3 border h-100" style={{ borderLeft: '4px solid #1c2b36' }}>
                                            <h6 className="fw-bold mb-2.5" style={{ color: '#1c2b36' }}>Biometric Gate Sync Audit</h6>
                                            <div className="small text-muted mb-3 d-flex align-items-center gap-1.5">
                                                <div className="pulse-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: biometricEnabled ? '#22c55e' : '#f59e0b' }} />
                                                <span>Status: {biometricEnabled ? 'Receiving terminal feeds (Realtime sync)' : 'Local server fallback active'}</span>
                                            </div>
                                            <div className="bg-white p-3 rounded border text-indigo-950" style={{ fontSize: '12.5px' }}>
                                                <div className="d-flex justify-content-between mb-1.5 font-monospace"><span>Total Audit Logs:</span><span className="fw-bold text-dark">{attendance.length}</span></div>
                                                <div className="d-flex justify-content-between mb-1.5 font-monospace"><span>On-Time Entries:</span><span className="text-success fw-bold">{attendance.filter(a => !a.late).length}</span></div>
                                                <div className="d-flex justify-content-between font-monospace"><span>Late Entries:</span><span className="text-warning fw-bold">{attendance.filter(a => a.late).length}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Staff Roster Name</th>
                                                <th>Shift Date</th>
                                                <th>Punch In Time</th>
                                                <th>Punch Out Time</th>
                                                <th>Late Entry</th>
                                                <th>Audit Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendance.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="ss-item-name">{item.name}</td>
                                                    <td>{item.date}</td>
                                                    <td className="font-monospace text-success fw-bold">{item.timeIn}</td>
                                                    <td className="font-monospace text-secondary">{item.timeOut}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${item.late ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
                                                            {item.late ? 'Late (>9:00 AM)' : 'On-Time'}
                                                        </span>
                                                    </td>
                                                    <td><span className="badge bg-success text-white">Verified</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 5: LEAVE MANAGEMENT
                            ======================================================== */}
                        {activeTab === 'leaves' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Leave Management Hub</h4>
                                        <p className="text-muted small mb-0">Track employee casual, sick, or paid balances, and approve submitted claims</p>
                                    </div>
                                    <button className="btn btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm text-white" 
                                            style={{ background: '#ff9b29', border: 'none', fontWeight: '600' }} 
                                            onClick={() => setIsApplyLeaveOpen(true)}>
                                        <Plus size={16} /> Apply Leave
                                    </button>
                                </div>

                                <h6 className="fw-bold mb-2.5 text-indigo-950">Available Leave Balances (Core Staff)</h6>
                                <div className="row g-3 mb-4">
                                    {employees.slice(0, 3).map((emp) => {
                                        const bal = leaveBalances[emp.id] || { sick: 10, casual: 6, paid: 12 };
                                        return (
                                            <div className="col-12 col-md-4" key={emp.id}>
                                                <div className="card p-3.5 border bg-light shadow-xs rounded-3" style={{ borderLeft: '3px solid #ff9b29' }}>
                                                    <h6 className="fw-bold mb-2" style={{ color: '#1c2b36' }}>{emp.name}</h6>
                                                    <div className="row text-center g-2">
                                                        <div className="col-4 bg-white p-2.5 rounded border">
                                                            <div className="fs-5 fw-bold text-danger">{bal.sick}</div>
                                                            <div className="small text-muted" style={{ fontSize: '10px' }}>Sick L.</div>
                                                        </div>
                                                        <div className="col-4 bg-white p-2.5 rounded border">
                                                            <div className="fs-5 fw-bold text-warning">{bal.casual}</div>
                                                            <div className="small text-muted" style={{ fontSize: '10px' }}>Casual</div>
                                                        </div>
                                                        <div className="col-4 bg-white p-2.5 rounded border">
                                                            <div className="fs-5 fw-bold text-indigo" style={{ color: '#ff9b29' }}>{bal.paid}</div>
                                                            <div className="small text-muted" style={{ fontSize: '10px' }}>Paid L.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <h6 className="fw-bold mb-2.5" style={{ color: '#1c2b36' }}>Pending & History Leave Log</h6>
                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Roster Applicant</th>
                                                <th>Leave Type</th>
                                                <th>Duration Range</th>
                                                <th>Calculated Days</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th className="text-end">Approve Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaves.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="ss-item-name">{item.name}</td>
                                                    <td className="fw-semibold">{item.type}</td>
                                                    <td className="small text-secondary">{item.start} to {item.end}</td>
                                                    <td className="font-monospace fw-bold text-center">{item.days} days</td>
                                                    <td className="small text-muted">{item.reason}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-2.5 py-1.5 fw-bold ${
                                                            item.status === 'Approved' ? 'bg-success-subtle text-success' :
                                                            item.status === 'Rejected' ? 'bg-danger-subtle text-danger' :
                                                            'bg-warning-subtle text-warning'
                                                        }`}>{item.status}</span>
                                                    </td>
                                                    <td className="text-end">
                                                        {item.status === 'Pending' ? (
                                                            <div className="d-flex justify-content-end gap-1.5">
                                                                <button className="btn btn-success btn-sm p-1 rounded" onClick={() => handleLeaveDecision(item.id, 'Approved')}>
                                                                    <Check size={14} />
                                                                </button>
                                                                <button className="btn btn-danger btn-sm p-1 rounded" onClick={() => handleLeaveDecision(item.id, 'Rejected')}>
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="small text-muted">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 6: PAYROLL MANAGEMENT (VERY IMPORTANT)
                            ======================================================== */}
                        {activeTab === 'payroll' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Payroll Calculator & Components</h4>
                                        <p className="text-muted small mb-0">Compute Basic Salary, HRA, Overtime allowances, PF, Taxes, and generate salary payslips</p>
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    <div className="col-12 col-md-7">
                                        <div className="p-4 bg-light rounded-3 border h-100" style={{ borderLeft: '4px solid #ff9b29' }}>
                                            <h5 className="fw-bold mb-3.5 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Briefcase size={18} /> Interactive Salary Run Sheet</h5>
                                            
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-secondary">Select Roster Employee for adjustment:</label>
                                                <select className="form-select border p-2 fw-semibold" value={selectedPayEmpId} onChange={(e) => setSelectedPayEmpId(e.target.value)}>
                                                    {employees.map(e => (
                                                        <option key={e.id} value={e.id}>{e.name} ({e.designation} - ₹{e.salary.toLocaleString('en-IN')})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3.5">
                                                <div className="d-flex justify-content-between mb-1.5">
                                                    <label className="form-label small fw-bold text-secondary mb-0">Record Monthly Overtime Hours</label>
                                                    <span className="badge px-3 py-1 rounded-pill fw-bold" style={{ background: 'rgba(255, 155, 41, 0.1)', color: '#ff8926' }}>{overtimeHours} Hours</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="40"
                                                    className="form-range w-100"
                                                    value={overtimeHours}
                                                    onChange={(e) => setOvertimeHours(parseInt(e.target.value))}
                                                    style={{ accentColor: '#ff9b29' }}
                                                />
                                            </div>

                                            <div className="row g-2 mb-3">
                                                <div className="col-6">
                                                    <label className="form-label small fw-bold text-secondary">Bonus Incentives (₹)</label>
                                                    <input type="number" className="form-control" value={monthlyBonus} onChange={(e) => setMonthlyBonus(parseFloat(e.target.value) || 0)} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label small fw-bold text-secondary">Custom Deductions (₹)</label>
                                                    <input type="number" className="form-control" value={monthlyDeduction} onChange={(e) => setMonthlyDeduction(parseFloat(e.target.value) || 0)} />
                                                </div>
                                            </div>

                                            <div className="p-3 bg-white rounded-3 border-start border-4 border-indigo-600 mb-2" style={{ borderLeftColor: '#ff9b29' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold" style={{ color: '#1c2b36' }}>Calculated Payout Summary:</h6>
                                                        <span className="small text-muted">Overtime calculated @ 1.5x hourly scale (₹{hourlyRate}/hr)</span>
                                                    </div>
                                                    <span className="fw-bold fs-5" style={{ color: '#ff8926' }}>₹{takeHomeSalary.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Generated Salary Invoice Mockup */}
                                    <div className="col-12 col-md-5">
                                        <div className="p-4 bg-white rounded-3 border shadow-xs h-100 d-flex flex-column justify-content-between" style={{ borderColor: 'rgba(255, 155, 41, 0.2)' }}>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><FileText size={18} /> Company Payslip Invoice</h6>
                                                    <span className="badge font-monospace text-uppercase" style={{ fontSize: '10px', background: 'rgba(255, 155, 41, 0.1)', color: '#ff9b29' }}>Draft</span>
                                                </div>
                                                <div className="d-flex flex-column gap-2" style={{ fontSize: '12.5px' }}>
                                                    <div className="d-flex justify-content-between text-secondary"><span>Staff ID:</span><span className="fw-bold text-dark font-monospace">{payEmpObj?.id}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary border-bottom pb-2"><span>Roster Name:</span><span className="fw-bold text-dark">{payEmpObj?.name}</span></div>
                                                    
                                                    <div className="d-flex justify-content-between text-secondary pt-1"><span>Basic Salary (60%):</span><span className="text-dark fw-semibold">₹{compBasic.toLocaleString('en-IN')}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary"><span>HRA Allowance (30%):</span><span className="text-dark fw-semibold">₹{compHRA.toLocaleString('en-IN')}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary"><span>Overtime Pay ({overtimeHours} hrs):</span><span className="text-dark fw-semibold">₹{overtimePayout.toLocaleString('en-IN')}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary"><span>Incentives / Bonus:</span><span className="text-success fw-bold">+ ₹{monthlyBonus.toLocaleString('en-IN')}</span></div>
                                                    
                                                    <div className="d-flex justify-content-between text-secondary border-bottom pb-2 text-danger"><span>Provident Fund (12% EPF):</span><span>- ₹{compEPF.toLocaleString('en-IN')}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary text-danger"><span>Income Tax (TDS):</span><span>- ₹{compTax.toLocaleString('en-IN')}</span></div>
                                                    <div className="d-flex justify-content-between text-secondary border-bottom pb-2 text-danger"><span>Other Deductions:</span><span>- ₹{monthlyDeduction.toLocaleString('en-IN')}</span></div>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3.5 border-top">
                                                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold" style={{ color: '#1c2b36' }}>Net Take Home Pay:</h6>
                                                        <span className="small text-muted" style={{ fontSize: '11px' }}>Deductions subtracted</span>
                                                    </div>
                                                    <span className="fw-bold fs-5" style={{ color: '#ff9b29' }}>₹{takeHomeSalary.toLocaleString('en-IN')}</span>
                                                </div>
                                                <button className="btn text-white w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-1.5 shadow-sm" 
                                                        style={{ background: '#ff9b29', border: 'none' }} 
                                                        onClick={() => setSelectedPayslipEmp(payEmpObj)}>
                                                    <Printer size={16} /> Print Payslip Receipt
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 7: SHIFT MANAGEMENT
                            ======================================================== */}
                        {activeTab === 'shifts' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Shift Roster Assignments</h4>
                                        <p className="text-muted small mb-0">Configure corporate timing parameters, rotational policies, and allocate shifts</p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    {shifts.map((shift) => (
                                        <div className="col-12 col-sm-6 col-lg-3" key={shift.id}>
                                            <div className="card p-3 border shadow-xs bg-white rounded-3" style={{ borderLeft: '3px solid #ff9b29' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="badge font-monospace" style={{ background: '#f1f5f9', color: '#5b6670' }}>{shift.id}</span>
                                                    <span className="badge" style={{ background: 'rgba(255, 155, 41, 0.1)', color: '#ff8926' }}>{shift.type}</span>
                                                </div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#1c2b36' }}>{shift.name}</h6>
                                                <p className="small text-secondary mb-0 fw-semibold d-flex align-items-center gap-1.5">
                                                    <Clock size={13} style={{ color: '#ff9b29' }} /> {shift.timing}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h6 className="fw-bold mb-2.5" style={{ color: '#1c2b36' }}>Quick Employee Shift Assignment</h6>
                                <div className="p-3 bg-light rounded-3 border mb-4">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const empId = form.elements.empAssignId.value;
                                        const shiftVal = form.elements.shiftSelect.value;
                                        setEmployees(prev => prev.map(emp => emp.id === empId ? { ...emp, shift: shiftVal } : emp));
                                        showToast(`Shift schedule updated for ${empId}!`);
                                    }} className="row g-3 align-items-end">
                                        <div className="col-12 col-md-5">
                                            <label className="form-label small fw-bold text-secondary">Choose Staff Employee:</label>
                                            <select name="empAssignId" className="form-select border p-2">
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>{e.name} ({e.shift})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-5">
                                            <label className="form-label small fw-bold text-secondary">Assign Shift Plan:</label>
                                            <select name="shiftSelect" className="form-select border p-2">
                                                {shifts.map(s => (
                                                    <option key={s.id} value={s.name}>{s.name} ({s.timing})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <button type="submit" className="btn text-white w-100 py-2 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Update Shift</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 8: TALENT RECRUITMENT
                            ======================================================== */}
                        {activeTab === 'recruitment' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Talent Recruitment Pipeline</h4>
                                        <p className="text-muted small mb-0">Publish corporate job openings, evaluate candidates, and schedule interview status</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary btn-sm" style={{ color: '#ff9b29', border: '1px solid #ff9b29' }} onClick={() => setIsAddJobOpen(true)}>
                                            Post Job Open
                                        </button>
                                        <button className="btn text-white btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm" style={{ background: '#ff9b29', border: 'none' }} onClick={() => setIsAddCandOpen(true)}>
                                            <Plus size={16} /> Enroll Candidate
                                        </button>
                                    </div>
                                </div>

                                <h6 className="fw-bold mb-2.5" style={{ color: '#1c2b36' }}>Active Corporate Positions</h6>
                                <div className="row g-3 mb-4">
                                    {jobs.map((job) => (
                                        <div className="col-12 col-md-4" key={job.id}>
                                            <div className="card p-3 border shadow-xs bg-white rounded-3" style={{ borderLeft: '3px solid #ff9b29' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="badge font-monospace" style={{ background: '#f1f5f9', color: '#5b6670' }}>{job.id}</span>
                                                    <span className={`badge ${job.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{job.status}</span>
                                                </div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#1c2b36' }}>{job.title}</h6>
                                                <div className="d-flex justify-content-between small text-secondary">
                                                    <span>Openings: <span className="fw-bold text-dark">{job.openings} vacancies</span></span>
                                                    <span className="fw-bold">{job.dept}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h6 className="fw-bold mb-2.5" style={{ color: '#1c2b36' }}>Candidate Hiring Pipeline</h6>
                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Applicant Candidate</th>
                                                <th>Target Position Job</th>
                                                <th>Contact Info</th>
                                                <th>Evaluation Score</th>
                                                <th>Pipeline Track</th>
                                                <th className="text-end">Shift Phase</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((c) => (
                                                <tr key={c.id}>
                                                    <td className="ss-item-name">
                                                        <div className="fw-bold" style={{ color: '#1c2b36' }}>{c.name}</div>
                                                        <span className="small text-muted font-monospace">{c.id}</span>
                                                    </td>
                                                    <td className="fw-bold text-secondary">{c.job}</td>
                                                    <td className="small">
                                                        <div>{c.email}</div>
                                                        <div className="text-muted font-monospace">{c.phone}</div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1.5">
                                                            <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '80px' }}>
                                                                <div className="progress-bar" style={{ width: `${c.score}%`, background: 'linear-gradient(90deg,#ff9b29 0%,#ff8926 100%)' }} />
                                                            </div>
                                                            <span className="font-monospace fw-bold text-dark">{c.score || '--'}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge px-2.5 py-1.5 rounded-pill fw-bold ${
                                                            c.stage === 'Hired' ? 'bg-success text-white' :
                                                            c.stage === 'Offered' ? 'bg-warning text-white' :
                                                            c.stage === 'Interviewing' ? 'bg-warning-subtle text-warning' :
                                                            'bg-secondary-subtle text-secondary'
                                                        }`} style={c.stage === 'Offered' ? { background: '#ff9b29', border: 'none' } : {}}>{c.stage}</span>
                                                    </td>
                                                    <td className="text-end">
                                                        <select
                                                            className="form-select form-select-sm p-1.5 inline-block border w-auto"
                                                            value={c.stage}
                                                            onChange={(e) => handleUpdateCandidateStage(c.id, e.target.value)}
                                                            style={{ fontSize: '11.5px', minWidth: '120px' }}
                                                        >
                                                            <option value="Applied">Applied</option>
                                                            <option value="Interviewing">Interviewing</option>
                                                            <option value="Offered">Offered</option>
                                                            <option value="Hired">Hired</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 9: EMPLOYEE PERFORMANCE
                            ======================================================== */}
                        {activeTab === 'performance' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Employee Performance Scorecards</h4>
                                        <p className="text-muted small mb-0">Evaluate employee productivity indexes, track KPI metrics, and log reviews</p>
                                    </div>
                                    <button className="btn text-white btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm" style={{ background: '#ff9b29', border: 'none' }} onClick={() => setIsAddReviewOpen(true)}>
                                        <Plus size={16} /> Log Performance Appraisal
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Staff Roster Name</th>
                                                <th>Key KPI Criteria Area</th>
                                                <th>Productivity Index</th>
                                                <th>Corporate Star Review</th>
                                                <th>Manager Appraisal Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {performance.map((perf, idx) => (
                                                <tr key={idx}>
                                                    <td className="ss-item-name">
                                                        <div className="fw-bold" style={{ color: '#1c2b36' }}>{perf.name}</div>
                                                        <span className="small text-muted font-monospace">{perf.empId}</span>
                                                    </td>
                                                    <td className="fw-semibold text-secondary">{perf.kpi}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1.5">
                                                            <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '100px' }}>
                                                                <div className="progress-bar bg-success" style={{ width: `${perf.productivity}%` }} />
                                                            </div>
                                                            <span className="font-monospace fw-bold text-emerald-700">{perf.productivity}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex text-warning">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < perf.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="small text-muted font-italic">{perf.comments}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 10: EMPLOYEE DOCUMENTS VAULT
                            ======================================================== */}
                        {activeTab === 'documents' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Secure Corporate Documents Store</h4>
                                        <p className="text-muted small mb-0">Index verification records for staff members (Aadhaar, PAN, Resume, Agreements)</p>
                                    </div>
                                    <button className="btn text-white btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm" style={{ background: '#ff9b29', border: 'none' }} onClick={() => setIsUploadDocOpen(true)}>
                                        <FileCheck size={16} /> Register Documents Vault
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Staff Roster Name</th>
                                                <th>Document Catalog Type</th>
                                                <th>Indexed File Name</th>
                                                <th>Secure Verification Date</th>
                                                <th>Roster Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc, idx) => (
                                                <tr key={idx}>
                                                    <td className="ss-item-name">
                                                        <div className="fw-bold" style={{ color: '#1c2b36' }}>{doc.name}</div>
                                                        <span className="small text-muted font-monospace">{doc.empId}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge px-2.5 py-1.5 fw-semibold border" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff8926', borderColor: 'rgba(255, 155, 41, 0.2)' }}>{doc.type}</span>
                                                    </td>
                                                    <td className="font-monospace small text-dark d-flex align-items-center gap-1.5">
                                                        <FileText size={14} className="text-secondary" /> {doc.fileName}
                                                    </td>
                                                    <td className="small text-secondary">{doc.date}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-2.5 py-1 fw-bold ${
                                                            doc.status === 'Verified' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                                                        }`}>{doc.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 11: EXPENSE CLAIMS
                            ======================================================== */}
                        {activeTab === 'expenses' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>Expense Claim Reimbursements</h4>
                                        <p className="text-muted small mb-0">Review corporate travel or food claims, log new expenditures, and process reimbursements</p>
                                    </div>
                                    <button className="btn text-white btn-sm px-3 d-flex align-items-center gap-1.5 shadow-sm" style={{ background: '#ff9b29', border: 'none' }} onClick={() => setIsAddExpenseOpen(true)}>
                                        <Plus size={16} /> Submit Expenditure Claim
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="ss-table border">
                                        <thead>
                                            <tr>
                                                <th>Claim Code ID</th>
                                                <th>Staff Roster Name</th>
                                                <th>Expense Category</th>
                                                <th>Claim Date</th>
                                                <th>Reimbursement Amount</th>
                                                <th>Claim Details</th>
                                                <th>Roster Status</th>
                                                <th className="text-end">Audit Authorizations</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map((exp) => (
                                                <tr key={exp.id}>
                                                    <td><span className="ss-code-badge font-monospace" style={{ borderLeft: '3px solid #ff9b29' }}>{exp.id}</span></td>
                                                    <td className="ss-item-name">{exp.name}</td>
                                                    <td className="fw-semibold">{exp.type}</td>
                                                    <td className="small text-secondary">{exp.date}</td>
                                                    <td className="fw-bold" style={{ color: '#ff9b29' }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                                                    <td className="small text-muted">{exp.description}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-2.5 py-1.5 fw-bold ${
                                                            exp.status === 'Approved' ? 'bg-success-subtle text-success' :
                                                            exp.status === 'Rejected' ? 'bg-danger-subtle text-danger' :
                                                            'bg-warning-subtle text-warning'
                                                        }`}>{exp.status}</span>
                                                    </td>
                                                    <td className="text-end">
                                                        {exp.status === 'Pending' ? (
                                                            <div className="d-flex justify-content-end gap-1.5">
                                                                <button className="btn btn-success btn-sm p-1 rounded" onClick={() => handleExpenseDecision(exp.id, 'Approved')}>
                                                                    <Check size={14} />
                                                                </button>
                                                                <button className="btn btn-danger btn-sm p-1 rounded" onClick={() => handleExpenseDecision(exp.id, 'Rejected')}>
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="small text-muted">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ========================================================
                            MODULE 12: HR ANALYTICS REPORTS
                            ======================================================== */}
                        {activeTab === 'reports' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div>
                                        <h4 className="fw-bold mb-0" style={{ color: '#1c2b36' }}>HR Analytics & Roster Reports</h4>
                                        <p className="text-muted small mb-0">Evaluate headcount demographics, leaf ratios, and download audit sheets</p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    {[
                                        { key: 'employees', title: 'Roster Employees Excel Report', desc: 'Roster directory catalog complete with designations, joining dates, base earnings', color: '#ff9b29' },
                                        { key: 'attendance', title: ' Roster Attendance Audit logs', desc: 'Shift clockings, late markings, gate scan check-in ratios', color: '#1c2b36' },
                                        { key: 'payroll', title: 'Salary Runs Payroll Sheets', desc: 'Salary breakdowns including EPF deductions, taxes, monthly payouts', color: '#ff9b29' },
                                        { key: 'leaves', title: 'Roster Leaves Distribution Sheet', desc: 'Sick vs Casual leave days counters and manager approval ratings', color: '#ef4444' }
                                    ].map((report) => (
                                        <div className="col-12 col-md-6" key={report.key}>
                                            <div className="p-4 bg-light rounded-3 border d-flex justify-content-between align-items-center gap-3" style={{ borderLeft: `4px solid ${report.color}` }}>
                                                <div>
                                                    <h6 className="fw-bold mb-1 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}>
                                                        <FileSpreadsheet size={16} style={{ color: report.color }} /> {report.title}
                                                    </h6>
                                                    <p className="small text-secondary mb-0" style={{ fontSize: '12px' }}>{report.desc}</p>
                                                </div>
                                                <button className="btn btn-white border btn-sm shadow-xs d-flex align-items-center gap-1 text-nowrap" 
                                                        onClick={() => handleSimulateCSVDownload(report.key)}>
                                                    <Download size={14} style={{ color: '#ff9b29' }} /> Export CSV
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom HTML/CSS Headcount Bar Charts */}
                                <h6 className="fw-bold mb-3" style={{ color: '#1c2b36' }}>Headcount Distributions across Departments</h6>
                                <div className="p-4 bg-light rounded-3 border">
                                    <div className="d-flex flex-column gap-3.5">
                                        {departments.map(dept => {
                                            const count = getDeptCount(dept.name);
                                            const pct = totalEmployeesCount ? Math.round((count / totalEmployeesCount) * 100) : 0;
                                            return (
                                                <div key={dept.id}>
                                                    <div className="d-flex justify-content-between mb-1.5" style={{ fontSize: '13px', color: '#1c2b36' }}>
                                                        <span className="fw-bold">{dept.name} Department</span>
                                                        <span className="fw-bold">{count} Active Members ({pct}%)</span>
                                                    </div>
                                                    <div className="progress" style={{ height: '10px' }}>
                                                        <div className="progress-bar rounded" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ff9b29 0%, #ff8926 100%)' }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================================================
                GLOBAL MODALS & FULL SCREEN OVERLAYS
                ======================================================== */}

            {/* MODAL 1: ADD STAFF EMPLOYEE FORM */}
            {isAddEmpOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '500px', width: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2.5 mb-3.5">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><UserPlus size={20} style={{ color: '#ff9b29' }} /> Register Roster Employee</h5>
                            <button className="btn-close" onClick={() => setIsAddEmpOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddEmployee}>
                            <div className="row g-2.5 mb-2.5">
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-secondary">Employee Name *</label>
                                    <input type="text" className="form-control" placeholder="Ramesh Patil" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Phone Number *</label>
                                    <input type="text" className="form-control" placeholder="9876543210" value={newEmp.phone} onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Email Address *</label>
                                    <input type="email" className="form-control" placeholder="ramesh@company.com" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} required />
                                </div>
                            </div>

                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Home Address *</label>
                                <textarea className="form-control" rows="2" placeholder="123 Production Road, Pune" value={newEmp.address} onChange={(e) => setNewEmp({ ...newEmp, address: e.target.value })} required />
                            </div>

                            <div className="row g-2.5 mb-2.5">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Department Assignment</label>
                                    <select className="form-select" value={newEmp.dept} onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Corporate Designation</label>
                                    <select className="form-select" value={newEmp.designation} onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}>
                                        {designations.map(d => (
                                            <option key={d.id} value={d.title}>{d.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row g-2.5 mb-3">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Monthly Salary (INR) *</label>
                                    <input type="number" className="form-control" placeholder="35000" value={newEmp.salary} onChange={(e) => setNewEmp({ ...newEmp, salary: parseFloat(e.target.value) || '' })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Shift Timing Plan</label>
                                    <select className="form-select" value={newEmp.shift} onChange={(e) => setNewEmp({ ...newEmp, shift: e.target.value })}>
                                        {shifts.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row g-2.5 mb-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-secondary">Emergency Contact Details *</label>
                                    <input type="text" className="form-control" placeholder="Suresh Patil (Brother) - 9876543211" value={newEmp.emergencyContact} onChange={(e) => setNewEmp({ ...newEmp, emergencyContact: e.target.value })} required />
                                </div>
                            </div>

                            <div className="row g-2.5 mb-3.5">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Joining Date *</label>
                                    <input type="date" className="form-control" value={newEmp.joiningDate} onChange={(e) => setNewEmp({ ...newEmp, joiningDate: e.target.value })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Roster Status</label>
                                    <select className="form-select" value={newEmp.active} onChange={(e) => setNewEmp({ ...newEmp, active: e.target.value })}>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddEmpOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Register Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: ADD DEPARTMENT FORM */}
            {isAddDeptOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Building2 size={20} style={{ color: '#ff9b29' }} /> Create Department</h5>
                            <button className="btn-close" onClick={() => setIsAddDeptOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddDepartment}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Department Name *</label>
                                <input type="text" className="form-control" placeholder="e.g. Sales" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} required />
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Department Head (Director) *</label>
                                <input type="text" className="form-control" placeholder="e.g. Priya Sharma" value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddDeptOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Create Sector</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: ADD DESIGNATION FORM */}
            {isAddDesgOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Award size={20} style={{ color: '#ff9b29' }} /> Add Designation</h5>
                            <button className="btn-close" onClick={() => setIsAddDesgOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddDesignation}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Designation Title *</label>
                                <input type="text" className="form-control" placeholder="e.g. Senior Manager" value={newDesg.title} onChange={(e) => setNewDesg({ ...newDesg, title: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Appraisal Grade Scale *</label>
                                <select className="form-select" value={newDesg.grade} onChange={(e) => setNewDesg({ ...newDesg, grade: e.target.value })}>
                                    <option value="Grade A">Grade A (Executive)</option>
                                    <option value="Grade B">Grade B (Professional)</option>
                                    <option value="Grade C">Grade C (Operator)</option>
                                </select>
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Base Monthly Salary (₹) *</label>
                                <input type="number" className="form-control" placeholder="45000" value={newDesg.baseSalary} onChange={(e) => setNewDesg({ ...newDesg, baseSalary: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddDesgOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Define Title</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 4: APPLY LEAVE FORM */}
            {isApplyLeaveOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Calendar size={20} style={{ color: '#ff9b29' }} /> Apply Leave</h5>
                            <button className="btn-close" onClick={() => setIsApplyLeaveOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleApplyLeave}>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Applicant Employee Name:</label>
                                <select className="form-select border p-2" value={newLeave.name} onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.name}>{e.name} ({e.dept})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Leave Category Plan:</label>
                                <select className="form-select border p-2" value={newLeave.type} onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Paid Leave">Paid Leave</option>
                                </select>
                            </div>
                            <div className="row g-2.5 mb-2.5">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Start Date *</label>
                                    <input type="date" className="form-control" value={newLeave.start} onChange={(e) => setNewLeave({ ...newLeave, start: e.target.value })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">End Date *</label>
                                    <input type="date" className="form-control" value={newLeave.end} onChange={(e) => setNewLeave({ ...newLeave, end: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Reason Details *</label>
                                <textarea className="form-control" rows="2" placeholder="e.g. Dental appointment check" value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsApplyLeaveOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Submit Claim</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 5: POST JOB OPENING FORM */}
            {isAddJobOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Briefcase size={20} style={{ color: '#ff9b29' }} /> Post Job Vacancy</h5>
                            <button className="btn-close" onClick={() => setIsAddJobOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddJob}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Job Vacancy Title *</label>
                                <input type="text" className="form-control" placeholder="e.g. Junior Molding Operator" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Target Sector Department:</label>
                                <select className="form-select border p-2" value={newJob.dept} onChange={(e) => setNewJob({ ...newJob, openings: e.target.value })}>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Open Vacancies Count *</label>
                                <input type="number" className="form-control" placeholder="1" value={newJob.openings} onChange={(e) => setNewJob({ ...newJob, openings: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddJobOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Post Position</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 6: ENROLL CANDIDATE FORM */}
            {isAddCandOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><UserPlus size={20} style={{ color: '#ff9b29' }} /> Enroll Candidate Pipeline</h5>
                            <button className="btn-close" onClick={() => setIsAddCandOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddCandidate}>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Candidate Full Name *</label>
                                <input type="text" className="form-control" placeholder="e.g. Amit Sharma" value={newCand.name} onChange={(e) => setNewCand({ ...newCand, name: e.target.value })} required />
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Target Job Vacancy:</label>
                                <select className="form-select border p-2" value={newCand.job} onChange={(e) => setNewCand({ ...newCand, job: e.target.value })}>
                                    {jobs.map(j => (
                                        <option key={j.id} value={j.title}>{j.title} ({j.dept})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Phone Number *</label>
                                <input type="text" className="form-control" placeholder="9812345600" value={newCand.phone} onChange={(e) => setNewCand({ ...newCand, phone: e.target.value })} required />
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Email Address *</label>
                                <input type="email" className="form-control" placeholder="amit@gmail.com" value={newCand.email} onChange={(e) => setNewCand({ ...newCand, email: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddCandOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Enroll Track</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 7: APPRAISAL SCORECARD FORM */}
            {isAddReviewOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><Star size={20} style={{ color: '#ff9b29' }} /> Appraisal Review</h5>
                            <button className="btn-close" onClick={() => setIsAddReviewOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddReview}>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Target Employee:</label>
                                <select className="form-select border p-2" value={newReview.empId} onChange={(e) => setNewReview({ ...newReview, empId: e.target.value })}>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Key KPI Area Criteria *</label>
                                <input type="text" className="form-control" placeholder="e.g. Audit Integrity" value={newReview.kpi} onChange={(e) => setNewReview({ ...newReview, kpi: e.target.value })} required />
                            </div>
                            <div className="row g-2.5 mb-2.5">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Rating Stars (1-5) *</label>
                                    <input type="number" min="1" max="5" className="form-control" placeholder="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Productivity % *</label>
                                    <input type="number" min="1" max="100" className="form-control" placeholder="90" value={newReview.productivity} onChange={(e) => setNewReview({ ...newReview, productivity: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Appraisal Remarks *</label>
                                <textarea className="form-control" rows="2" placeholder="Describe feedback..." value={newReview.comments} onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddReviewOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Log Score</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 8: REGISTER DOCUMENT VAULT FORM */}
            {isUploadDocOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><FileCheck size={20} style={{ color: '#ff9b29' }} /> Index Documents Store</h5>
                            <button className="btn-close" onClick={() => setIsUploadDocOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleUploadDocSimulate}>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Staff Employee:</label>
                                <select className="form-select border p-2" value={newDoc.empId} onChange={(e) => setNewDoc({ ...newDoc, empId: e.target.value })}>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Document Category Catalog:</label>
                                <select className="form-select border p-2" value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}>
                                    <option value="Aadhaar">Aadhaar Identity Card</option>
                                    <option value="PAN">PAN Tax Identity</option>
                                    <option value="Resume">Resume / Portfolio CV</option>
                                    <option value="Certificates">Certificates / Educational degrees</option>
                                    <option value="Agreements">Joining Employment Agreement</option>
                                </select>
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Attachment File Name *</label>
                                <input type="text" className="form-control" placeholder="e.g. pan_card_v2.pdf" value={newDoc.fileName} onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsUploadDocOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold d-flex justify-content-center align-items-center gap-1.5" style={{ background: '#ff9b29', border: 'none' }} disabled={uploadingDoc}>
                                    {uploadingDoc ? (
                                        <>
                                            <RefreshCw size={14} className="spin" /> Securing uploads...
                                        </>
                                    ) : (
                                        'Secure Index File'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 9: SUBMIT EXPENDITURE CLAIM FORM */}
            {isAddExpenseOpen && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><ShieldAlert size={20} style={{ color: '#ff9b29' }} /> Reimbursement Claim</h5>
                            <button className="btn-close" onClick={() => setIsAddExpenseOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        <form onSubmit={handleAddExpense}>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Roster Employee Applicant:</label>
                                <select className="form-select border p-2" value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.name}>{e.name} ({e.dept})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Expense Category:</label>
                                <select className="form-select border p-2" value={newExpense.type} onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}>
                                    <option value="Travel Expense">Travel Expenditure (Cab, Flight, Train)</option>
                                    <option value="Food Expense">Food Expenditure (Meals, Dinner, Hospitality)</option>
                                </select>
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label small fw-bold text-secondary">Claim Amount (INR) *</label>
                                <input type="number" className="form-control" placeholder="1500" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} required />
                            </div>
                            <div className="mb-3.5">
                                <label className="form-label small fw-bold text-secondary">Expenditure Rationale *</label>
                                <textarea className="form-control" rows="2" placeholder="e.g. Sales team client meet in Thane" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsAddExpenseOpen(false)}>Cancel</button>
                                <button type="submit" className="btn text-white w-100 fw-semibold" style={{ background: '#ff9b29', border: 'none' }}>Submit Claim</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 10: VIEW EMPLOYEE PROFILE PROFILE DETAILS & ID CARD */}
            {selectedProfile && (
                <div className="delete-overlay" style={{ display: 'flex' }}>
                    <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '520px', width: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2.5 mb-3.5">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><User size={20} style={{ color: '#ff9b29' }} /> Corporate Resource Profile</h5>
                            <button className="btn-close" onClick={() => setSelectedProfile(null)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                        </div>
                        
                        <div className="row g-3 mb-4">
                            {/* Personal Bio */}
                            <div className="col-12 col-sm-6">
                                <h6 className="fw-bold border-bottom pb-1 mb-2" style={{ color: '#1c2b36' }}>Professional details</h6>
                                <div className="small text-secondary mb-1.5">Full Name: <span className="fw-semibold text-dark">{selectedProfile.name}</span></div>
                                <div className="small text-secondary mb-1.5">Phone: <span className="text-dark font-monospace fw-semibold">{selectedProfile.phone}</span></div>
                                <div className="small text-secondary mb-1.5">Email: <span className="text-dark">{selectedProfile.email}</span></div>
                                <div className="small text-secondary mb-1.5">Department: <span className="badge" style={{ background: 'rgba(255, 155, 41, 0.08)', color: '#ff8926' }}>{selectedProfile.dept}</span></div>
                                <div className="small text-secondary mb-1.5">Designation: <span className="fw-semibold text-dark">{selectedProfile.designation}</span></div>
                                <div className="small text-secondary mb-1.5">Monthly Pay: <span className="fw-bold" style={{ color: '#ff9b29' }}>₹{selectedProfile.salary.toLocaleString('en-IN')}</span></div>
                                <div className="small text-secondary mb-1.5">Joining Date: <span className="fw-semibold text-dark">{selectedProfile.joiningDate}</span></div>
                                <div className="small text-secondary">Shift Assignment: <span className="text-dark">{selectedProfile.shift}</span></div>
                            </div>
                            
                            {/* Graphic Mock ID Card */}
                            <div className="col-12 col-sm-6 text-center">
                                <h6 className="fw-bold border-bottom pb-1 mb-2" style={{ color: '#1c2b36' }}>Corporate ID Card</h6>
                                <div className="p-3 rounded-3 text-white shadow-sm text-center mx-auto position-relative" 
                                     style={{ width: '200px', background: 'linear-gradient(135deg, #1c2b36 0%, #2a3e4d 100%)', border: '2px solid #ff9b29', overflow: 'hidden' }}>
                                    
                                    {/* Simulated Card Check & Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div style={{ width: '22px', height: '16px', background: '#ff9b29', borderRadius: '3px' }} />
                                        <span className="fw-bold" style={{ fontSize: '9px', letterSpacing: '0.04em', color: '#ff9b29' }}>NAMUSTUTE</span>
                                    </div>
                                    
                                    {/* Mock Photo */}
                                    <div className="w-16 h-16 rounded-full bg-light border border-secondary mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <User size={30} className="text-secondary" />
                                    </div>
                                    
                                    <h6 className="fw-bold mb-0.5 text-white" style={{ fontSize: '12px' }}>{selectedProfile.name}</h6>
                                    <p className="mb-2 font-monospace" style={{ fontSize: '10px', color: '#ffe0b2' }}>{selectedProfile.id}</p>
                                    
                                    <div className="p-1 rounded text-dark font-monospace text-center mb-1" style={{ fontSize: '8.5px', background: '#ff9b29', color: '#fff', fontWeight: '700' }}>
                                        {selectedProfile.designation.toUpperCase()}
                                    </div>
                                    
                                    {/* Retro Barcode Representation */}
                                    <div className="mx-auto" style={{ width: '100px', height: '16px', background: '#fff', padding: '2px', display: 'flex', gap: '2px' }}>
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} style={{ width: (i % 3 === 0 || i % 4 === 0) ? '6px' : '2px', height: '100%', background: '#000' }} />
                                        ))}
                                    </div>
                                    
                                    <div className="small mt-1 text-light" style={{ fontSize: '8px', opacity: 0.8 }}>Security Encrypted Access</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <h6 className="fw-bold border-bottom pb-1 mb-1.5" style={{ fontSize: '13px', color: '#1c2b36' }}>Home Address</h6>
                            <p className="small text-secondary mb-0">{selectedProfile.address}</p>
                        </div>

                        <div className="mb-3.5">
                            <h6 className="fw-bold border-bottom pb-1 mb-1.5" style={{ fontSize: '13px', color: '#1c2b36' }}>Emergency Contact</h6>
                            <p className="small text-danger mb-0 fw-bold">{selectedProfile.emergencyContact}</p>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary w-100" onClick={() => setSelectedProfile(null)}>Close</button>
                            <button className="btn text-white w-100 fw-semibold d-flex justify-content-center align-items-center gap-1.5 shadow-sm" 
                                    style={{ background: '#ff9b29', border: 'none' }}
                                    onClick={() => { window.print(); }}>
                                <Printer size={16} /> Print Card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 11: VIEW & PRINT INVOICE PAYSLIP */}
            {selectedPayslipEmp && (() => {
                const paySalary = selectedPayslipEmp.salary;
                const payHourlyRate = Math.round(paySalary / 160);
                const payOvertimePayout = 10 * Math.round(payHourlyRate * 1.5);
                const payBasic = Math.round(paySalary * 0.60);
                const payHRA = Math.round(paySalary * 0.30);
                const payEPF = Math.round(payBasic * 0.12);
                const payGross = paySalary + payOvertimePayout + 3000;
                const payTax = payGross > 40000 ? Math.round(payGross * 0.10) : payGross > 25000 ? Math.round(payGross * 0.05) : 0;
                const payTakeHome = payGross - (payEPF + payTax + 1000);

                return (
                    <div className="delete-overlay" style={{ display: 'flex' }}>
                        <div className="delete-modal text-start p-4 bg-white rounded-3 border" style={{ maxWidth: '600px', width: '100%' }}>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2.5 mb-4">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-1.5" style={{ color: '#1c2b36' }}><FileText size={20} style={{ color: '#ff9b29' }} /> Corporate Payslip Invoice</h5>
                                <button className="btn-close" onClick={() => setSelectedPayslipEmp(null)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>×</button>
                            </div>

                            <div className="p-4 border bg-light rounded-3 mb-4 font-monospace" style={{ fontSize: '13px' }} id="payslip-print-area">
                                <div className="text-center mb-3">
                                    <h5 className="fw-bold text-dark mb-0">NAMUSTUTE ENTERPRISES SAAS</h5>
                                    <span className="small text-secondary">Operations Hub - Payroll Department</span>
                                    <div className="fw-bold mt-1" style={{ color: '#ff9b29' }}>SALARY SLIP RECORD - MAY 2026</div>
                                </div>
                                <hr className="my-2" />
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <div><strong>Employee ID:</strong> {selectedPayslipEmp.id}</div>
                                        <div><strong>Employee Name:</strong> {selectedPayslipEmp.name}</div>
                                        <div><strong>Department:</strong> {selectedPayslipEmp.dept}</div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div><strong>Designation:</strong> {selectedPayslipEmp.designation}</div>
                                        <div><strong>Shift:</strong> {selectedPayslipEmp.shift}</div>
                                        <div><strong>Audit Sync:</strong> Sync Verified</div>
                                    </div>
                                </div>
                                <hr className="my-2" />
                                
                                <div className="row mb-2">
                                    <div className="col-6"><strong>Earnings Component</strong></div>
                                    <div className="col-6 text-end"><strong>Amount (INR)</strong></div>
                                </div>
                                <div className="d-flex justify-content-between mb-1"><span>Basic Salary (60%):</span><span>₹{payBasic.toLocaleString('en-IN')}</span></div>
                                <div className="d-flex justify-content-between mb-1"><span>House Rent Allowance (30% HRA):</span><span>₹{payHRA.toLocaleString('en-IN')}</span></div>
                                <div className="d-flex justify-content-between mb-1"><span>Overtime Payout (10 Hrs @ 1.5x scale):</span><span>₹{payOvertimePayout.toLocaleString('en-IN')}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Performance Bonus:</span><span>₹3,000</span></div>
                                
                                <hr className="my-2" />
                                <div className="row mb-2">
                                    <div className="col-6"><strong>Deductions Component</strong></div>
                                    <div className="col-6 text-end"><strong>Amount (INR)</strong></div>
                                </div>
                                <div className="d-flex justify-content-between mb-1 text-danger"><span>Provident Fund (12% EPF):</span><span>₹{payEPF.toLocaleString('en-IN')}</span></div>
                                <div className="d-flex justify-content-between mb-1 text-danger"><span>Income Tax (TDS Component):</span><span>₹{payTax.toLocaleString('en-IN')}</span></div>
                                <div className="d-flex justify-content-between mb-2 text-danger"><span>Other Miscellaneous Deductions:</span><span>₹1,000</span></div>
                                
                                <hr className="my-2" />
                                <div className="p-2.5 bg-white border rounded d-flex justify-content-between align-items-center mt-3" style={{ borderLeft: '4px solid #ff9b29' }}>
                                    <strong>NET MONTHLY DISBURSEMENT OUT-HAND:</strong>
                                    <strong style={{ color: '#ff8926', fontSize: '18px' }}>₹{payTakeHome.toLocaleString('en-IN')}</strong>
                                </div>
                                <div className="mt-3.5 text-center text-muted" style={{ fontSize: '10.5px' }}>
                                    This is a system generated sync-audited payslip invoice receipt. Signature not required.
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary w-100" onClick={() => setSelectedPayslipEmp(null)}>Close</button>
                                <button className="btn text-white w-100 fw-semibold d-flex justify-content-center align-items-center gap-1.5 shadow-sm" 
                                        style={{ background: '#ff9b29', border: 'none' }}
                                        onClick={() => { window.print(); }}>
                                    <Printer size={16} /> Print Payslip Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}
