
class Node {
    constructor(roll, name, gpa) {
        this.roll = roll;
        this.name = name;
        this.gpa = gpa;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }


    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }


    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }


    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }


    insert(roll, name, gpa) {
        this.root = this.insertNode(this.root, roll, name, gpa);
    }

    insertNode(node, roll, name, gpa) {

        if (!node) {
            return new Node(roll, name, gpa);
        }

        if (roll < node.roll) {
            node.left = this.insertNode(node.left, roll, name, gpa);
        } else if (roll > node.roll) {
            node.right = this.insertNode(node.right, roll, name, gpa);
        } else {

            node.name = name;
            node.gpa = gpa;
            return node;
        }


        this.updateHeight(node);

 
        const balance = this.getBalance(node);

  
        if (balance > 1 && roll < node.left.roll) {
            return this.rotateRight(node);
        }


        if (balance < -1 && roll > node.right.roll) {
            return this.rotateLeft(node);
        }


        if (balance > 1 && roll > node.left.roll) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && roll < node.right.roll) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    findMin(node) {
        while (node && node.left) {
            node = node.left;
        }
        return node;
    }


    delete(roll) {
        this.root = this.deleteNode(this.root, roll);
    }

    deleteNode(node, roll) {
        if (!node) return null;

        if (roll < node.roll) {
            node.left = this.deleteNode(node.left, roll);
        } else if (roll > node.roll) {
            node.right = this.deleteNode(node.right, roll);
        } else {

            if (!node.left || !node.right) {
                const temp = node.left ? node.left : node.right;
                if (!temp) {
                    return null;
                } else {
                    node = temp;
                }
            } else {
                const temp = this.findMin(node.right);
                node.roll = temp.roll;
                node.name = temp.name;
                node.gpa = temp.gpa;
                node.right = this.deleteNode(node.right, temp.roll);
            }
        }

        this.updateHeight(node);

        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);
        }

        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    search(roll) {
        let current = this.root;
        while (current && current.roll !== roll) {
            current = roll < current.roll ? current.left : current.right;
        }
        return current;
    }

    inorder(node = this.root, result = []) {
        if (node) {
            this.inorder(node.left, result);
            result.push(node);
            this.inorder(node.right, result);
        }
        return result;
    }

 
    levelOrder() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }


    getStats() {
        const nodes = this.inorder();
        const count = nodes.length;
        const sum = nodes.reduce((acc, node) => acc + node.gpa, 0);
        const average = count > 0 ? sum / count : 0;
        
        const distribution = [0, 0, 0, 0]; // A+, A, B, C
        nodes.forEach(node => {
            if (node.gpa >= 9.0) distribution[0]++;
            else if (node.gpa >= 8.0) distribution[1]++;
            else if (node.gpa >= 7.0) distribution[2]++;
            else distribution[3]++;
        });
        
        return { count, average, distribution };
    }

    filterByGPA(minGpa, maxGpa) {
        const nodes = this.inorder();
        return nodes.filter(node => node.gpa >= minGpa && node.gpa <= maxGpa);
    }

    searchByName(pattern) {
        const nodes = this.inorder();
        return nodes.filter(node => 
            node.name.toLowerCase().includes(pattern.toLowerCase())
        );
    }


    clear() {
        this.root = null;
    }


    exportToCSV() {
        const nodes = this.inorder();
        const csvContent = "Roll,Name,GPA\n" + 
            nodes.map(node => `${node.roll},${node.name},${node.gpa.toFixed(2)}`).join('\n');
        return csvContent;
    }

 
    saveToStorage() {
        const data = this.inorder();
        localStorage.setItem('studentRecords', JSON.stringify(data));
    }


    loadFromStorage() {
        const data = localStorage.getItem('studentRecords');
        if (data) {
            const records = JSON.parse(data);
            this.clear();
            records.forEach(record => {
                this.insert(record.roll, record.name, record.gpa);
            });
            return true;
        }
        return false;
    }
}


class StudentRecordsUI {
    constructor() {
        this.tree = new AVLTree();
        this.initializeEventListeners();
        this.loadInitialData();
        this.showWelcomeMessage();
    }

    initializeEventListeners() {
        
        document.getElementById('addStudentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddStudent();
        });

        
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

   
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.handleDelete();
        });

        document.getElementById('nameSearchBtn').addEventListener('click', () => {
            this.handleNameSearch();
        });

        document.getElementById('filterBtn').addEventListener('click', () => {
            this.handleGPAFilter();
        });

        
        document.getElementById('inorderBtn').addEventListener('click', () => {
            this.showInorderView();
        });

        document.getElementById('levelOrderBtn').addEventListener('click', () => {
            this.showLevelOrderView();
        });

        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStatistics();
        });

   
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.handleSave();
        });

        document.getElementById('loadBtn').addEventListener('click', () => {
            this.handleLoad();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.handleExport();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.handleClear();
        });

        document.getElementById('emailBtn').addEventListener('click', () => {
            this.showEmailModal();
        });

        document.getElementById('closeEmailModal').addEventListener('click', () => {
            this.hideEmailModal();
        });

        document.getElementById('cancelEmailBtn').addEventListener('click', () => {
            this.hideEmailModal();
        });

        document.getElementById('sendEmailBtn').addEventListener('click', () => {
            this.handleSendEmail();
        });


        document.getElementById('emailModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideEmailModal();
            }
        });
    }

    loadInitialData() {

        this.tree.insert(65, "Smit Chauhan", 8.1);
        this.tree.insert(66, "Param Mehta", 8.5);
        this.tree.insert(68, "Atharva Yadav", 9.0);
    }

    showWelcomeMessage() {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-info-circle"></i>
                <h3>Welcome to Student Records Manager!</h3>
                <p>Use the controls on the left to manage student records. Your data will appear here.</p>
            </div>
        `;
    }

    handleAddStudent() {
        const roll = parseInt(document.getElementById('rollNumber').value);
        const name = document.getElementById('studentName').value.trim();
        const gpa = parseFloat(document.getElementById('gpa').value);

        if (!roll || !name || isNaN(gpa) || gpa < 0 || gpa > 10) {
            this.showToast('Please enter valid data!', 'error');
            return;
        }

        const existingStudent = this.tree.search(roll);
        this.tree.insert(roll, name, gpa);
        
        const message = existingStudent ? 
            `Student ${name} (Roll: ${roll}) updated successfully!` :
            `Student ${name} (Roll: ${roll}) added successfully!`;
        
        this.showToast(message, 'success');
        this.clearForm();
    }

    handleSearch() {
        const roll = parseInt(document.getElementById('searchRoll').value);
        
        if (!roll) {
            this.showToast('Please enter a roll number!', 'error');
            return;
        }

        const student = this.tree.search(roll);
        if (student) {
            this.displayStudents([student], 'Search Result');
        } else {
            this.showToast('Student not found!', 'error');
        }
    }

    handleDelete() {
        const roll = parseInt(document.getElementById('deleteRoll').value);
        
        if (!roll) {
            this.showToast('Please enter a roll number!', 'error');
            return;
        }

        const student = this.tree.search(roll);
        if (student) {
            this.tree.delete(roll);
            this.showToast(`Student with Roll ${roll} deleted successfully!`, 'success');
        } else {
            this.showToast('Student not found!', 'error');
        }
    }

    handleNameSearch() {
        const pattern = document.getElementById('namePattern').value.trim();
        
        if (!pattern) {
            this.showToast('Please enter a name pattern!', 'error');
            return;
        }

        const students = this.tree.searchByName(pattern);
        if (students.length > 0) {
            this.displayStudents(students, `Students matching "${pattern}"`);
        } else {
            this.showToast('No students found matching the pattern!', 'error');
        }
    }

    handleGPAFilter() {
        const minGpa = parseFloat(document.getElementById('minGpa').value) || 0;
        const maxGpa = parseFloat(document.getElementById('maxGpa').value) || 10;

        if (minGpa > maxGpa) {
            this.showToast('Minimum GPA cannot be greater than maximum GPA!', 'error');
            return;
        }

        const students = this.tree.filterByGPA(minGpa, maxGpa);
        if (students.length > 0) {
            this.displayStudents(students, `Students with GPA ${minGpa} - ${maxGpa}`);
        } else {
            this.showToast('No students found in the specified GPA range!', 'error');
        }
    }

    showInorderView() {
        const students = this.tree.inorder();
        this.displayStudents(students, 'Sorted View (Inorder)');
    }

    showLevelOrderView() {
        const students = this.tree.levelOrder();
        this.displayStudents(students, 'Level Order View');
    }

    showStatistics() {
        const stats = this.tree.getStats();
        const resultsArea = document.getElementById('resultsArea');
        
        resultsArea.innerHTML = `
            <div class="stats-container">
                <h3><i class="fas fa-chart-bar"></i> Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${stats.count}</div>
                        <div class="stat-label">Total Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.average.toFixed(2)}</div>
                        <div class="stat-label">Average GPA</div>
                    </div>
                </div>
                <h4>Grade Distribution:</h4>
                <div class="grade-distribution">
                    <div class="grade-item grade-a-plus">
                        <div>A+ (9.0+)</div>
                        <div>${stats.distribution[0]} students</div>
                    </div>
                    <div class="grade-item grade-a">
                        <div>A (8.0+)</div>
                        <div>${stats.distribution[1]} students</div>
                    </div>
                    <div class="grade-item grade-b">
                        <div>B (7.0+)</div>
                        <div>${stats.distribution[2]} students</div>
                    </div>
                    <div class="grade-item grade-c">
                        <div>C (&lt;7.0)</div>
                        <div>${stats.distribution[3]} students</div>
                    </div>
                </div>
            </div>
        `;
    }

    handleSave() {
        this.tree.saveToStorage();
        this.showToast('Data saved successfully!', 'success');
    }

    handleLoad() {
        if (this.tree.loadFromStorage()) {
            this.showToast('Data loaded successfully!', 'success');
        } else {
            this.showToast('No saved data found!', 'error');
        }
    }

    handleExport() {
        const csvContent = this.tree.exportToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('CSV file exported successfully!', 'success');
    }

    handleClear() {
        if (confirm('Are you sure you want to clear all data?')) {
            this.tree.clear();
            this.showWelcomeMessage();
            this.showToast('All data cleared!', 'success');
        }
    }

    showEmailModal() {
        const modal = document.getElementById('emailModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideEmailModal() {
        const modal = document.getElementById('emailModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.clearEmailForm();
    }

    clearEmailForm() {
        document.getElementById('emailForm').reset();
        document.getElementById('emailSubject').value = 'Student Records CSV File';
        document.getElementById('emailMessage').value = 'Please find attached the student records CSV file.';
        document.getElementById('senderEmail').value = '';
    }

    handleSendEmail() {
        const recipientEmail = document.getElementById('recipientEmail').value.trim();
        const subject = document.getElementById('emailSubject').value.trim();
        const message = document.getElementById('emailMessage').value.trim();
        const senderEmail = document.getElementById('senderEmail').value.trim();


        if (!recipientEmail || !subject || !message) {
            this.showToast('Please fill in recipient email, subject, and message!', 'error');
            return;
        }

        if (!this.isValidEmail(recipientEmail)) {
            this.showToast('Please enter a valid recipient email address!', 'error');
            return;
        }

        if (senderEmail && !this.isValidEmail(senderEmail)) {
            this.showToast('Please enter a valid sender email address!', 'error');
            return;
        }

        try {
     
            const csvContent = this.tree.exportToCSV();
            
    
            this.openGmailWithCSV(recipientEmail, subject, message, senderEmail, csvContent);
            
            this.showToast('Opening Gmail with your email ready to send!', 'success');
            this.hideEmailModal();
            
        } catch (error) {
            console.error('Error preparing email:', error);
            this.showToast('Error preparing email. Please try again.', 'error');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    openGmailWithCSV(recipientEmail, subject, message, senderEmail, csvContent) {

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
  
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'students.csv';
        document.body.appendChild(downloadLink);
        

        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(`${message}\n\nPlease find the student records CSV file attached.`);
        const encodedCC = senderEmail ? encodeURIComponent(senderEmail) : '';
        
  
        let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodedSubject}&body=${encodedBody}`;
        
        if (encodedCC) {
            gmailUrl += `&cc=${encodedCC}`;
        }
        
       
        downloadLink.click();
        
      
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
        
   
        window.open(gmailUrl, '_blank');
        
    
        setTimeout(() => {
            this.showToast('CSV file downloaded! Attach it to your Gmail and send.', 'success');
        }, 1000);
    }

    displayStudents(students, title) {
        const resultsArea = document.getElementById('resultsArea');
        
        if (students.length === 0) {
            resultsArea.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-info-circle"></i>
                    <h3>No Students Found</h3>
                    <p>No students match the current criteria.</p>
                </div>
            `;
            return;
        }

        const studentsHTML = students.map(student => `
            <div class="student-card">
                <h4>${student.name}</h4>
                <div class="student-info">
                    <span><strong>Roll Number:</strong> ${student.roll}</span>
                    <span><strong>GPA:</strong> ${student.gpa.toFixed(2)}</span>
                    <span><strong>Grade:</strong> ${this.getGrade(student.gpa)}</span>
                </div>
            </div>
        `).join('');

        resultsArea.innerHTML = `
            <div class="results-header">
                <h3><i class="fas fa-users"></i> ${title} (${students.length} students)</h3>
            </div>
            ${studentsHTML}
        `;
    }

    getGrade(gpa) {
        if (gpa >= 9.0) return 'A+';
        if (gpa >= 8.0) return 'A';
        if (gpa >= 7.0) return 'B';
        return 'C';
    }

    clearForm() {
        document.getElementById('addStudentForm').reset();
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        toast.className = `toast ${type}`;
        toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new StudentRecordsUI();
});
