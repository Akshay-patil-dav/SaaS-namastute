================================================================================
                    NAMUSTUTAM POS - DESKTOP EDITION
================================================================================

Welcome to Namustutam SaaS & POS Desktop Application!

1. FAST INSTALLATION:
   Run 'namustutam_POS.exe' directly. It will:
   - Install the complete application to C:\NamustutamPOS
   - Auto-configure and start PostgreSQL database ('namustute_db_pos')
   - Automatically seed initial database tables, admin users, & POS catalog
   - Create a Desktop Shortcut "Namustutam POS"
   - Launch the POS web application directly in your browser

2. ACCESSING THE APPLICATION:
   - Application URL: http://localhost:3000
   - Super Admin Login:
       Email:    admin@gmail.com
       Password: Admin@12345
       Role:     SUPER_ADMIN (Full Enterprise POS & Inventory Access)

3. PORTS USED:
   - 3000: Spring Boot Application + React POS Single-Page App
   - 5432: PostgreSQL Database Engine

4. DESKTOP SHORTCUT & LAUNCHER:
   - Double-clicking the "Namustutam POS" desktop shortcut starts the database,
     starts the application server, and opens your browser directly.
   - A system tray icon in the Windows taskbar lets you open the dashboard or
     stop the application cleanly at any time.

5. COMMAND LINE CONTROLS:
   - start.bat     : Start database, application server, and open browser
   - stop.bat      : Stop application server and database cleanly
   - setup_db.bat  : Standalone database verification and startup
   - uninstall.bat : Remove shortcuts and prepare for clean uninstall

================================================================================
