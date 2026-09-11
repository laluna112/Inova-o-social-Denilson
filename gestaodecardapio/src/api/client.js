import { runtimeConfig } from '@/config/runtime';

const STORAGE_KEYS = {
  users: `${runtimeConfig.storagePrefix}_users`,
  sessions: `${runtimeConfig.storagePrefix}_sessions`,
  authToken: `${runtimeConfig.storagePrefix}_auth_token`,
  pendingRegistrations: `${runtimeConfig.storagePrefix}_pending_registrations`,
  resetTokens: `${runtimeConfig.storagePrefix}_reset_tokens`,
  menuItems: `${runtimeConfig.storagePrefix}_menu_items`,
  avisos: `${runtimeConfig.storagePrefix}_avisos`,
};

const isBrowser = typeof window !== 'undefined';
const storage = isBrowser ? window.localStorage : null;

const loadValue = (key, defaultValue) => {
  if (!storage) return defaultValue;
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveValue = (key, value) => {
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const removeValue = (key) => {
  if (!storage) return;
  storage.removeItem(key);
};

const generateId = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
const generateToken = () => Math.random().toString(36).slice(2, 18);
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const seedUsers = () => {
  const users = loadValue(STORAGE_KEYS.users, []);
  if (users.length > 0) return users;

  const defaultUsers = [
    {
      id: generateId('user'),
      email: 'admin@escolaintegral.com',
      password: 'admin123',
      full_name: 'Administrador Mestre',
      role: 'admin',
      is_master: true,
    },
    {
      id: generateId('user'),
      email: 'admin@example.com',
      password: 'admin123',
      full_name: 'Administrador',
      role: 'admin',
    },
  ];

  if (runtimeConfig.enableSeedData) {
    defaultUsers.push({
      id: generateId('user'),
      email: 'aluno@example.com',
      password: 'aluno123',
      full_name: 'Aluno Local',
      role: 'user',
    });
  }

  saveValue(STORAGE_KEYS.users, defaultUsers);
  return defaultUsers;
};

const seedMenuItems = () => {
  if (!runtimeConfig.enableSeedData) {
    const items = loadValue(STORAGE_KEYS.menuItems, []);
    return items;
  }

  const items = loadValue(STORAGE_KEYS.menuItems, []);
  if (items.length > 0) return items;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const format = (date) => date.toISOString().split('T')[0];
  const createItem = (name, description, calories, date, meal_type, is_vegetarian = false) => ({
    id: generateId('menu'),
    name,
    description,
    calories,
    menu_date: format(date),
    meal_type,
    is_vegetarian,
    created_date: new Date().toISOString(),
  });

  const sampleItems = [
    createItem('Arroz e feijão', 'Arroz branco com feijão temperado', 320, today, 'almoco'),
    createItem('Omelete de legumes', 'Omelete leve com cenoura e ervilha', 240, today, 'cafe_da_manha', true),
    createItem('Sanduíche natural', 'Pão integral com frango e verduras', 280, new Date(today.getTime() + 24 * 60 * 60 * 1000), 'lanche_da_tarde'),
    createItem('Macarrão ao molho', 'Macarrão com molho de tomate e queijo', 410, new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), 'almoco'),
    createItem('Crepioca', 'Crepioca com queijo e orégano', 210, new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), 'cafe_da_manha', true),
    createItem('Salada de frutas', 'Frutas frescas da estação', 150, new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), 'lanche_da_tarde', true),
  ];
  saveValue(STORAGE_KEYS.menuItems, sampleItems);
  return sampleItems;
};

const seedAvisos = () => {
  if (!runtimeConfig.enableSeedData) {
    const items = loadValue(STORAGE_KEYS.avisos, []);
    return items;
  }

  const items = loadValue(STORAGE_KEYS.avisos, []);
  if (items.length > 0) return items;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  const createAviso = (title, message, date, type = 'aviso', meal_type = 'geral', is_active = true) => ({
    id: generateId('aviso'),
    title,
    message,
    affected_date: date.toISOString().split('T')[0],
    type,
    meal_type,
    is_active,
    created_date: new Date().toISOString(),
  });

  const sampleAvisos = [
    createAviso('Refeição especial', 'Amanhã teremos bolo de cenoura no lanche.', tomorrow, 'aviso', 'lanche_da_tarde'),
    createAviso('Falta de sal', 'O almoço de quarta-feira poderá ficar menos salgado.', nextWeek, 'alteracao', 'almoco'),
    createAviso('Cardápio da semana', 'Confira o cardápio atualizado para toda a semana.', today, 'geral', 'geral'),
  ];
  saveValue(STORAGE_KEYS.avisos, sampleAvisos);
  return sampleAvisos;
};

const loadUsers = () => seedUsers();
const loadMenuItems = () => seedMenuItems();
const loadAvisos = () => seedAvisos();
const loadSessions = () => loadValue(STORAGE_KEYS.sessions, {});
const loadPendingRegistrations = () => loadValue(STORAGE_KEYS.pendingRegistrations, {});
const loadResetTokens = () => loadValue(STORAGE_KEYS.resetTokens, {});

const saveUsers = (users) => saveValue(STORAGE_KEYS.users, users);
const saveMenuItems = (items) => saveValue(STORAGE_KEYS.menuItems, items);
const saveAvisos = (items) => saveValue(STORAGE_KEYS.avisos, items);
const saveSessions = (sessions) => saveValue(STORAGE_KEYS.sessions, sessions);
const savePendingRegistrations = (data) => saveValue(STORAGE_KEYS.pendingRegistrations, data);
const saveResetTokens = (data) => saveValue(STORAGE_KEYS.resetTokens, data);

const debugLog = (...args) => {
  if (runtimeConfig.debugLogs && typeof console !== 'undefined') {
    console.info(...args);
  }
};

const getCurrentToken = () => (storage ? storage.getItem(STORAGE_KEYS.authToken) : null);
const setCurrentToken = (token) => {
  if (!storage) return;
  if (!token) {
    storage.removeItem(STORAGE_KEYS.authToken);
    return;
  }
  storage.setItem(STORAGE_KEYS.authToken, token);
};

const omitPassword = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const matchesQuery = (item, query) => {
  if (!query || Object.keys(query).length === 0) return true;
  return Object.entries(query).every(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value).every(([operator, compareValue]) => {
        if (operator === '$gte') return item[key] >= compareValue;
        if (operator === '$lte') return item[key] <= compareValue;
        if (operator === '$gt') return item[key] > compareValue;
        if (operator === '$lt') return item[key] < compareValue;
        if (operator === '$ne') return item[key] !== compareValue;
        if (operator === '$eq') return item[key] === compareValue;
        return false;
      });
    }
    return item[key] === value;
  });
};

const sortItems = (items, sort) => {
  if (!sort || typeof sort !== 'string') return items;
  const fields = sort.split(',').map((field) => field.trim()).filter(Boolean);
  if (fields.length === 0) return items;

  return [...items].sort((a, b) => {
    for (const field of fields) {
      let direction = 1;
      let key = field;
      if (field.startsWith('-')) {
        direction = -1;
        key = field.slice(1);
      }
      if (a[key] === b[key]) continue;
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';
      if (aValue > bValue) return direction;
      if (aValue < bValue) return -direction;
    }
    return 0;
  });
};

const createSession = (userId) => {
  const sessions = loadSessions();
  const token = generateToken();
  sessions[token] = userId;
  saveSessions(sessions);
  setCurrentToken(token);
  return token;
};

const auth = {
  me: async () => {
    const token = getCurrentToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const sessions = loadSessions();
    const userId = sessions[token];
    if (!userId) {
      throw new Error('Session expired');
    }
    const user = loadUsers().find((item) => item.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return omitPassword(user);
  },

  logout: () => {
    setCurrentToken(null);
  },

  redirectToLogin: (redirectUrl = '/login') => {
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },

  loginViaEmailPassword: async (email, password) => {
    const users = loadUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('E-mail ou senha inválidos');
    }
    createSession(user.id);
    return omitPassword(user);
  },

  loginWithProvider: (provider, redirectUrl = '/') => {
    let email = `${provider}@example.com`;
    if (provider.toLowerCase() === 'google') {
      email = 'google.user@example.com';
    }
    const users = loadUsers();
    let user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: generateId('user'),
        email,
        password: '',
        full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: 'user',
      };
      saveUsers([...users, user]);
    }
    createSession(user.id);
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },

  register: async ({ email, password }) => {
    const users = loadUsers();
    const existingUser = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }
    const pending = loadPendingRegistrations();
    const otp = generateOtp();
    pending[email.toLowerCase()] = {
      email: email.toLowerCase(),
      password,
      otp,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
    savePendingRegistrations(pending);
    debugLog(`OTP para ${email}: ${otp}`);
    return { success: true };
  },

  verifyOtp: async ({ email, otpCode }) => {
    const pending = loadPendingRegistrations();
    const entry = pending[email.toLowerCase()];
    if (!entry || entry.otp !== otpCode || Date.now() > entry.expiresAt) {
      throw new Error('Código inválido ou expirado');
    }
    const users = loadUsers();
    const user = {
      id: generateId('user'),
      email: entry.email,
      password: entry.password,
      full_name: entry.email.split('@')[0],
      role: 'user',
    };
    saveUsers([...users, user]);
    delete pending[email.toLowerCase()];
    savePendingRegistrations(pending);
    const access_token = createSession(user.id);
    return { access_token };
  },

  resendOtp: async (email) => {
    const pending = loadPendingRegistrations();
    const entry = pending[email.toLowerCase()];
    if (!entry) {
      throw new Error('Registro não encontrado');
    }
    entry.otp = generateOtp();
    entry.expiresAt = Date.now() + 30 * 60 * 1000;
    savePendingRegistrations(pending);
    debugLog(`Novo OTP para ${email}: ${entry.otp}`);
    return { success: true };
  },

  resetPasswordRequest: async (email) => {
    const users = loadUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: true };
    }
    const resetTokens = loadResetTokens();
    const token = generateToken();
    resetTokens[token] = {
      email: user.email,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
    saveResetTokens(resetTokens);
    debugLog(`Reset token para ${email}: ${token}`);
    return { success: true };
  },

  resetPassword: async ({ resetToken, newPassword }) => {
    const resetTokens = loadResetTokens();
    const entry = resetTokens[resetToken];
    if (!entry || Date.now() > entry.expiresAt) {
      throw new Error('Token inválido ou expirado');
    }
    const users = loadUsers();
    const user = users.find((item) => item.email.toLowerCase() === entry.email.toLowerCase());
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    user.password = newPassword;
    saveUsers(users);
    delete resetTokens[resetToken];
    saveResetTokens(resetTokens);
    return { success: true };
  },

  setToken: async (token) => {
    setCurrentToken(token);
  },
};

const entities = {
  MenuItem: {
    filter: async (query = {}, sort = '', limit = 200) => {
      const items = loadMenuItems().filter((item) => matchesQuery(item, query));
      return sortItems(items, sort).slice(0, limit);
    },
    delete: async (id) => {
      const items = loadMenuItems();
      const updated = items.filter((item) => item.id !== id);
      saveMenuItems(updated);
      return true;
    },
    update: async (id, payload) => {
      const items = loadMenuItems();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error('Item não encontrado');
      }
      const updatedItem = {
        ...items[index],
        ...payload,
        updated_date: new Date().toISOString(),
      };
      items[index] = updatedItem;
      saveMenuItems(items);
      return updatedItem;
    },
    create: async (payload) => {
      const items = loadMenuItems();
      const newItem = {
        id: generateId('menu'),
        ...payload,
        created_date: new Date().toISOString(),
      };
      items.unshift(newItem);
      saveMenuItems(items);
      return newItem;
    },
  },
  Aviso: {
    filter: async (query = {}, sort = '', limit = 200) => {
      const items = loadAvisos().filter((item) => matchesQuery(item, query));
      return sortItems(items, sort).slice(0, limit);
    },
    delete: async (id) => {
      const items = loadAvisos();
      const updated = items.filter((item) => item.id !== id);
      saveAvisos(updated);
      return true;
    },
    update: async (id, payload) => {
      const items = loadAvisos();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error('Aviso não encontrado');
      }
      const updatedItem = {
        ...items[index],
        ...payload,
        updated_date: new Date().toISOString(),
      };
      items[index] = updatedItem;
      saveAvisos(items);
      return updatedItem;
    },
    create: async (payload) => {
      const items = loadAvisos();
      const newItem = {
        id: generateId('aviso'),
        ...payload,
        created_date: new Date().toISOString(),
      };
      items.unshift(newItem);
      saveAvisos(items);
      return newItem;
    },
  },
};

export const client = {
  auth,
  entities,
};
