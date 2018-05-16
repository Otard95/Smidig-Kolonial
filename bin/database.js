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

		let path = str_query.split('/');

		if (path.length % 2 != 0)
			throw 'Database::GetDocument() --- Parameter format invalid.';

		let doc;

		while (path.length != 0) {
			let collection_name = path.shift();
			let filter = JSON.parse(path.shift());

			let collection_query = doc ? doc.ref.collection(collection_name) : this.firestore.collection(collection_name);

			for (var key in filter) {
				if (filter.hasOwnProperty(key)) {
					collection_query = collection_query.where(key, '==', filter[key]);
				}
			}

			let query_snappshot = await collection_query.get();
			if (query_snappshot.empty)
				throw `Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`;
			if (query_snappshot.size > 1)
				throw 'Database::GetDocument() --- Multiple matches found.';
			
			doc = query_snappshot.docs[0];

		}

		return doc;

	}

	async CreateDocument(str_collection_path/** example: customers/{"username": "User1"}/sub-collection/ */,
											 data/** Any object */)
	{
		


	}

}

const inst = new Database();

module.exports = inst;
