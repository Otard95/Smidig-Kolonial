'use strict';

function ShoppingListModule () {
	return ShoppingListModule._instance;
}
ShoppingListModule._instance = (() => {

	/**
	 * ### Globals
	*/

	const module = {};

	/**
	 * ### Classes
	*/

	class ProductSelectionManager {

		constructor() {

			this.renderable = {
				render () {
					let el = module.ProductSelectionManager
					return () => {
						el.updateView(el.categories.map(c => c.DOM), 'Varer');
					}
				}
			}

			this.open = false;
			this.items_to_add_count = 0;

			this.categories = [
				new Category('Inspirasjon', 'lol', this.renderable),
				new Category('Dine Varer', 'lmao', this.renderable)
			];
			this.category_container = document.querySelector(".category-list");
			this.backArrow = document.querySelector(".back-arrow");
			this.btn = document.querySelector(".icon-button");
			this.categoryBox = document.querySelector(".category-container");
			this.whiteIconGone = document.querySelector(".add-product-button");
			this.blackIconShow = document.querySelector(".button-white");
			this.headerName = document.querySelector(".search-title");
			this.headerContainer = document.querySelector(".information-header");
			this.input = document.getElementById("search-t");

			this.path = [];

			this.initEvents();
			this.initCategories();

		}

		/**
		 * ### Init
		*/

		initEvents () {

			this.btn.addEventListener("click", this.showEvent.bind(this));
			
			this.backArrow.addEventListener("click", this.goBackEvent);

			this.input.addEventListener("change", this.searchEvent);

		}

		async initCategories () {

			let result = await fetch('/api/categories');
			let json = await result.json();

			json.forEach(item => {
				this.categories.push(new Category(item.name, item.id, this.renderable));
			})

			this.updateView(this.categories.map(c => c.DOM), 'Varer');

		}

		/**
		 * ### Events
		*/
		
		async showEvent (e) {
			
			this.btn.classList.toggle("change-button");
			this.categoryBox.classList.toggle("show");
			this.whiteIconGone.classList.toggle("hide-button");
			this.blackIconShow.classList.toggle("show-button");

			if (this.open && this.items_to_add_count > 0) {
				this.addToList();
			}

			this.open = !this.open;

		}

		goBackEvent () {

			let toRender = module.ProductSelectionManager.path.pop();

			if (toRender) toRender.render()();

		}

		async searchEvent () {

			let i = this.input.value;
			let data = await fetch(`/API/item/search?name=${i}`);
			let json = await data.json();

			this.catlist.innerHTML = ""

			json.forEach(async (json) => {
				this.catlist.innerHTML += `<div class="product-container">
											<img id="product-image" src=${json.images.thumbnail} alt="">
											<h1 id="product-name">${json.name}</h1>
											<h1 id="price-per-unit">kr ${json.price.gross}</h1>
											<img id="add-button" src="/imgs/icon/Velg vare.png" alt="">
											<h2 id="price-som">stykk</h2>
											<h2 id="price-quantity">kr ${json.price.gross_unit}</h2>
											</div>`
				this.setEventListener()
			});

		}

		updateView (arr_dom, name, parent) {

			while (this.category_container.firstChild) {
				this.category_container.removeChild(this.category_container.firstChild);
			}

			arr_dom.forEach(e => {
				this.category_container.appendChild(e);
			});

			if (parent) this.path.push(parent);
			this.headerName.innerText = name;

		}

		collect() {

			let items = [];

			for (let child of this.categories) {
				let dat = child.collect();
				if (dat && Array.isArray(dat)) items.push.apply(items, dat);
				else if (dat) items.push(dat);
			}

			return items;

		}

		async addToList () {

			let to_add = this.collect();

			module.ShoppingList.AddToList(to_add, this.addFinished.bind(this));

		}

		addFinished (err, data) {
			console.log(err || data);
		}

	}

	class Category {

		constructor (name, id, parent) {
			this.name = name;
			this.id = id;
			this.parent = parent;

			this.DOM = createDOM(
				`<li class="list-item" data-categoryid="${this.id}">Laster...</li>`
			);

			if (!this.name) 
				this.getData();
			else
				this.init();

			this.children = [];
		}

		init () {
			this.DOM.innerText = this.name;
			this.DOM.addEventListener('click', this.render());
		}

		getData () {

			fetch(`/API/category/${this.id}`)
			.then(data => data.json())
			.then(json => new Promise((resolve, rejects) => {

				if (!json.name) {
					let i = this.parent.children.indexOf(this);
					if (i > -1) {
						this.parent.children.splice(i, 1);
						module.ProductSelectionManager.category_container.removeChild(this.DOM);
					}
				}

				this.name = json.name;
	
				this.init();
				resolve();
			}));

		}

		getChildren () {

			if (this.children.length > 0)
				return new Promise((resolve, reject) => { resolve(); });
			else
				return fetch(`/API/category/${this.id}`)
				.then(data => data.json())
				.then(json => new Promise((resolve, rejects) => {
						if (json.children_id) {
							json.children_id.forEach(id => this.children.push(new Category(undefined, id, this)));
						} else {
							json.products.forEach(id => this.children.push(new ProductItem(id)));
						}
						resolve();
					})
				);
			
		}

		render () {
			let el = this;
			return () => {
				el.getChildren()
				.then(() => {
					module.ProductSelectionManager.updateView(
						el.children.map(c => c.DOM),
						el.name,
						el.parent
					);
				});
			}
			
		}

		collect () {

			let items = [];

			for (let child of this.children) {
				let dat = child.collect();
				if      (dat && Array.isArray(dat)) items.push.apply(items, dat);
				else if (dat)                       items.push(dat);
			}

			return items;

		}

	}

	class ProductItem {
		
		constructor (id) {
			this.id = id;

			this.DOM = createDOM(
				`<div class="product-container">
					<img id="product-image" src="/imgs/loading.gif" alt="">
					<h1 id="product-name">Laster...</h1>
					<h1 id="price-per-unit"></h1>
					<img id="include-button" src="/imgs/icon/Velg vare.png" alt="">
					<div id="quantity-block">
						<img id="add-button" src="/imgs/icon/pluss-large.png" />
						<input id="amount" type="number" value="1" min="0"></input>
						<img id="sub-button" src="/imgs/icon/minus-large.png" />
					</div>
					<h2 id="price-quantity"></h2>
				</div>
				`
			);

			this.selected = false;
			this.amount_dom = this.DOM.querySelector('#amount');

			this.getData();

		}

		init() {
			this.DOM.querySelector('#product-name').innerText = this.name;
			this.DOM.querySelector('#price-per-unit').innerText = this.price;
			this.DOM.querySelector('#price-quantity').innerText = this.unit_price;
			this.DOM.querySelector('#product-image').setAttribute('src', this.thumbnail);

			this.DOM.querySelector('#add-button').addEventListener('click', () => {
				this.amount_dom.stepUp();
			});
			this.DOM.querySelector('#sub-button').addEventListener('click', () => {
				this.amount_dom.stepDown();
				if (parseInt(this.amount_dom.value) === 0) {
					this.amount_dom.value = 1;
					this.unsetSelected();
				}
			});

			this.DOM.querySelector('#include-button')
				.addEventListener('click', this.setSelected.bind(this));
		}

		getData() {

			fetch(`/API/item/${this.id}`)
				.then(data => data.json())
				.then(json => new Promise((resolve, rejects) => {

					this.name = json.name;
					this.thumbnail = json.images.thumbnail;
					this.price = json.price.gross;
					this.unit_price = json.price.gross_unit;

					this.init();

					resolve();

				}));

		}

		setSelected () {
			module.ProductSelectionManager.items_to_add_count++;
			this.selected = true;
			this.DOM.classList.add('selected');
		}
		unsetSelected() {
			module.ProductSelectionManager.items_to_add_count--;
			this.selected = false;
			this.DOM.classList.remove('selected');
		}

		collect () {
			if (this.selected) {
				return { kolonialId: this.id, amount: parseInt(this.amount_dom.value) };
			}
		}

	}

	class ShoppingList {

		constructor() {
			this.root = document.querySelector('.week-list');

			this.items = [];
			for (let item of this.root.children) {
				this.items.push(new ListProductItem(item));
			}

			this._saved = true;
		}

		set Saved(value) {
			if (value) return;
			this.ScheduleSave();
			this._saved = value;
		}

		get Saved() { return this._saved; }

		update() {
			for (let item of this.items) {
				item.update();
			}
		}

		ScheduleSave() {

			if (this.saveTimeout) {
				clearTimeout(this.saveTimeout);
				this.saveTimeout = undefined;
			}

			this.saveTimeout = setTimeout(this.Save, 5000);
			setLeave(
				'Vi har ikke rukket å lagre endringene dine. Er du sikker på at du vil forlate siden.',
				this.Save
			);

		}

		async Save() {
			module.ShoppingList.update();

			clearTimeout(module.ShoppingList.saveTimeout);
			module.ShoppingList.saveTimeout = undefined;

			let items_to_save = module.ShoppingList.items.filter(i => !i._saved);

			try {
				let http_response = await module.ShoppingList.pushUpdate({
						product_update: items_to_save.map(i => {
							return {
								amount: i.amount,
								pid: i.pid,
								groupId: i.groupId
							};
						})
					});

				let response = await http_response.json();

			} catch (e) {
				console.log(e);
			}

			items_to_save.forEach(i => i._saved = true);

			unsetLeave();
		}

		async AddToList(arr_products, callback /* (err, res) */) {

			let res;

			try {
				let http_response = await this.pushUpdate({ product_add: arr_products });
				res = await http_response.json();
			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.created)

		}

		async updateGroup (group, callback) {
			
			let res;

			try {
				let http_response = await this.pushUpdate({
					group_update: {
						color: group.color,
						name: group.name,
						id: group.id
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.updated);

		}

		async createGroup(group, callback) {

			let res;

			try {
				let http_response = await this.pushUpdate({
					group_create: {
						color: group.color,
						name: group.name,
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.created)
		}

		async deleteGroup(groupId, callback){
			
			let res;

			try {
				let http_response = await this.pushUpdate({
					group_delete: {
						groupId : groupId
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.deleted);
		}

		async addGroupToProduct(productId, groupId, callback) {

			let res;

			try {
				let http_response = await this.pushUpdate({
					group_add: {
						productId: productId,
						groupId: groupId
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.updated);
		}

		async removeGroupFromProduct(productId, callback) {
			let res;

			try {
				let http_response = await this.pushUpdate({
					group_remove: {
						productId: productId					
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.deleted);
		}

		async updateMeta (name, sharedWith, callback) {
			
			let res;

			try {
				let http_response = await this.pushUpdate({
					meta_update: {
						name: name,
						sharedWith: sharedWith
					}
				});
				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.updated);
		}

		async pushUpdate (body) {
			return await fetch(window.location.pathname + '/update', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
		}

	}

	class ListProductItem {

		constructor(dom_element) {
			this.dom = {};
			this.dom.root = dom_element;
			this.dom.amount = dom_element.querySelector('#amount');
			this.dom.add_button = dom_element.querySelector('#add-button');
			this.dom.sub_button = dom_element.querySelector('#sub-button');

			this.pid = this.dom.root.dataset.pid;
			this.kolonialid = this.dom.root.dataset.kolonialid;
			this._saved = true;

			this.initEvents();
			this.update();
		}

		initEvents() {

			this.dom.add_button.addEventListener('click', e => {
				this.dom.amount.stepUp();
				this._saved = false;
				module.ShoppingList.Saved = false;
			});

			this.dom.sub_button.addEventListener('click', e => {
				this.dom.amount.stepDown();
				this._saved = false;
				module.ShoppingList.Saved = false;
			});

		}

		update() {

			this.amount = parseInt(this.dom.amount.value);

		}

	}

	/**
	 * ### Helper Functions
	*/

	function setLeave(msg, action) {
		window.onbeforeunload = e => {
			action();
			return msg || 'Are you sure you want to leave the page?';
		}
	}

	function unsetLeave() {
		window.onbeforeunload = undefined
	}

	function createDOM (str_html) {
		return createDOM._parser.parseFromString(str_html, 'text/html').body.firstChild;
	}
	createDOM._parser = new DOMParser();

	/**
	 * ### OnLoad Init
	*/

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	function init() {
		if (init._called) return;
		init._called = true;
		module.ShoppingList = new ShoppingList();
		module.ProductSelectionManager = new ProductSelectionManager();
	}
	init._called = false;

	/**
	 * ### Return module
	*/

	return module;

})();