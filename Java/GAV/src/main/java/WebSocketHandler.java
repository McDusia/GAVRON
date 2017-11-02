import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import java.io.IOException;
import java.net.HttpCookie;


//SERVER SIDE
@WebSocket
public class WebSocketHandler {
    private String sender, msg;
    private GAVSystem gav;
    private int nodesNumber = 0;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {

        if(gav==null)
            gav = new GAVSystem();
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        //???
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        //System.out.println(message);
        //System.out.println("test"+message.codePointAt(0));
        switch (message.codePointAt(0)){
            case 1:
                //user chose BFS
                System.out.println("BFS chosen");
                break;
            case 2:
                //user chose DFS
                System.out.println("DFS chosen");

                break;
            case 3:
                System.out.println("edge added -> " + message.substring(1));
                break;
            case 4:
                System.out.println("node deleted -> " + message.substring(1));
                break;
            case 5:
                System.out.println("nodes number -> " + message.substring(1));
                //nodesNumber =;
                Json j2 = new Json();
                String JsonToSend2 = j2.newJsonString("ja",message);
                try {
                    user.getRemote().sendString(JsonToSend2);
                }catch (IOException e)
                {
                    e.printStackTrace();
                }
            break;
            case 6:
                System.out.println("graph is ready");
                break;
            case 7:
                System.out.println("---RESTART---");
                break;
            case 8:
                System.out.println("start node -> " + message.substring(1));
                break;
        }
    }
}
