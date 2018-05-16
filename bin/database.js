const firebase = require("firebase");
const config = require("../configs/tokens.json");

class Database {

	constructor () {
		if (!Database._instance) {
			this.app = firebase.initializeApp(config.firebase);
			this.firestore = this.app.firestore();
			this.firestore.settings({timestampsInSnapshots: true});

			Database._instance = this;
		}

		return Database._instance;
	}

	async GetDocument(str_query/** example: customers/{"username": "User1"}/sub-collection/{"some": "filter"} */) {

		// make sure query is string
		if (typeof str_query !== 'string') 
			throw 'Database::GetDocument() --- Parameter type missmatch.';

		// Split path into its components
		let path = str_query.split('/');

		// Any path to a document has to have a multiple of two componets
		if (path.length % 2 != 0)
			throw 'Database::GetDocument() --- Parameter format invalid.';

		// temporary store for the document to be returned
		let doc;

		// As long as there is more of the path to traverse
		while (path.length > 0) {
			// isolate and remove the (sub-)collection and document filter form the path componets
			let collection_name = path.shift();
			let filter = JSON.parse(path.shift());

			// if no document was previously found get the collection from firebase
			// if a document is pressent get the sub-collection
			let collection_query = doc ? doc.ref.collection(collection_name) : this.firestore.collection(collection_name);

			// filter the out documents in the collection that does not have the key-value pair of the porvided filter
			for (var key in filter) {
				if (filter.hasOwnProperty(key)) {
					collection_query = collection_query.where(key, '==', filter[key]);
				}
			}

			// get the snappshot and make sure it contains exactlu one item
			let query_snappshot = await collection_query.get();
			if (query_snappshot.empty)
				throw `Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`;
			if (query_snappshot.size > 1)
				throw 'Database::GetDocument() --- Multiple matches found.';
			
			// get the single item
			doc = query_snappshot.docs[0];

			// repeat til path is traversed
		}

		// Return the document
		return doc;

	}

	async CreateDocument(str_collection_path/** example: customers/{"username": "User1"}/sub-collection/ */,
											 data/** Any object */)
	{
		
		// make sure query is string
		if (typeof str_collection_path !== 'string')
			throw 'Database::GetDocument() --- Parameter type missmatch.';

		// Split path into its components
		let path = str_collection_path.split('/');

		// Any path to a collection must have a odd number of components
		if (path.length % 2 == 0)
			throw 'Database::GetDocument() --- Parameter format invalid.';

		// temporary store for the collection to be returned
		let collection = this.firestore.collection(path.shift());

		// As long as there is more of the path to traverse
		while (path.length > 0) {
			// isolate and remove the (sub-)collection and document filter form the path componets
			let filter = JSON.parse(path.shift());
			let collection_name = path.shift();

			// filter the out documents in the collection that does not have the key-value pair of the porvided filter
			let collection_query = collection;
			for (var key in filter) {
				if (filter.hasOwnProperty(key)) {
					collection_query = collection_query.where(key, '==', filter[key]);
				}
			}
			
			// get the snappshot and make sure it contains exactly one item
			let query_snappshot = await collection_query.get();
			if (query_snappshot.empty)
				throw `Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`;
			if (query_snappshot.size > 1)
				throw 'Database::GetDocument() --- Multiple matches found.';

			// get the sub collection from the single document
			collection = query_snappshot.docs[0].ref.collection(collection_name);

			// repeat til path is traversed
		}

		// Return the document
		return await collection.add(data);

	}

}

const inst = new Database();

module.exports = inst;
