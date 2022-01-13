const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const finalPrice = (price, discount) => Math.round(price - (price * (discount/100)));

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products: products, toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const {id} = req.params
		const productDetail = products.find(element => element.id === +id)
		
		res.render('detail', {productDetail, toThousand, finalPrice})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const product = req.body
		product.id = products.length + 1

		products.push(product)
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(element => element.id === +req.params.id)
		res.render('product-edit-form', {product})
	},
	// Update - Method to update
	update: (req, res) => {
		const product = products.find(product => product.id === +req.params.id)
		const {name, price, discount, category, description} = req.body

		if (product) {
			product.name = name
			product.price = price
			product.discount = discount
			product.category = category
			product.description = description

			fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))

			res.redirect(`/products/detail/${req.params.id}`)
		} else {
			res.redirect('/')
		}
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter(product => product.id !== +req.params.id)

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))

		res.redirect('/')
	}
};

module.exports = controller;