const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');

const app = express();
const SECRET_KEY = 'mi-clave-secreta-123';

// Middlewares
app.use(cors());
app.use(express.json());

// Leer DB
const getDB = () => JSON.parse(fs.readFileSync('db.json', 'utf8'));
const saveDB = (data) => fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

// LOGIN
app.post('/auth/login', (req, res) => {
  const { user_ultimatix, user_password } = req.body;
  const db = getDB();
  
  console.log('🔍 Intento de login:');
  console.log('Ultimatix recibido:', user_ultimatix);
  console.log('Password recibido:', user_password);
  
  // Buscar usuario por ultimatix
  const user = db.users.find(u => u.user_ultimatix === user_ultimatix);
  console.log('Usuario encontrado:', user ? `${user.user_name.first_name} ${user.user_name.last_name}` : 'NO ENCONTRADO');
  
  if (user) {
    console.log('Password en BD:', user.user_password);
    console.log('Passwords coinciden:', user.user_password === user_password);
  }

  if (!user || user.user_password !== user_password) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ 
    id: user.id, 
    email: user.user_email, 
    ultimatix: user.user_ultimatix,
    role: user.role 
  }, SECRET_KEY, { expiresIn: '24h' });

  res.json({
    message: 'Login exitoso',
    token,
    user: {
      id: user.id,
      name: `${user.user_name.first_name} ${user.user_name.last_name}`,
      email: user.user_email,
      ultimatix: user.user_ultimatix,
      role: user.role
    }
  });
});

// REGISTRO
app.post('/auth/register', (req, res) => {
  const { user_name, user_email, user_password, role } = req.body;
  const db = getDB();

  // Verificar si ya existe
  if (db.users.find(u => u.user_email === user_email)) {
    return res.status(400).json({ message: 'El email ya existe' });
  }

  // Crear usuario
  const newUser = {
    id: Math.random().toString(36).substr(2, 4),
    user_id: db.users.length + 1,
    user_gender: 'not_specified',
    role: role || 'analyst',
    user_name: {
      first_name: user_name.first_name,
      last_name: user_name.last_name
    },
    user_location: { country: 'Unknown', city: 'Unknown' },
    user_email,
    user_ultimatix: `298${Math.floor(Math.random() * 10000)}`,
    user_password,
    user_phone: '',
    user_picture: { url: 'https://randomuser.me/api/portraits/men/1.jpg' }
  };

  db.users.push(newUser);
  saveDB(db);

  const token = jwt.sign({ 
    id: newUser.id, 
    email: newUser.user_email, 
    role: newUser.role 
  }, SECRET_KEY, { expiresIn: '24h' });

  res.json({
    message: 'Usuario creado',
    token,
    user: {
      id: newUser.id,
      name: `${newUser.user_name.first_name} ${newUser.user_name.last_name}`,
      email: newUser.user_email,
      role: newUser.role
    }
  });
});

// Middleware para verificar token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// PERFIL (protegido)
app.get('/auth/me', auth, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  res.json({
    id: user.id,
    name: `${user.user_name.first_name} ${user.user_name.last_name}`,
    email: user.user_email,
    role: user.role
  });
});

// CREAR PRODUCTO (protegido con token)
app.post('/products', auth, (req, res) => {
  const { product_name, product_list_price, product_min_promo_quantity, product_max_promo_quantity, product_min_promo_price } = req.body;
  const db = getDB();

  if (!product_name || !product_list_price) {
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  }

  // Crear nuevo producto
  const newProduct = {
    id: Math.random().toString(36).substr(2, 4),
    product_id: db.products.length ? Math.max(...db.products.map(p => p.product_id)) + 1 : 1,
    product_name,
    product_list_price: parseFloat(product_list_price),
    product_min_promo_quantity: product_min_promo_quantity || 1,
    product_max_promo_quantity: product_max_promo_quantity || 5,
    product_min_promo_price: product_min_promo_price || parseFloat(product_list_price) * 0.8,
    created_by: req.user.id,
    created_by_email: req.user.email,
    created_at: new Date().toISOString()
  };

  db.products.push(newProduct);
  saveDB(db);

  res.status(201).json({
    message: 'Producto creado exitosamente',
    product: newProduct
  });
});

// OBTENER PRODUCTOS DEL USUARIO (protegido)
app.get('/my-products', auth, (req, res) => {
  const db = getDB();
  const userProducts = db.products.filter(p => p.created_by === req.user.id);
  
  res.json({
    message: 'Productos del usuario',
    products: userProducts,
    total: userProducts.length
  });
});

// Rutas básicas de la API (simular json-server)
app.get('/users', (req, res) => {
  const db = getDB();
  res.json(db.users);
});

app.get('/users/:id', (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

app.get('/products', (req, res) => {
  const db = getDB();
  res.json(db.products);
});

app.get('/products/:id', (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

app.get('/roles', (req, res) => {
  const db = getDB();
  res.json(db.roles);
});

app.listen(3001, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3001');
  console.log('📝 Rutas AUTH:');
  console.log('   POST /auth/login');
  console.log('   POST /auth/register');  
  console.log('   GET /auth/me');
  console.log('📝 Rutas API:');
  console.log('   GET /users');
  console.log('   GET /products');
  console.log('   POST /products (requiere token)');
  console.log('   GET /my-products (requiere token)');
  console.log('   GET /roles');
});