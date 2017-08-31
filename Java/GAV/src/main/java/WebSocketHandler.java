import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import java.io.IOException;
import java.net.HttpCookie;


//SERVER SIDE
@WebSocket
public class WebSocketHandler {
    private String sender, msg;
    private GAVSystem gav;

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
                //user chose chatbot
                String question = message.substring(1, message.length());
                String response ="";
                Chatbot bot = new Chatbot();
                switch (question)
                {
                    case "time":
                        response = bot.getTime();
                        break;
                    case "weekday":
                        response = bot.getDay();
                        break;
                    case "weather":
                        response = bot.getWeatherInfo();
                        break;
                }
                Json j = new Json();
                String JsonToSend = j.newJsonString(question,response);
                try {
                    user.getRemote().sendString(JsonToSend);
                }catch (IOException e)
                {
                    e.printStackTrace();
                }
                break;
            case 4:
                System.out.println("user wants to leave chatbot");
                break;
        }
    }
}
