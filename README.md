# math-ia-algorithms
A program that runs one of the shortest path algorithms on any graph and logs the entire process.

How to use:
(Currently, Node.js needs to be installed on your machine to run the algorithm. It is installed by default on most computers using Windows, but if the program throws an unexpected error, the lack of Node.js might be the case.)
1. Create a graph file:
 - In a .txt file, write down every edge of the graph which needs to be analyzed in a specific format: *[vertex 1 ID]* *[vertex 2 ID]* *[weight of the edge]*, where the vertex IDs are the values representing the vertices on the graph. The program can work with the ID of any type, but it's reccomended to use natural numbers or letter of the English alphabet for your convenience.
 - The graph representation of the map segment from *Figure 2* in my Math IA is located in **graph.txt** file. It can also be used as an example.
1.1. Create a file with the coordinates:
 - If you're planning to only use the Dijkstra's algorithm, skip this part.
 - The version of the A* algorithm used in my work uses the absolute distance between the points as its heuristic function. Therefore, the relative coordinates of each vertex on the graph need to be included in order to run the A* algorithm on the graph.
- The relative coordinates of each vertex from the map segment from *Figure 4* in my Math IA are located in **coords.txt** file. It can also be used as an example.
2. Activate launch.bat and enter all of the required values.
 - If any errors occur, follow the error guide which will be displayed in the launcher.
3. Obtain the shortest path data!
 - The shortest path will be displayed in the launcher, with each value near the arrow representing the ID of the vertex that belongs to the path.
 - All the calculation process will be stored in the log file, which includes:
   - information about every iteration of the algorithm
   - the list of edges which were ananyzed
   - the list of edges making up the shortest path
   - and more!

The other files related to my Math IA are:
 - **log for graph 2.1 (Dijkstra).txt** - the log created when finding the shortest path in *graph.txt* using the Dijkstra's algorithm from vertices 1 to 27
 - **log for graph 2.2 (Dijkstra).txt** - the log created when finding the shortest path in *graph.txt* using the Dijkstra's algorithm from vertices 1 to 28
 - **log for graph 5.1 (A star).txt** - the log created when finding the shortest path in *graph.txt* using the A* algorithm from vertices 1 to 27
 - **log for graph 5.2 (A star).txt** - the log created when finding the shortest path in *graph.txt* using the A* algorithm from vertices 1 to 28
