/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Zaya
 */
public class SignUpServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet SignUpServlet</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet SignUpServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8"); // this was had "text/plain" before
        
        String username = null;
        String password = null;
        
        StringBuilder bodyBuffer = new StringBuilder();
        BufferedReader bodyReader = request.getReader();
           String line;
        while ((line = bodyReader.readLine()) != null) {
            bodyBuffer.append(line);
        }
        String body = bodyBuffer.toString();
        String[] pairs = body.split("&");
        for (String pair : pairs) {
            String[] splitPair = pair.split("=");
            if (splitPair[0].equals("username")) {
                username = splitPair[1];
            } else if (splitPair[0].equals("password")) {
                password = splitPair[1];
            }
        }
        
        Connection conn = null;
        PreparedStatement existenceCheckStmt = null;
        PreparedStatement insertStmt = null;
        ResultSet rs = null;
        
        try (PrintWriter out = response.getWriter()) {
            try {
                conn = DriverManager.getConnection("jdbc:derby://localhost:1527/userjsf", "root", "userjsf");
                existenceCheckStmt = conn.prepareStatement(
                        "SELECT * FROM Users WHERE username = (?)",
                        ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE
                );
                existenceCheckStmt.setString(1, username);
                rs = existenceCheckStmt.executeQuery();
                if (!rs.isBeforeFirst()) {
                    // If did not find existing user
                    insertStmt = conn.prepareStatement(
                            "INSERT INTO Users(username, password) VALUES (?, ?)",
                            ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE
                    );
                   
                    insertStmt.setString(1, username);
                    insertStmt.setString(2, password);
                    insertStmt.executeUpdate();
                    
                    response.setStatus(200);
                    response.sendRedirect(request.getContextPath() + "/home.html");
                } else {
                    response.setStatus(403);
//                    String someMessage = "Error !";
//                    PrintWriter uuu = response.getWriter();
//                    uuu.print("<html><head>");
//                    uuu.print("<script type=\"text/javascript\">alert(" + someMessage + ");</script>");
//                    uuu.print("</head><body></body></html>");
                   
//                   PrintWriter uuu = response.getWriter();  
//                    response.setContentType("text/html");  
//                    uuu.println("<script type=\"text/javascript\">");  
//                    uuu.println("alert('This user already exists, try a different name');");  
//                    uuu.println("</script>");
                   response.sendRedirect(request.getContextPath() + "/?errorType=username-taken");//userExist.html
                    

                }
            } catch (SQLException e) {
                e.printStackTrace();
                
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                
                response.setStatus(500);
                out.println("SQL Error. Stack trace: " + sw.toString() + ".");
            } finally {
                try { rs.close(); } catch (Exception e) { /* Ignored */ }
                try { insertStmt.close(); } catch (Exception e) { /* Ignored */ }
                try { existenceCheckStmt.close(); } catch (Exception e) { /* Ignored */ }
                try { conn.close(); } catch (Exception e) { /* Ignored */ }
            }
        }
        
        
    }
    
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
