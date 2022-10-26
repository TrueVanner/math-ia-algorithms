const fs = require("fs")

class Vertex {
	id //usually a natural number or a capital letter of the English alphabet, but anything is allowed
	coordinates

	constructor(id) {
		this.id = id
	}

	/**
	 * @param {Vertex} vertex to compare with
	 */
	equals(vertex) {
		return this.id == vertex.id
	}

	/**
	 * Analyzes all edges which contain this vertex
	 * @returns all the vertices connected with this vertex
	 */
	allNeighbors() {
		const neighbors = []
		Data.edges.forEach(edge => {
			if(edge.v1.equals(this)) neighbors.push(edge.v2)
			if(edge.v2.equals(this)) neighbors.push(edge.v1)
		})
		return neighbors
	}

	// Used for better formating of logs
	getID() {return `ID = ${this.id}`}
	toString() {
		let str = `Vertex: ${this.getID()}`
		if(this.coordinates.x) str += `, Coordinates: x=${this.coordinates.x}, y=${this.coordinates.y}`
		return str
	}
}

class Edge {
	v1
	v2
	weight

	/**
	 * @param {[]} arr - an array consisting of IDs of two vertices and the weight of an edge
	 */
	constructor(arr) {
		this.v1 = Data.find(Data.Type.VERTEX, arr[0])
		this.v2 = Data.find(Data.Type.VERTEX, arr[1])
		this.weight = parseInt(arr[2])
	}

	/**
	 * Checks both vertices
	 * @param {Edge} edge 
	 */
	equals(edge) {
		return (this.v1 == edge.v1 && this.v2 == edge.v2) || (this.v1 == edge.v2 && this.v2 == edge.v1)
	}

	// Used for better formating of logs
	toString() {return `Edge: Vertices [${this.v1.getID()} ${this.v2.getID()}], W = ${this.weight}`}
}

class Data {
	// used to form a log
	static iterations = []
	static shortestPathEdges = []
	static analyzedEdges = []

	/** @type {Vertex[]} */
	static vertices = []

	/** @type {Edge[]} */
	static edges = []

	static Type = Object.freeze({VERTEX: 0, EDGE: 1, ITERATION: 2}) // "enum"

	/**
	 * Adds the value into the corresponding array, avoids repetition
	 * @param {*} value 
	 * @param {Data.Type} dataType 
	 */
	static checkAndAdd(value, dataType) {
		switch (dataType) {
			case 0:
				if(!this.vertices.find(vertex => vertex.equals(value)))
					this.vertices.push(value)
				break
			case 1:
				if(!this.edges.find(edge => edge.equals(value)))
					this.edges.push(value)
				break	
		}
	}

	/**
	 * Used to objects in Data by their properties (vertex, edge or iteration)
	 * @param {Data.Type} type 
	 * @param {*} params (ID if searching for the vertex, array of Vertex[] if looking for the edge)
	 * @returns the object of the specified type with specified params
	 */
	static find(type, params) {
		switch(type) {
			case 0:
				const vertex = Data.vertices.find(vertex => vertex.id == params)
				if(vertex) return vertex
				throw new Error("A vertex with such ID isn't present in the graph.")
			case 1:
				const edge = Data.edges.find(edge => (edge.v1.equals(params[0]) && edge.v2.equals(params[1])) ||
													 (edge.v1.equals(params[1]) && edge.v2.equals(params[0])))
				if(edge) return edge
				throw new Error("Such an edge isn't present in the graph.")
		}
	}
}

/**
 * Loads graph data from a file and fills up the vertex and edge arrays
 * @param {String} filename 
 */
function loadData(filename) {
	const graph = fs.readFileSync(filename, "utf-8").split("\n")

	graph.forEach(edge => {
		const data = edge.split(" ")
		if(data.length != 3) throw new Error("Graph format error! Please check if each line of the provided file has the format of [vertex ID] [vertex ID] [weight]!");

		Data.checkAndAdd(new Vertex(data[0]), Data.Type.VERTEX)
		Data.checkAndAdd(new Vertex(data[1]), Data.Type.VERTEX)

		Data.checkAndAdd(new Edge(data), Data.Type.EDGE)
	})
}

/**
 * Loads the coordinates of each vertex from another file. Only used for A* algorithm
 * @param {String} filename
 */
function loadCoords(filename) {
	const coords = fs.readFileSync(filename, "utf-8").split("\n")

	coords.forEach(line => {
		const data = line.split(" ");
		if(data.length != 3) throw new Error("Graph format error! Please check if each line of the provided file has the format of [vertex ID] [X coordinate] [Y coordinate]!");
		Data.find(Data.Type.VERTEX, parseInt(data[0])).coordinates = {x: parseInt(data[1]), y: parseInt(data[2])}
	})
}

/**
 * The algorithm, written according to the algorithm description from my IA
 * @returns {{endVertex: Vertex, parent: Map<Vertex, Vertex>, finalDist: Number}} - the ending vertex, the parent data and the shortest distance from starting to ending vertex
 */
function dijkstra(startVertexID, endVertexID) {
	const startVertex = Data.find(Data.Type.VERTEX, startVertexID)
	const endVertex = Data.find(Data.Type.VERTEX, endVertexID)

	const P = new Map()
	Data.vertices.forEach(x => {
		P.set(x, Infinity)
	})
	P.set(startVertex, 0)
	const F = []
	const parent = new Map()

	let i = 1 // to count iterations and prevent infinite loops
	
	while (!F.includes(endVertex)) {
		
		if (i > Data.vertices.length) throw new Error("The algorithm entered an infinite loop!") // prevent infinite loop
		const iteration = [] // to log iterations
		iteration.push(`\nIteration: ${i}`)

		let y
		Data.vertices.forEach(vertex => {
			if(!F.includes(vertex)) {
				if(!Data.vertices.find(x => !x.equals(vertex) && !F.includes(x) && P.get(x) < P.get(vertex))) y = vertex
			}
		})
		F.push(y)

		iteration.push(`To be analyzed: ${y.getID()} (value in P: ${P.get(y)})`)
		iteration.push("Changed vertices:")

		y.allNeighbors().forEach(x => {

			if(!F.includes(x)) {
				parent.set(x, y)
				const edge = Data.find(Data.Type.EDGE, [x, y])
				Data.analyzedEdges.push(edge)
				if(P.get(x) > P.get(y) + edge.weight) {
					// generating the log
					iteration.push(` - ${x} changed value from ${P.get(x)} to ${P.get(y) + edge.weight}`)		

					P.set(x, P.get(y) + edge.weight)
				}
			}
		})

		Data.iterations.push(iteration)
		i++
	}

	return {endVertex: endVertex, parent: parent, finalDist: P.get(endVertex)}
}


/**
 * The heuristic function for A* algorithm. Returns the absolute distance between the vertex specified and the end vertex.
 * @param {Vertex} vertex 
 * @param {Vertex} endVertex 
 * @returns 
 */
function h(vertex, endVertex) {
	return Math.round(Math.sqrt(Math.pow(endVertex.coordinates.x - vertex.coordinates.x, 2) + Math.pow(endVertex.coordinates.y - vertex.coordinates.y, 2)))
}

/**
 * The algorithm, written according to the algorithm description from my IA
 * @returns {{endVertex: Vertex, parent: Map<Vertex, Vertex>, finalDist: Number}} - the ending vertex, the parent data and the shortest distance from starting to ending vertex
 */
function a_star(startVertexID, endVertexID) {
	const startVertex = Data.find(Data.Type.VERTEX, startVertexID)
	const endVertex = Data.find(Data.Type.VERTEX, endVertexID)

	const P = new Map()
	Data.vertices.forEach(x => {
		P.set(x, Infinity)
	})
	P.set(startVertex, 0)
	const G = new Map();
	Data.vertices.forEach(x => {
		G.set(x, Infinity)
	})
	G.set(startVertex, h(startVertex, endVertex))
	const F = []
	const parent = new Map()

	let i = 1 // to count iterations and prevent infinite loops
	
	while (!F.includes(endVertex)) {
		
		if (i > Data.vertices.length) throw new Error("The algorithm entered an infinite loop!") // prevent infinite loop
		const iteration = [] // to log iterations
		iteration.push(`\nIteration: ${i}`)

		let y
		Data.vertices.forEach(vertex => {
			if(!F.includes(vertex)) {
				if(!Data.vertices.find(x => !x.equals(vertex) && !F.includes(x) && G.get(x) < G.get(vertex))) y = vertex
			}
		})
		F.push(y)

		iteration.push(`To be analyzed: ${y.getID()} (value in G: ${G.get(y)})`)
		iteration.push("Changed vertices:")

		y.allNeighbors().forEach(x => {
			const edge = Data.find(Data.Type.EDGE, [x, y])
			Data.analyzedEdges.push(edge)

			if(P.get(x) > P.get(y) + edge.weight) {
				iteration.push(` - ${x} changed value in P from ${P.get(x)} to ${P.get(y) + edge.weight} and the value in G from ${G.get(x)} to ${P.get(y) + edge.weight + h(x, endVertex)}`)
				P.set(x, P.get(y) + edge.weight)
				G.set(x, P.get(x) + h(x, endVertex))
				parent.set(x, y)
				if(F.includes(x)) F.splice(F.indexOf(x), 1)
			}
		})
		Data.iterations.push(iteration)
		i++
	}

	return {endVertex: endVertex, parent: parent, finalDist: P.get(endVertex)}
}

/**
 * Creates a text message based on the reconstruction data
 * @param {{endVertex: Vertex, parent: Map<Vertex, Vertex>, finalDist: Number}} data - the output of the algorithm
 */
function reconstructPath(data) {
	const path = []
	reconstruct(data.parent, data.endVertex, path)
	
	let finalPath = "Shortest path: 1 -> "
	path.forEach(vertex => {
		finalPath += `${vertex.id} -> `
	})

	console.log(`${finalPath.substring(0, finalPath.length - 4)} (${data.finalDist} m)`)
}

/**
 * Recursively reconstructs the path from starting to ending vertex and writes it in the array
 * 
 * @param {Map<Vertex, Vertex>} parent - the parent data
 * @param {*} vertex - the parent of this vertex must be found
 * @param {*} arr - the array to which the reconstructed path will be written
 */
function reconstruct(parent, vertex, arr) {
	if(parent.has(vertex)) {
		arr.unshift(vertex)

		// to form the log
		let edge = Data.find(Data.Type.EDGE, [vertex, parent.get(vertex)])
		Data.shortestPathEdges.unshift(edge)
		Data.analyzedEdges.splice(Data.analyzedEdges.indexOf(edge), 1)

		return reconstruct(parent, parent.get(vertex), arr)
	}
}

/**
 * Saves all the actions performed by the algorithm (the log) into a text file
 * @param {String} filename where the log will be saved to
 */
function saveData(filename) {
	const final = []

	final.push("All elements of the graph:\n")
	Data.vertices.forEach(vertex => final.push(vertex + ""))
	Data.edges.forEach(edge => final.push(edge + ""))

	final.push("\n\nAll iterations:")
		Data.iterations.forEach(iteration => {
		iteration.forEach(line => {
			final.push(line)
		})
	})

	final.push(`\nTotal iterations: ${Data.iterations.length}`)

	final.push("\nEdges making up the shortest path:\n")
	Data.shortestPathEdges.forEach(edge => final.push(edge + ""))

	final.push("\nAnalyzed edges (doesn't include the shortest edges making up the shortest path):\n")
	Data.analyzedEdges.forEach(edge => final.push(edge + ""))
	
	fs.writeFileSync(filename, final.join("\n"))
	console.log(`Log saved to ${filename}`)
}

// To apply the algorithms through the .bat file
function run() {
	const args = process.argv.slice(2)

	console.log(args)

	try {
		loadData(args[0])
		if(args[1] == "1") loadCoords(args[2])
	} catch(e) {
		console.log(`\nAn error occured while loading the graph:\n\n${e.message}\n\nCheck if:\n`,
		"- The graph file's name wasn't misspelled and the file is located in the same folder as the launch file;\n",
		"- The graph file is formatted correctly and the weight of each edge is a number")
		return
	}

	try {
		if(args[1] == "0") {
			reconstructPath(dijkstra(args[3], args[4]))
		} else {
			reconstructPath(a_star(args[3], args[4]))
		}
	} catch(e) {
		console.log(`An error occured while calculating the shortest path:\n\n${e.message}\n\nCheck if:\n`,
		"- The graph file is formatted correctly;\n",
		"- Each edge has been described correctly")
		return
	}
	
	saveData(args[5])
}

run()