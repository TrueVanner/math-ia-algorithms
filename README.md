# math-ia-dijkstra
An algorithm that finds the shortest path on any graph and logs the entire process.

How to use:
(Currently, Node.js needs to be installed on your machine to run the algorithm, but you probably already have it)
1. Create a graph file:
 - In a .txt file, write down every edge of the graph which needs to be analyzed in a specific format: *[vertex 1 ID] [vertex 2 ID] [weight of the edge]*, where the vertex IDs are the values representing the vertices on the graph; any value can be set as an ID, but I suggest using either integers starting from 1 or letters of the English aphabet.
 - The graph representation of the map segment from *Figure 2* in my Math IA is located in **graph.txt** file. It can also be used as an example.
2. Activate launch.bat and enter all of the required values.
 - If any errors occur, follow the error guide which will be displayed in the launcher.
3. Obtain the shortest path data!
 - The shortest path will be displayed in the launcher, with each value near the arrow representing the ID of the vertex that belongs to the path.
 - All the calculation process will be stored in the log file, which includes:
   - information about every iteration of the algorithm
   - the list of edges which were ananyzed
   - the list of edges making up the shortest path

The other files related to my Math IA are:
 - **log for graph 2.1.txt** - the log remaining searching the shortest path in *graph.txt* from vertex 1 to 27
 - **log for graph 2.2.txt** - the log remaining searching the shortest path in *graph.txt* from vertex 1 to 28
