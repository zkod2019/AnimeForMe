/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
public class ACM extends HttpServlet {
//    private int statusStringToInt(String status) {
//        if (status.equals("none")) {
//            return 0;
//        } else if (status.equals("completed")) {
//            return 1;
//        } else if (status.equals("active")){
//            return 2;
//        }else if (status.equals("paused")){
//            return 3;
//        }else{
//            return -1;
//        }
//    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String option = request.getParameter("option");

        PrintWriter out = response.getWriter();
        Connection conn = null;
        PreparedStatement getStatement = null;
        
        ResultSet userField = null; 

        try {
            conn = DriverManager.getConnection("jdbc:derby://localhost:1527/userjsf", "root", "userjsf");

            getStatement = conn.prepareStatement(
                    String.format("SELECT * FROM %srelation WHERE username = (?)", option),
                    ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE
            );

            getStatement.setString(1, username);
            userField = getStatement.executeQuery();
            
            String results = "[";
            boolean isEmpty =! userField.isBeforeFirst();
            while (userField.next()) {
                results += String.format(
                        "{\"username\": \"%s\", \"%sId\": %d, \"status\": %d},",
                        userField.getString("username"),
                        option,
                        userField.getInt(String.format("%sId", option)),
                        userField.getInt("status")
                );
            }
            
            if (!isEmpty) {
                results = results.substring(0, results.length() - 1);
            }
            
            results += "]";
            
            response.setStatus(200);
            out.println(String.format("{\"data\": %s}", results));
        } catch (SQLException ex) {
            Logger.getLogger(ACM.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();     
        
        String option = request.getParameter("option");
        String status = request.getParameter("status");
        String username = request.getParameter("username");
        
        log(status);
        log("hellooo");

        Connection conn = null;
        PreparedStatement insertStatement = null;

        try  {
            conn = DriverManager.getConnection("jdbc:derby://localhost:1527/userjsf", "root", "userjsf");

            if (option.equals("manga")) {
                log("manga option");
                int mangaId = Integer.parseInt(request.getParameter("mangaId"));
                

                insertStatement = conn.prepareStatement("INSERT INTO mangarelation(username, mangaId, status) VALUES ((?), (?), (?))");
                insertStatement.setString(1, username);
                insertStatement.setInt(2, mangaId);
                insertStatement.setInt(3, Integer.parseInt(status));
                
                insertStatement.executeUpdate();
                
                response.setStatus(200);
                out.println("Manga added.");
            }else if (option.equals("anime")) {
                log("anime option");
                int animeId = Integer.parseInt(request.getParameter("animeId"));
                

                insertStatement = conn.prepareStatement("INSERT INTO animerelation(username, animeId, status) VALUES ((?), (?), (?))");
                insertStatement.setString(1, username);
                insertStatement.setInt(2, animeId);
                insertStatement.setInt(3, Integer.parseInt(status));
                
                insertStatement.executeUpdate();
                
                response.setStatus(200);
                out.println("Anime added.");
            }else if (option.equals("characters")) {
                log("characters option");
                int characterId = Integer.parseInt(request.getParameter("characterId"));
                

                insertStatement = conn.prepareStatement("INSERT INTO charactersrelation(username, characterId) VALUES ((?), (?))");
                insertStatement.setString(1, username);
                insertStatement.setInt(2, characterId);
                
                insertStatement.executeUpdate();
                
                response.setStatus(200);
                out.println("Character added.");
            }
            
        } catch (SQLException ex) {
            Logger.getLogger(ACM.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            if (insertStatement != null) {
                try {insertStatement.close();} catch (SQLException e) {/*Ignore*/}
            }
        }
    }
    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();     
        
        String option = request.getParameter("option");
        String status = request.getParameter("status");
        String username = request.getParameter("username");
        
        log(status);
        log("; — ;");

        Connection conn = null;
        PreparedStatement updateStatement = null;

        try  {
            conn = DriverManager.getConnection("jdbc:derby://localhost:1527/userjsf", "root", "userjsf");

            if (option.equals("manga")) {
                log("manga option");
                int mangaId = Integer.parseInt(request.getParameter("mangaId"));
                

                updateStatement = conn.prepareStatement("UPDATE mangarelation SET status=(?) WHERE username=(?) AND mangaId = (?) ");
                updateStatement.setInt(1, Integer.parseInt(status));
                updateStatement.setString(2, username);
                updateStatement.setInt(3, mangaId);
                updateStatement.executeUpdate();
                
                response.setStatus(200);
                out.println("Manga status updated.");
            }else if(option.equals("anime")) {
                log("anime option");
                int animeId = Integer.parseInt(request.getParameter("animeId"));
                

                updateStatement = conn.prepareStatement("UPDATE animerelation SET status=(?) WHERE username=(?) AND animeId = (?) ");
                updateStatement.setInt(1, Integer.parseInt(status));
                updateStatement.setString(2, username);
                updateStatement.setInt(3, animeId);
                updateStatement.executeUpdate();
                
                response.setStatus(200);
                out.println("Anime status updated.");
            }
        } catch (SQLException ex) {
            Logger.getLogger(ACM.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            out.close();
            if (updateStatement != null) {
                try {updateStatement.close();} catch (SQLException e) {/*Ignore*/}
            }
        }
    }

}
