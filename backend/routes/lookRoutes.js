const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    if (!req.user) {
        // 로그인이 안 된 경우 경고 메시지를 보여줍니다.
        return res.render('look', { user: null, products: [], warning: '로그인 후 이용해주세요.' });
    }

    try {
        const userId = req.user.userId; // 현재 로그인된 사용자의 userId 가져오기
        console.log(`Logged in userId: ${userId}`);

        // 로그인된 사용자가 저장한 제품만 가져오기
        const products = await Product.findAll({
            where: { userId: userId } // userId로 필터링
        });

        console.log('Products retrieved:', products); // 로그를 추가하여 데이터 확인

        res.render('look', { user: req.user, products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('look', { user: req.user, products: [] });
    }
});

module.exports = router;
