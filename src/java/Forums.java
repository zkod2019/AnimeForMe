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
public class Forums extends HttpServlet {
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
        
        String username = request.getParameter("username");
        PreparedStatement getForumsStatement = null;
        ResultSet getForumsRs = null;
        try {
            getForumsStatement = conn.prepareStatement("SELECT * FROM ForumMembers WHERE username = (?) ORDER BY optionEnum, targetId");
            getForumsStatement.setString(1, username);
            getForumsRs =  getForumsStatement.executeQuery();
            String outputArray = "[";
            while (getForumsRs.next()) {
                int option = getForumsRs.getInt("optionEnum");
                int targetId = getForumsRs.getInt("targetId");

                outputArray += String.format(
                        "{\"animeId\": %s, \"mangaId\": %s},",
                        option == 0 ? String.valueOf(targetId) : "null",
                        option == 1 ? String.valueOf(targetId) : "null"
                );
            }
                        
            if (outputArray.endsWith(",")) outputArray = outputArray.substring(0, outputArray.length() - 1);
            outputArray += "]";
            
            response.setStatus(200);
            out.println(outputArray);
        } catch (SQLException ex) {
            Logger.getLogger(Forums.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            try {getForumsRs.close();} catch (SQLException ex) {throw new ServletException(ex);}
            try {getForumsStatement.close();} catch (SQLException ex) {throw new ServletException(ex);}
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("text/plain");
        
        String username = request.getParameter("username");
        int targetId = Integer.parseInt(request.getParameter("targetId"));
        int option = Integer.parseInt(request.getParameter("option"));
        
        PreparedStatement insertStatement = null;
        try {
            insertStatement = conn.prepareStatement("INSERT INTO ForumMembers(username, targetId, optionEnum) VALUES ((?), (?), (?))");
            insertStatement.setString(1, username);
            insertStatement.setInt(2, targetId);
            insertStatement.setInt(3, option);
            
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
        
        String username = request.getParameter("username");
        int targetId = Integer.parseInt(request.getParameter("targetId"));
        int option = Integer.parseInt(request.getParameter("option"));
        
        PreparedStatement deleteStatement = null;
        try {
            deleteStatement = conn.prepareStatement("DELETE FROM ForumMembers WHERE username =(?) AND targetId =(?) AND optionEnum =(?)");
            deleteStatement.setString(1, username);
            deleteStatement.setInt(2, targetId);
            deleteStatement.setInt(3, option);
            
            deleteStatement.executeUpdate();
            response.setStatus(200);
            out.println("Successfully deleted new user to forum.");
        } catch (SQLException ex) {
            Logger.getLogger(Forums.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            try {deleteStatement.close();} catch (SQLException ex) {throw new ServletException(ex);}
        }

    }
    
    
}
