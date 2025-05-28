// 数据存储类
class DataStore {
    static getUsers() {
        const users = localStorage.getItem('admin_users');
        return users ? JSON.parse(users) : [
            { 
                id: 1, 
                username: 'admin', 
                email: 'admin@example.com', 
                role: 'admin', 
                roleName: '管理员',
                status: 'active',
                avatar: 'A',
                password: 'admin123' // 实际应用中应存储哈希值
            }
        ];
    }

    static saveUsers(users) {
        localStorage.setItem('admin_users', JSON.stringify(users));
    }

    static getSettings() {
        const settings = localStorage.getItem('admin_settings');
        return settings ? JSON.parse(settings) : {
            systemName: '后台管理系统',
            itemsPerPage: 10,
            theme: 'blue',
            systemVersion: '1.0.0'
        };
    }

    static saveSettings(settings) {
        localStorage.setItem('admin_settings', JSON.stringify(settings));
    }

    static getLogs() {
        const logs = localStorage.getItem('admin_logs');
        return logs ? JSON.parse(logs) : [
            { 
                id: 1, 
                time: new Date().toLocaleString(), 
                operator: '系统', 
                action: '系统初始化', 
                type: 'system'
            }
        ];
    }

    static saveLogs(logs) {
        localStorage.setItem('admin_logs', JSON.stringify(logs));
    }

    static addLog(action, type, operator) {
        const logs = this.getLogs();
        const newLog = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            time: new Date().toLocaleString(),
            operator: operator || 'admin',
            action: action,
            type: type || 'system'
        };
        logs.unshift(newLog);
        this.saveLogs(logs);
        return newLog;
    }
}

// 应用状态管理
class AppState {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.userPagination = {
            currentPage: 1,
            itemsPerPage: 10
        };
        this.logPagination = {
            currentPage: 1,
            itemsPerPage: 10
        };
    }

    login(user) {
        this.currentUser = user;
        DataStore.addLog(`用户登录: ${user.username}`, 'login', user.username);
        return true;
    }

    logout() {
        if (this.currentUser) {
            DataStore.addLog(`用户退出: ${this.currentUser.username}`, 'login', this.currentUser.username);
        }
        this.currentUser = null;
        return true;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// DOM 元素
const DOM = {
    loginContainer: document.getElementById('loginContainer'),
    adminContainer: document.getElementById('adminContainer'),
    loginBtn: document.getElementById('loginBtn'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    logoutBtn: document.getElementById('logoutBtn'),
    currentUser: document.getElementById('currentUser'),
    userAvatar: document.getElementById('userAvatar'),
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    menuItems: document.querySelectorAll('.menu-item'),
    pages: document.querySelectorAll('.page'),
    userCount: document.getElementById('userCount'),
    userTableBody: document.getElementById('userTableBody'),
    addUserBtn: document.getElementById('addUserBtn'),
    userModal: document.getElementById('userModal'),
    modalTitle: document.getElementById('modalTitle'),
    closeUserModalBtn: document.getElementById('closeUserModalBtn'),
    cancelUserBtn: document.getElementById('cancelUserBtn'),
    userForm: document.getElementById('userForm'),
    editUserId: document.getElementById('editUserId'),
    settingsForm: document.getElementById('settingsForm'),
    systemName: document.getElementById('systemName'),
    itemsPerPage: document.getElementById('itemsPerPage'),
    systemVersionInput: document.getElementById('systemVersionInput'),
    searchUser: document.getElementById('searchUser'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    currentPage: document.getElementById('currentPage'),
    logTableBody: document.getElementById('logTableBody'),
    logDateFilter: document.getElementById('logDateFilter'),
    logTypeFilter: document.getElementById('logTypeFilter'),
    logPrevPage: document.getElementById('logPrevPage'),
    logNextPage: document.getElementById('logNextPage'),
    logCurrentPage: document.getElementById('logCurrentPage'),
    currentDate: document.getElementById('currentDate'),
    currentDateTime: document.getElementById('currentDateTime'),
    systemVersion: document.getElementById('systemVersion'),
    systemStatus: document.getElementById('systemStatus'),
    recentActivities: document.getElementById('recentActivities')
};

// 应用状态
const appState = new AppState();

// 初始化应用
function initApp() {
    // 初始化日期时间
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 加载设置
    loadSettings();
    
    // 绑定事件监听器
    bindEvents();
    
    // 检查登录状态
    checkLoginState();
}

// 更新日期时间
function updateDateTime() {
    const now = new Date();
    DOM.currentDate.textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    DOM.currentDateTime.textContent = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 加载设置
function loadSettings() {
    const settings = DataStore.getSettings();
    DOM.systemName.value = settings.systemName;
    DOM.itemsPerPage.value = settings.itemsPerPage;
    DOM.systemVersionInput.value = settings.systemVersion;
    DOM.systemVersion.textContent = settings.systemVersion;
    
    // 设置主题
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === settings.theme) {
            option.classList.add('active');
        }
    });
    
    // 更新分页设置
    appState.userPagination.itemsPer
