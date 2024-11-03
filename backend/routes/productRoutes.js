const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Category = require('../models/Category'); // Category 모델 불러오기
const Product = require('../models/Product');   // Product 모델 불러오기

// Multer 설정: 파일을 서버의 `uploads` 폴더에 저장
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일명에 타임스탬프 추가
    }
});
const upload = multer({ storage: storage });

// 제품 추가
router.post('/register-product', upload.single('productImage'), async (req, res) => {
    try {
        console.log('POST /api/products/register-product request received');
        console.log('Request body:', req.body);

        const { alias, expiry_date, categoryId } = req.body;
        const productImage = req.file; // 업로드된 파일 정보
        const userId = req.user.userId; // 로그인된 사용자의 ID

        console.log('categoryId before parsing:', categoryId);

        // category_id를 숫자로 변환
        const parsedCategoryId = parseInt(categoryId, 10);
        console.log('Parsed categoryId:', parsedCategoryId);

        // 카테고리 ID가 유효한지 확인
        const category = await Category.findByPk(parsedCategoryId);
        console.log('Category found:', category);

        if (!category) {
            console.log('Invalid category ID:', parsedCategoryId);
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }
        // 파일 경로에서 백슬래시를 슬래시로 변환
        let imagePath = productImage ? productImage.path.replace(/\\/g, '/') : null;

        // Sequelize를 사용하여 새로운 제품을 데이터베이스에 추가
        const newProduct = await Product.create({
            alias: alias,
            expiry_date: expiry_date,
            categoryId: category.categoryId, // 외래 키로 categoryId 사용
            userId: userId, // 로그인된 사용자의 ID를 저장
            productImagePath: productImage ? productImage.path : null // 파일 경로를 저장
        });

        console.log('New product saved:', newProduct);
        console.log('Product information successfully saved.');

        res.status(200).json({ success: true, product: newProduct });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error', error: err });
    }
});

// 제품 삭제 API
router.delete('/delete-product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        // 제품 삭제
        const result = await Product.destroy({ where: { productId: productId } });

        if (result) {
            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error', error: err });
    }
});

module.exports = router;