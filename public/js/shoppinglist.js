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



		}

	}

	class ShoppingList {

		constructor() {
			this.root = document.querySelector('.week-list');

			this.items = [];
			for (let item of this.root.children) {
				this.items.push(new ListItem(item));
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
				let http_response = await fetch(window.location.pathname + '/update', {
					method: 'POST',
					body: JSON.stringify({
						product_update: items_to_save.map(i => { return { amount: i.amount, pid: i.pid }; })
					}),
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
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
				let http_response = await fetch(window.location.pathname + '/update', {
					method: 'POST',
					body: JSON.stringify({
						product_add: arr_products
					}),
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});

				res = await http_response.json();

			} catch (e) {
				console.log(e);
				callback(e);
				return;
			}

			callback(null, res.created)

		}

	}

	class ListItem {

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

	/**
	 * ### OnLoad Init
	*/

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	function init() {
		module.ShoppingList = new ShoppingList();
	}

	/**
	 * ### Return module
	*/

	return module;

})();