// 模拟用户数据
let users = [
    { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: 'active' },
    { id: 2, username: 'editor1', email: 'editor1@example.com', role: '编辑', status: 'active' },
    { id: 3, username: 'viewer1', email: 'viewer1@example.com', role: '查看者', status: 'active' },
    { id: 4, username: 'editor2', email: 'editor2@example.com', role: '编辑', status: 'inactive' },
    { id: 5, username: 'viewer2', email: 'viewer2@example.com', role: '查看者', status: 'active' },
    { id: 6, username: 'admin2', email: 'admin2@example.com', role: '管理员', status: 'active' }
];

// 模拟日志数据
const logs = [
    { id: 1, time: '2023-05-15 10:30:22', operator: 'admin', action: '登录系统', ip: '192.168.1.100', type: 'login' },
    { id: 2, time: '2023-05-15 11:15:45', operator: 'admin', action: '创建用户: editor2', ip: '192.168.1.100', type: 'edit' },
    { id: 3, time: '2023-05-15 14:20:18', operator: 'admin', action: '修改用户: viewer1 的信息', ip: '192.168.1.100', type: 'edit' },
    { id: 4, time: '2023-05-15 16:45:30', operator: 'editor1', action: '更新文章: 系统公告', ip: '192.168.1.101', type: 'edit' },
    { id: 5, time: '2023-05-15 17:30:05', operator: 'admin', action: '删除用户: old_user', ip: '192.168.1.100', type: 'delete' }
];

// DOM元素
const elements = {
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    menuItems: document.querySelectorAll('.menu-item'),
    pages: document.querySelectorAll('.page'),
    userCount: document.getElementById('userCount'),
    userTableBody: document.getElementById('userTableBody'),
    addUserBtn: document.getElementById('addUserBtn'),
    addUserModal: document.getElementById('addUserModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelUserBtn: document.getElementById('cancelUserBtn'),
    userForm: document.getElementById('userForm'),
    settingsForm: document.getElementById('settingsForm'),
    searchUser: document.getElementById('searchUser'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    currentPage: document.getElementById('currentPage'),
    logTableBody: document.getElementById('logTableBody'),
    logDateFilter: document.getElementById('logDateFilter'),
    logTypeFilter: document.getElementById('logTypeFilter'),
    logoutBtn: document.getElementById('logoutBtn'),
    currentDate: document.getElementById('currentDate'),
    activityChart: document.getElementById('activityChart')
};

// 分页状态
const pagination = {
    currentPage: 1,
    itemsPerPage: 5
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initSystem();
    renderUserTable();
    renderLogTable();
    setupEventListeners();
});

function initSystem() {
    // 设置当前日期
    const now = new Date();
    elements.currentDate.textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 更新用户计数
    elements.userCount.textContent = users.length;
    
    // 初始化图表
    initChart();
}

function initChart() {
    const ctx = elements.activityChart.getContext('2d');
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    
    // 绘制图表
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '用户活跃度',
                data: [120, 190, 140, 220, 180, 150, 210],
                backgroundColor: gradient,
                borderColor: '#3b82f6',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderUserTable() {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const usersToShow = users.slice(startIndex, endIndex);
    
    elements.userTableBody.innerHTML = '';
    
    usersToShow.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'active' : 'inactive'}">
                ${user.status === 'active' ? '活跃' : '停用'}
            </span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">${user.status === 'active' ? '停用' : '启用'}</button>
            </td>
        `;
        elements.userTableBody.appendChild(tr);
    });
    
    elements.currentPage.textContent = pagination.currentPage;
}

function renderLogTable() {
    elements.logTableBody.innerHTML = '';
    
    logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.time}</td>
            <td>${log.operator}</td>
            <td>${log.action}</td>
            <td>${log.ip}</td>
        `;
        elements.logTableBody.appendChild(tr);
    });
}

function setupEventListeners() {
    // 菜单切换
    elements.menuToggle.addEventListener('click', function() {
        elements.sidebar.classList.toggle('active');
    });
    
    // 菜单项点击
    elements.menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            elements.menuItems.forEach(i => i.classList.remove('active'));
            // 给当前点击项添加active类
            this.classList.add('active');
            
            // 切换页面
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
        });
    });
    
    // 添加用户按钮点击
    elements.addUserBtn.addEventListener('click', function() {
        elements.addUserModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.cancelUserBtn.addEventListener('click', closeModal);
    
    // 用户表单提交
    elements.userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // 创建新用户
        const newUser = {
            id: users.length + 1,
            username,
            email,
            role: role === 'admin' ? '管理员' : 
                  role === 'editor' ? '编辑' : '查看者',
            status: 'active'
        };
        
        // 添加到用户数组
        users.push(newUser);
        
        // 重新渲染表格
        renderUserTable();
        
        // 更新用户计数
        elements.userCount.textContent = users.length;
        
        // 关闭模态框
        closeModal();
        
        // 重置表单
        elements.userForm.reset();
        
        // 显示成功消息
        showNotification('用户添加成功！', 'success');
    });
    
    // 设置表单提交
    elements.settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('系统设置已保存！', 'success');
    });
    
    // 用户搜索
    elements.searchUser.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm === '') {
            renderUserTable();
            return;
        }
        
        const filteredUsers = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm)
        );
        
        // 临时显示搜索结果
        elements.userTableBody.innerHTML = '';
        
        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge ${user.status === 'active' ? 'active' : 'inactive'}">
                    ${user.status === 'active' ? '活跃' : '停用'}
                </span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">${user.status === 'active' ? '停用' : '启用'}</button>
                </td>
            `;
            elements.userTableBody.appendChild(tr);
        });
    });
    
    // 分页按钮
    elements.prevPage.addEventListener('click', function() {
        if (pagination.currentPage > 1) {
            pagination.currentPage--;
            renderUserTable();
        }
    });
    
    elements.nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(users.length / pagination.itemsPerPage);
        if (pagination.currentPage < totalPages) {
            pagination.currentPage++;
            renderUserTable();
        }
    });
    
    // 日志筛选
    elements.logDateFilter.addEventListener('change', renderLogTable);
    elements.logTypeFilter.addEventListener('change', renderLogTable);
    
    // 退出登录
    elements.logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出系统吗？')) {
            // 在实际应用中，这里会清除登录状态并重定向
            showNotification('您已成功退出系统', 'info');
        }
    });
    
    // 主题选择
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            // 在实际应用中，这里会保存主题设置
            showNotification('主题已切换', 'info');
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === elements.addUserModal) {
            closeModal();
        }
    });
}

function switchPage(pageId) {
    // 隐藏所有页面
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示当前页面
    document.getElementById(pageId).classList.add('active');
    
    // 如果是小屏幕，关闭侧边栏
    if (window.innerWidth < 768) {
        elements.sidebar.classList.remove('active');
    }
}

function closeModal() {
    elements.addUserModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    elements.userForm.reset();
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        // 在实际应用中，这里会打开编辑模态框
        showNotification(`正在编辑用户: ${user.username}`, 'info');
    }
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        const action = user.status === 'active' ? '停用' : '启用';
        
        if (confirm(`确定要${action}用户 "${user.username}" 吗？`)) {
            user.status = user.status === 'active' ? 'inactive' : 'active';
            renderUserTable();
            showNotification(`用户 "${user.username}" 已${action}`, 'success');
        }
    }
}

function showNotification(message, type) {
    // 在实际应用中，这里会显示一个美观的通知
    alert(message);
}

// 使函数在全局可访问（实际应用中应该避免）
window.editUser = editUser;
window.deleteUser = deleteUser;
