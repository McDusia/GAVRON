import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;


import java.io.IOException;

import static java.lang.Thread.sleep;

/**
 * Created by Madzia on 02.11.2017.
 */
public class DFS {

    private int[] edgeTo;
    private boolean[] marked;
    private int source = 0;
    private WebSocketHandler w;
    private Session user;

    public DFS (Graph graph, int source, WebSocketHandler w, Session u){
        this.w = w;
        this.user = u;
        this.source = source;
        int n = graph.getNumberOfNodes();
        edgeTo = new int[n];
        marked = new boolean[n];
        dfsSearching(graph,source);
    }

    private void dfsSearching(Graph graph, int vertex) {
        marked[vertex] = true;
        System.out.println("Odwiedzam"+ vertex);
        Json j = new Json();
        String JsonToSend = j.newJsonString("ja","2"+ String.valueOf(vertex));
        try {
            user.getRemote().sendString(JsonToSend);
        }catch (IOException e)
        {
            e.printStackTrace();
        }

        try {
            sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        for(int w: graph.getAdjacency(vertex)) {
            if(!marked[w]) {
                edgeTo[w] = vertex;
                dfsSearching(graph,w);
            }
        }
    }
}
