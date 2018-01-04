import org.eclipse.jetty.websocket.api.Session;

import java.io.IOException;
import java.util.LinkedList;
import java.util.Queue;

import static java.lang.Thread.sleep;

/**
 * Created by Madzia on 26.11.2017.
 */
public class BFS {

    private int[] edgeTo;
    private boolean[] marked;
    private int source = 0;
    private WebSocketHandler w;
    private Session user;

    public BFS(Graph graph, int source, WebSocketHandler w, Session u) {
        this.w = w;
        this.user = u;
        this.source = source;
        int n = graph.getNumberOfNodes();
        edgeTo = new int[n];
        marked = new boolean[n];
        bfsSearching(graph);
    }

    private void bfsSearching(Graph graph) {

        Queue queue = new LinkedList();
        queue.add(source);

        while(!queue.isEmpty())
        {
            int vertex = (int)queue.remove();

            marked[vertex] = true;
            System.out.println("Odwiedzam" + vertex);
            Json j = new Json();
            String JsonToSend = j.newJsonString("ja", "2" + String.valueOf(vertex));
            try {
                user.getRemote().sendString(JsonToSend);
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


            for(int w: graph.getAdjacency(vertex))
            {
                if(!marked[w])
                    queue.add(w);
            }

        }
    }

}