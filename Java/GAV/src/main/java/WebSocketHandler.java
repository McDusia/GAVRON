import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import java.io.IOException;

import static java.lang.Thread.sleep;


//SERVER SIDE
@WebSocket
public class WebSocketHandler {
    private String sender, msg;
    private GAVSystem gav;
    private int nodesNumber = 0;
    private int algoritm = 0;


    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {

        if(gav==null)
            gav = new GAVSystem();
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        System.out.println("Connection closed");
    }

    Graph g = new Graph(0);
    int startNode;
    @OnWebSocketMessage
    public void onMessage(Session user, String message) {

        int nodesQuantity;
        switch (message.codePointAt(0)){
            case 1:
                //user chose BFS
                algoritm = 1;
                System.out.println("BFS chosen");
                break;
            case 2:
                //user chose DFS
                algoritm = 2;
                System.out.println("DFS chosen");

                break;
            case 3:
                System.out.println("edge added -> " + message.substring(1));
                String[] parts = message.substring(1).split("-",2);
                g.addEdge(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
                break;
            case 4:
                System.out.println("node deleted -> " + message.substring(1));
                //nie obsluzone jeszcze
                break;
            case 5:
                System.out.println("nodes quantity -> " + message.substring(1));
                nodesQuantity = Integer.parseInt(message.substring(1));
                g = new Graph(nodesQuantity);
                System.out.println(g.toString());
                Json j2 = new Json();
                String JsonToSend2 = j2.newJsonString("ja","0");
                try {
                    user.getRemote().sendString(JsonToSend2);
                }catch (IOException e)
                {
                    e.printStackTrace();
                }

                break;
            case 6:
                g.sorting();
                System.out.println("graph is ready");
                System.out.println(g.toString());
                break;
            case 7:
                System.out.println("---RESTART---");
                break;
            case 8:

                System.out.println("start node -> " + message.substring(1));
                startNode = Integer.parseInt(message.substring(1));
                break;

            case 9:
                try {
                    sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if(algoritm == 1)
                    //new BFS(g,Integer.parseInt(message.substring(1)), this, user);
                    new BFS(g,Integer.parseInt(message.substring(1)), this, user);
                else if(algoritm == 2)
                    new DFS(g,Integer.parseInt(message.substring(1)), this, user);
                break;


        }
    }
    /*@OnWebSocketMessage
    public void transferMessage(Session user, Session message, String msg) {
        Json j = new Json();
        String JsonToSend = j.newJsonString("ja",msg);
        try {
            user.getRemote().sendString(JsonToSend);
        }catch (IOException e)
        {
            e.printStackTrace();
        }
    }*/

}
