const firebase = require("firebase");
const config = require("../configs/tokens.json");
const DBResponse = require('../models/database-response');

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

	async Get(str_query/** example: customers/{"username": "User1"}/sub-collection/{"some": "filter"} */) {

		// make sure query is string
		if (typeof str_query !== 'string') 
			throw new DBResponse(
				DBResponse.status_codes.PARAMETER_ERROR,
				{ "input_param": str_query },
				'Database::Get() --- Parameter type missmatch.'
			);

		// Split path into its components
		let path = str_query.split('/');

		// Any path to a document has to have a multiple of two componets
		if (path.length % 2 != 0)
			throw new DBResponse(
				DBResponse.status_codes.PARAMETER_ERROR,
				{
					input_param: str_query,
					query_component_count: path.length
				},
				'Database::Get() --- Parameter format invalid.'
			);

		// temporary store for the document to be returned
		let docs;

		// As long as there is more of the path to traverse
		while (path.length > 0) {

			// isolate and remove the (sub-)collection and document filter form the path componets
			let collection_name = path.shift();
			let filter = path.shift();
			try {
				let temp = JSON.parse(filter);
				filter = temp;
			} catch (err) {

			}

			if (typeof filter == 'string') {

				docs = docs ? await docs.ref.collection(collection_name).doc(filter).get() : await this.firestore.collection(collection_name).doc(filter).get();

				if (!docs.exists) {
					return new DBResponse(
						DBResponse.status_codes.DOCUMENT_NOT_FOUND,
						{
							query: str_query,
							results: 0
						},
						`Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`
					);
				}

			} else {

				// if no document was previously found get the collection from firebase
				// if a document is pressent get the sub-collection
				let collection_query = docs ? docs.ref.collection(collection_name) : this.firestore.collection(collection_name);

				// filter the out documents in the collection that does not have the key-value pair of the porvided filter
				for (var key in filter) {
					if (filter.hasOwnProperty(key)) {
						collection_query = collection_query.where(key, '==', filter[key]);
					}
				}

				// get the snappshot and make sure it contains exactlu one item
				let query_snappshot = await collection_query.get();
				if (query_snappshot.empty)
					return new DBResponse(
						DBResponse.status_codes.DOCUMENT_NOT_FOUND,
						{
							query: str_query,
							results: 0
						},
						`Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`
					);

				// get the single item
				docs = query_snappshot.docs;

			}

			if (Array.isArray(docs) && path.length > 0) {
				if (docs.length > 1) {
					return new DBResponse(
						DBResponse.status_codes.MULTI_MATCH_ERROR,
						{
							query: str_query,
							in_collection: collection_name,
							doc_filter: filter,
							remaining_path: path
						},
						'The path to the document branches off.'
					)
				}
						
				docs = docs[0];
			}

			// repeat til path is traversed
		}

		

		if (!Array.isArray(docs)) {
			docs = [docs];
		}

		// Return the document
		return new DBResponse(
			DBResponse.status_codes.OK,
			docs,
			'Document found.'
		);

	}

	async Create(str_collection_path/** example: customers/{"username": "User1"}/sub-collection */,
											 data/** Any object */)
	{
		
		// make sure query is string
		if (typeof str_collection_path !== 'string')
			throw new DBResponse(
				DBResponse.status_codes.PARAMETER_ERROR,
				{ "input_param": str_collection_path },
				'Database::Get() --- Parameter type missmatch.'
			);

		// Split path into its components
		let path = str_collection_path.split('/');

		// Any path to a collection has to have a odd number of componets
		if (path.length % 2 == 0)
			throw new DBResponse(
				DBResponse.status_codes.PARAMETER_ERROR,
				{
					input_param: str_collection_path,
					query_component_count: path.length
				},
				'Database::Get() --- Parameter format invalid.'
			);

		// temporary store for the collection to be returned
		let collection = this.firestore.collection(path.shift());

		// As long as there is more of the path to traverse
		while (path.length > 0) {
			// isolate and remove the (sub-)collection and document filter form the path componets
			let filter = path.shift();
			try {
				let temp = JSON.parse(filter);
				filter = temp;
			} catch (err) {}
			
			let collection_name = path.shift();

			if (typeof filter == 'string') {
				
				collection = collection.doc(filter).collection(collection_name);
			
			} else {

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
					return new DBResponse(
						DBResponse.status_codes.DOCUMENT_NOT_FOUND,
						{
							query: str_query,
							results: 0
						},
						`Could not find a document matching '${JSON.stringify(filter)}' in '${collection_name}'`
					);

				if (query_snappshot.size > 1)
					return new DBResponse(
						DBResponse.status_codes.MULTI_MATCH_ERROR,
						{
							query: str_query,
							results: query_snappshot.size
						},
						'Database::Get() --- Multiple matches found.'
					);

				// get the sub collection from the single document
				collection = query_snappshot.docs[0].ref.collection(collection_name);

			}

			// repeat til path is traversed
		}

		// Return the document
		let new_doc = await collection.add(data);

		return new DBResponse (
			DBResponse.status_codes.OK,
			new_doc,
			'Document added.'
		);

	}

	//TODO metode for å oppdatere et eksisterende dokuemnt
	async Update (str_path /* path to document */, update_doc, merge = true) {

		let res = await this.Get(str_path);

		if (!DBResponse.OK(res)) {
			return res;
		}

		let prom = [];
		res.data.forEach( doc => {
			doc.ref.set(update_doc, { merge });
		});
		
		await Promise.all(prom);
		
		return new DBResponse(
			DBResponse.status_codes.OK,
			{},
			'Update done.'
		)

	}

	async Delete (str_path /* path to document */) {

		let res = await this.Get(str_path);

		if (!DBResponse.OK(res)) {
			return res;
		}

		try {

			await res.data[0].ref.delete();

		} catch (e) {
			throw new DBResponse (
				DBResponse.status_codes.DOCUMENT_DELETION_FAILED,
				{ firebase_error: e },
				'Failed to delete the document.'
			)
		}

		return new DBResponse (
			DBResponse.status_codes.OK,
			{ deleted_document: res.data.id },
			'Document was deleted.'
		);

	}

}

const inst = new Database();

module.exports = inst;
