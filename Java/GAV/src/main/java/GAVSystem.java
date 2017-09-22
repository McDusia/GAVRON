
import static spark.Spark.init;
import static spark.Spark.staticFileLocation;
import static spark.Spark.webSocket;


public class GAVSystem {


    public static void main(String[] args) {

        webSocket("/public/", WebSocketHandler.class);
        staticFileLocation("/public/"); //index.html is served at localhost:4567 (default port)
        init();

    }
}
