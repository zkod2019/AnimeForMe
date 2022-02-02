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
public class SignIn extends HttpServlet {

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
        response.setContentType("text/plain;charset=UTF-8"); // this was had "text/plain" before
        
        String username = null;
        String password = null;
        
        StringBuilder bodyBuffer = new StringBuilder();
        BufferedReader bodyReader = request.getReader();
           String line;
        while ((line = bodyReader.readLine()) != null) {
            bodyBuffer.append(line);
        }
        String body = bodyBuffer.toString();
        log(body);
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
                    response.setStatus(404);
                    out.println("User Not Found.");
                } else {
                    rs.next();
                    String databasepassword = rs.getString("password");
                    if (password.equals(databasepassword)){
                        response.setStatus(200);
                        out.println("Password is Correct.");
                    }else{
                        response.setStatus(401);
                        out.println("Unauthorized.");
                    }
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
