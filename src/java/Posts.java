import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Zaya
 */
public class Posts extends HttpServlet {
    private Connection conn;
    
    @Override
    public void init() throws ServletException {
        try {
            conn = DriverManager.getConnection("jdbc:derby://localhost:1527/userjsf", "root", "userjsf");
        } catch (SQLException ex) {
            throw new ServletException(ex);
        }
    }
    
    @Override
    public void destroy() {
        try {
            conn.close();
        } catch (SQLException ex) {
            Logger.getLogger(Forums.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");

        int targetId = Integer.parseInt(request.getParameter("targetId"));
        int option = Integer.parseInt(request.getParameter("option"));
        
        PreparedStatement getPostsStatement = null;
        ResultSet getPostsRs = null;
        
        try {
            getPostsStatement = conn.prepareStatement("SELECT * FROM Posts WHERE targetId = (?) AND optionEnum = (?)");
            getPostsStatement.setInt(1, targetId);
            getPostsStatement.setInt(2, option);
            
            getPostsRs = getPostsStatement.executeQuery();
            
            String outputArray = "[";
            while (getPostsRs.next()) {
                outputArray += String.format(
                        "{\"id\": %d, \"authorName\": \"%s\", \"content\": \"%s\"},",
                        getPostsRs.getInt("postId"), 
                        getPostsRs.getString("authorName"),
                        getPostsRs.getString("content")
                );
            }
                        
            if (outputArray.endsWith(",")) outputArray = outputArray.substring(0, outputArray.length() - 1);
            outputArray += "]";
            
            response.setStatus(200);
            out.println(outputArray);
        } catch (SQLException ex) {
            Logger.getLogger(Posts.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
        }
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        
        String authorName = request.getParameter("authorName");
        int targetId = Integer.parseInt(request.getParameter("targetId"));
        int option = Integer.parseInt(request.getParameter("option"));
        String content = request.getParameter("content");
        
        PreparedStatement insertStatement = null;
        try {
            insertStatement = conn.prepareStatement("INSERT INTO Posts(postId, authorName, targetId, optionEnum, content ) VALUES (DEFAULT,(?), (?), (?), (?))");
            insertStatement.setString(1, authorName);
            insertStatement.setInt(2, targetId);
            insertStatement.setInt(3, option);
            insertStatement.setString(4, content);
            
            insertStatement.executeUpdate();
            response.setStatus(200);
            out.println("Successfully added new user to forum.");
        } catch (SQLException ex) {
            Logger.getLogger(Forums.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            try {insertStatement.close();} catch (SQLException ex) {throw new ServletException(ex);}
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("text/plain");
        
        int postId = Integer.parseInt(request.getParameter("postId"));
        
        PreparedStatement deleteStatement = null;
        try {
            deleteStatement = conn.prepareStatement("DELETE FROM Posts WHERE postId = (?)");
            deleteStatement.setInt(1, postId);
            
            deleteStatement.executeUpdate();
            response.setStatus(200);
            out.println("Successfully deleted post.");
        } catch (SQLException ex) {
            Logger.getLogger(Forums.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            try {deleteStatement.close();} catch (SQLException ex) {throw new ServletException(ex);}
        }

    }
    
   
}
