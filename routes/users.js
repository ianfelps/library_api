const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../database/pool');
const authMiddleware = require('./middleware/auth');

