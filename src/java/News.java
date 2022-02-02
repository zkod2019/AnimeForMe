import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io. IOException ;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;


public class News extends HttpServlet {
    private static String escapeJSON(String json) {
        return json.replace("\\", "\\\\").replace("\"", "\\\"");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String page = "https://myanimelist.net/news";
        try (PrintWriter out = response.getWriter()) {
            Document doc = Jsoup.connect(page).get();
            Elements newsUnits = doc.body().getElementsByClass("news-list").first().select(".news-unit.clearfix.rect");
            
            String newsAsList = "[";
            for (Element unit : newsUnits) {
                log(unit.toString());

                String imageUrl = unit.getElementsByTag("img").first().attr("src");
                String title = unit.getElementsByClass("title").first().text();
                String excerpt = unit.getElementsByClass("text").first().text();
                String url = unit.getElementsByTag("a").first().attr("href");
                
                newsAsList += String.format(
                        "{\"imageUrl\": \"%s\", \"title\": \"%s\", \"excerpt\": \"%s\", \"url\": \"%s\"},",
                        imageUrl,
                        escapeJSON(title),
                        escapeJSON(excerpt),
                        url
                ); 
            }
            if (newsAsList.endsWith(",")) {
                newsAsList = newsAsList.substring(0, newsAsList.length() - 1);
            }
            newsAsList += "]";
            out.println(newsAsList);
        } catch( IOException ex){
            System.out.println("Error getting page: " + ex.getMessage());
        }
    }
}