import org.json.JSONObject;

public class Json {
    public String newJsonString(String a, String b)
    {
        try {
            return String.valueOf(new JSONObject()
                    .put("sender", a)
                    .put("message", b));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

}
