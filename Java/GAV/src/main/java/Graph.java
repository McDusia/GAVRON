import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Madzia on 02.11.2017.
 */
public class Graph {
    private int edges;
    private int nodes;
    private List<Integer>[] adjacency;


    public Graph(int nodesQnt) {
        this.edges = 0;
        this.nodes = nodesQnt;
        this.adjacency = (List<Integer>[]) new List[this.nodes];
        for (int i = 0; i<nodes;i++)
            adjacency[i] = new ArrayList<>();

    }

    public void addEdge(int node1, int node2) {
        adjacency[node1].add(node2);
        adjacency[node2].add(node1);
        this.edges++;
    }

    public void deleteEdge(int node1, int node2) {
        adjacency[node1].remove(node2);
        adjacency[node2].remove(node1);
        this.edges--;
    }

    public int getNumberOfEdges() {
        return edges;
    }

    public int getNumberOfNodes() {
        return nodes;
    }

    public Iterable<Integer> getAdjacency(int node) {
        return adjacency[node];
    }

    public void sorting() {
        for(List<Integer> list : adjacency)
            Collections.sort(list);
    }

    public String toString() {
        StringBuilder s = new StringBuilder();
        String newLine = System.getProperty("line.separator");
        s.append("wierzcholki: ").append(nodes).append("; krawedzie: ").append(edges)
                .append(newLine);
        for (int i = 0; i < nodes; i++) {
            s.append(i).append(": ");
            for (int w : adjacency[i]) {
                s.append(w).append(" ");
            }
            s.append(newLine);
        }
        return s.toString();
    }

}
