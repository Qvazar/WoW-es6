function parseMap(mapXml) {

}

class TiledMapLoader {
	constructor() {

	}

	load(url) {
		return new Promise((resolve, reject) => {
			System.import(url)
				.then((mapData) => {
					var map = parseMap(mapData);
					resolve(map);
				})
				.catch((err) => {
					reject(err);
				})
		});
	}
}

TiledMapLoader.create = () => new TiledMapLoader();

export default TiledMapLoader;