using System;
using System.Drawing;
using System.IO;
using System.Net.Sockets;
using System.Reflection;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;

namespace NamustutamPOS
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string exePath = Assembly.GetExecutingAssembly().Location;
            string exeDir = Path.GetDirectoryName(exePath);
            string jarInExeDir = Path.Combine(exeDir, "app.jar");

            bool forceInstall = false;
            bool silentInstall = false;

            if (args != null)
            {
                foreach (string arg in args)
                {
                    if (arg.Equals("/install", StringComparison.OrdinalIgnoreCase) ||
                        arg.Equals("--install", StringComparison.OrdinalIgnoreCase) ||
                        arg.Equals("/setup", StringComparison.OrdinalIgnoreCase) ||
                        arg.Equals("--setup", StringComparison.OrdinalIgnoreCase))
                    {
                        forceInstall = true;
                    }
                    if (arg.Equals("/silent", StringComparison.OrdinalIgnoreCase) ||
                        arg.Equals("/s", StringComparison.OrdinalIgnoreCase))
                    {
                        silentInstall = true;
                    }
                }
            }

            // If running outside the installed location (app.jar is not next to exe) or forceInstall is set:
            if (forceInstall || !File.Exists(jarInExeDir))
            {
                Application.Run(new InstallerForm(silentInstall));
            }
            else
            {
                Application.Run(new LauncherContext(exeDir));
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  INSTALLER & SETUP WIZARD GUI
    // ─────────────────────────────────────────────────────────────────────────
    public class InstallerForm : Form
    {
        private TextBox txtPath;
        private Button btnBrowse;
        private CheckBox chkDesktop;
        private CheckBox chkStartMenu;
        private CheckBox chkDatabase;
        private CheckBox chkLaunch;
        private ProgressBar progressBar;
        private TextBox txtLog;
        private Button btnInstall;
        private Button btnCancel;
        private bool isInstalling = false;
        private bool silent = false;

        public InstallerForm(bool silentMode)
        {
            this.silent = silentMode;
            InitializeComponent();

            if (silent)
            {
                this.WindowState = FormWindowState.Minimized;
                this.ShowInTaskbar = false;
                this.Shown += delegate { StartInstallation(); };
            }
        }

        private void InitializeComponent()
        {
            this.Text = "Namustutam POS — Desktop Setup & Installer";
            this.Size = new Size(620, 520);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(248, 250, 252);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point);

            // Try loading embedded icon
            try
            {
                using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream("AppIcon"))
                {
                    if (s != null) this.Icon = new Icon(s);
                }
            }
            catch { }

            // ── Top Header Banner ─────────────────────────────────────────────
            Panel pnlHeader = new Panel
            {
                Dock = DockStyle.Top,
                Height = 75,
                BackColor = Color.FromArgb(15, 23, 42) // #0f172a
            };

            Label lblTitle = new Label
            {
                Text = "Namustutam POS",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 15F, FontStyle.Bold),
                Location = new Point(20, 14),
                AutoSize = true
            };

            Label lblSub = new Label
            {
                Text = "All-in-One Retail SaaS & POS Desktop Installation",
                ForeColor = Color.FromArgb(148, 163, 184),
                Font = new Font("Segoe UI", 9F, FontStyle.Regular),
                Location = new Point(22, 44),
                AutoSize = true
            };

            pnlHeader.Controls.Add(lblTitle);
            pnlHeader.Controls.Add(lblSub);
            this.Controls.Add(pnlHeader);

            // ── Target Directory ──────────────────────────────────────────────
            Label lblDir = new Label
            {
                Text = "Installation Folder:",
                Location = new Point(20, 90),
                AutoSize = true,
                Font = new Font("Segoe UI", 9F, FontStyle.Bold)
            };
            this.Controls.Add(lblDir);

            string defaultDir = @"C:\NamustutamPOS";
            try
            {
                // Verify if C:\ is writable, else fallback to LocalAppData
                string testPath = Path.Combine(defaultDir, ".test");
                Directory.CreateDirectory(defaultDir);
                File.WriteAllText(testPath, "1");
                File.Delete(testPath);
            }
            catch
            {
                defaultDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NamustutamPOS");
            }

            txtPath = new TextBox
            {
                Text = defaultDir,
                Location = new Point(20, 112),
                Size = new Size(465, 25)
            };
            this.Controls.Add(txtPath);

            btnBrowse = new Button
            {
                Text = "Browse...",
                Location = new Point(495, 110),
                Size = new Size(95, 28),
                BackColor = Color.FromArgb(226, 232, 240)
            };
            btnBrowse.Click += delegate
            {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    fbd.SelectedPath = txtPath.Text;
                    fbd.Description = "Select Installation Folder for Namustutam POS";
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        txtPath.Text = fbd.SelectedPath;
                    }
                }
            };
            this.Controls.Add(btnBrowse);

            // ── Options Checkboxes ────────────────────────────────────────────
            chkDesktop = new CheckBox
            {
                Text = "Create Desktop Shortcut (Namustutam POS)",
                Checked = true,
                Location = new Point(22, 148),
                Size = new Size(320, 22)
            };
            this.Controls.Add(chkDesktop);

            chkStartMenu = new CheckBox
            {
                Text = "Create Start Menu Program Group",
                Checked = true,
                Location = new Point(22, 172),
                Size = new Size(320, 22)
            };
            this.Controls.Add(chkStartMenu);

            chkDatabase = new CheckBox
            {
                Text = "Auto-Configure & Start Database (namustute_db_pos)",
                Checked = true,
                Location = new Point(340, 148),
                Size = new Size(260, 22)
            };
            this.Controls.Add(chkDatabase);

            chkLaunch = new CheckBox
            {
                Text = "Launch Namustutam POS after installation",
                Checked = true,
                Location = new Point(340, 172),
                Size = new Size(260, 22)
            };
            this.Controls.Add(chkLaunch);

            // ── Progress & Log Console ────────────────────────────────────────
            progressBar = new ProgressBar
            {
                Location = new Point(20, 204),
                Size = new Size(570, 18),
                Style = ProgressBarStyle.Continuous,
                Minimum = 0,
                Maximum = 100,
                Value = 0
            };
            this.Controls.Add(progressBar);

            txtLog = new TextBox
            {
                Location = new Point(20, 230),
                Size = new Size(570, 195),
                Multiline = true,
                ReadOnly = true,
                ScrollBars = ScrollBars.Vertical,
                BackColor = Color.FromArgb(30, 41, 59), // #1e293b
                ForeColor = Color.FromArgb(226, 232, 240),
                Font = new Font("Consolas", 8.5F, FontStyle.Regular)
            };
            this.Controls.Add(txtLog);

            // ── Bottom Action Buttons ─────────────────────────────────────────
            btnInstall = new Button
            {
                Text = "Install Now",
                Location = new Point(365, 436),
                Size = new Size(130, 34),
                BackColor = Color.FromArgb(37, 99, 235), // #2563eb
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 9.5F, FontStyle.Bold),
                FlatStyle = FlatStyle.Flat
            };
            btnInstall.FlatAppearance.BorderSize = 0;
            btnInstall.Click += delegate { StartInstallation(); };
            this.Controls.Add(btnInstall);

            btnCancel = new Button
            {
                Text = "Cancel",
                Location = new Point(505, 436),
                Size = new Size(85, 34),
                BackColor = Color.FromArgb(226, 232, 240),
                FlatStyle = FlatStyle.Flat
            };
            btnCancel.FlatAppearance.BorderSize = 0;
            btnCancel.Click += delegate { this.Close(); };
            this.Controls.Add(btnCancel);

            Log("Ready to install Namustutam POS.");
            Log("Click 'Install Now' to begin automatic setup.");
        }

        private void Log(string msg)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action<string>(Log), msg);
                return;
            }
            txtLog.AppendText(string.Format("[{0:HH:mm:ss}] {1}\r\n", DateTime.Now, msg));
        }

        private void SetProgress(int val)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action<int>(SetProgress), val);
                return;
            }
            progressBar.Value = Math.Min(100, Math.Max(0, val));
        }

        private void StartInstallation()
        {
            if (isInstalling) return;
            isInstalling = true;

            btnInstall.Enabled = false;
            btnBrowse.Enabled = false;
            txtPath.ReadOnly = true;

            string targetDir = txtPath.Text.Trim();
            bool makeDesktop = chkDesktop.Checked;
            bool makeStart = chkStartMenu.Checked;
            bool setupDb = chkDatabase.Checked;
            bool launchAfter = chkLaunch.Checked;

            Thread worker = new Thread(delegate ()
            {
                try
                {
                    Log("==================================================");
                    Log("Starting Installation process...");
                    Log("Destination Folder: " + targetDir);
                    SetProgress(5);

                    if (!Directory.Exists(targetDir))
                    {
                        Directory.CreateDirectory(targetDir);
                    }
                    SetProgress(10);

                    // 1. Extract app.jar
                    Log("Extracting application package (app.jar)...");
                    ExtractResource("AppJar", Path.Combine(targetDir, "app.jar"));
                    SetProgress(45);
                    Log("Extracted app.jar successfully.");

                    // 2. Extract app.ico
                    Log("Extracting application icon...");
                    ExtractResource("AppIcon", Path.Combine(targetDir, "app.ico"));
                    SetProgress(50);

                    // 3. Extract batch scripts & readme
                    Log("Extracting management scripts (start.bat, stop.bat, setup_db.bat)...");
                    ExtractResource("StartBat", Path.Combine(targetDir, "start.bat"));
                    ExtractResource("StopBat", Path.Combine(targetDir, "stop.bat"));
                    ExtractResource("SetupDbBat", Path.Combine(targetDir, "setup_db.bat"));
                    ExtractResource("UninstallBat", Path.Combine(targetDir, "uninstall.bat"));
                    ExtractResource("ReadmeTxt", Path.Combine(targetDir, "README.txt"));
                    SetProgress(60);

                    // 4. Copy launcher exe to target directory
                    string currentExe = Assembly.GetExecutingAssembly().Location;
                    string targetExe = Path.Combine(targetDir, "namustutam_POS.exe");
                    try
                    {
                        File.Copy(currentExe, targetExe, true);
                        Log("Installed desktop launcher: namustutam_POS.exe");
                    }
                    catch (Exception ex)
                    {
                        Log("Note on launcher copy: " + ex.Message);
                    }
                    SetProgress(70);

                    // 5. Database Setup
                    if (setupDb)
                    {
                        Log("Configuring PostgreSQL database environment...");
                        ConfigureDatabase(targetDir);
                    }
                    SetProgress(85);

                    // 6. Create Desktop Shortcut
                    string icoPath = Path.Combine(targetDir, "app.ico");
                    if (makeDesktop)
                    {
                        Log("Creating Desktop Shortcut: Namustutam POS.lnk...");
                        string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                        string lnkPath = Path.Combine(desktopPath, "Namustutam POS.lnk");
                        CreateShortcut(lnkPath, targetExe, targetDir, icoPath, "Namustutam POS — Desktop Retail Platform");
                        Log("Desktop shortcut created successfully.");
                    }

                    // 7. Create Start Menu Shortcut
                    if (makeStart)
                    {
                        Log("Creating Start Menu Program group...");
                        string smPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "Namustutam POS");
                        if (!Directory.Exists(smPath)) Directory.CreateDirectory(smPath);
                        CreateShortcut(Path.Combine(smPath, "Namustutam POS.lnk"), targetExe, targetDir, icoPath, "Namustutam POS");
                        CreateShortcut(Path.Combine(smPath, "Stop Namustutam POS.lnk"), Path.Combine(targetDir, "stop.bat"), targetDir, null, "Stop Namustutam POS");
                        Log("Start Menu shortcuts created.");
                    }

                    SetProgress(100);
                    Log("==================================================");
                    Log("Installation Completed Successfully!");
                    Log("Default Super Admin Login:");
                    Log("  Email:    admin@gmail.com");
                    Log("  Password: Admin@12345");
                    Log("==================================================");

                    this.Invoke(new Action(delegate ()
                    {
                        btnInstall.Text = "Launch App";
                        btnInstall.Enabled = true;
                        btnInstall.Click += delegate
                        {
                            LaunchApp(targetDir);
                            this.Close();
                        };
                        btnCancel.Text = "Close";

                        if (launchAfter)
                        {
                            Thread.Sleep(1000);
                            LaunchApp(targetDir);
                            this.Close();
                        }
                    }));
                }
                catch (Exception ex)
                {
                    Log("ERROR: " + ex.Message);
                    this.Invoke(new Action(delegate ()
                    {
                        btnInstall.Enabled = true;
                        btnCancel.Enabled = true;
                        MessageBox.Show(this, "An error occurred during installation:\n" + ex.Message, "Installation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }));
                }
            });

            worker.IsBackground = true;
            worker.Start();
        }

        private void ExtractResource(string resName, string outPath)
        {
            Assembly asm = Assembly.GetExecutingAssembly();
            using (Stream s = asm.GetManifestResourceStream(resName))
            {
                if (s == null)
                {
                    Log("Warning: Resource '" + resName + "' not found inside installer package.");
                    return;
                }
                using (FileStream fs = new FileStream(outPath, FileMode.Create, FileAccess.Write))
                {
                    byte[] buffer = new byte[64 * 1024];
                    int read;
                    while ((read = s.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        fs.Write(buffer, 0, read);
                    }
                }
            }
        }

        private void ConfigureDatabase(string appDir)
        {
            try
            {
                // Check if port 5432 is already accepting connections
                if (IsPortOpen("127.0.0.1", 5432, 1000))
                {
                    Log("PostgreSQL is already active on port 5432.");
                    return;
                }

                // If not open, execute setup_db.bat to start service or local pg_ctl
                string dbScript = Path.Combine(appDir, "setup_db.bat");
                if (File.Exists(dbScript))
                {
                    Log("Running automated database setup script...");
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c \"" + dbScript + "\"",
                        WorkingDirectory = appDir,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    using (Process p = Process.Start(psi))
                    {
                        p.WaitForExit(15000);
                    }
                }
            }
            catch (Exception ex)
            {
                Log("Database configuration note: " + ex.Message);
            }
        }

        private void CreateShortcut(string shortcutPath, string targetPath, string workingDir, string iconPath, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType == null) return;
                object shell = Activator.CreateInstance(shellType);
                object sc = shellType.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { shortcutPath });
                Type scType = sc.GetType();
                scType.InvokeMember("TargetPath", BindingFlags.SetProperty, null, sc, new object[] { targetPath });
                scType.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, sc, new object[] { workingDir });
                if (!string.IsNullOrEmpty(iconPath) && File.Exists(iconPath))
                {
                    scType.InvokeMember("IconLocation", BindingFlags.SetProperty, null, sc, new object[] { iconPath });
                }
                scType.InvokeMember("Description", BindingFlags.SetProperty, null, sc, new object[] { description });
                scType.InvokeMember("Save", BindingFlags.InvokeMethod, null, sc, null);
            }
            catch (Exception ex)
            {
                Log("Shortcut note: " + ex.Message);
            }
        }

        private bool IsPortOpen(string host, int port, int timeoutMs)
        {
            try
            {
                using (TcpClient client = new TcpClient())
                {
                    IAsyncResult result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(timeoutMs);
                    if (!success) return false;
                    client.EndConnect(result);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        private void LaunchApp(string targetDir)
        {
            string launcherExe = Path.Combine(targetDir, "namustutam_POS.exe");
            if (File.Exists(launcherExe))
            {
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = launcherExe,
                    WorkingDirectory = targetDir,
                    UseShellExecute = true
                };
                Process.Start(psi);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LAUNCHER & SYSTEM TRAY ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    public class LauncherContext : ApplicationContext
    {
        private string appDir;
        private Process javaProcess;
        private NotifyIcon trayIcon;

        public LauncherContext(string directory)
        {
            this.appDir = directory;
            InitializeLauncher();
        }

        private void InitializeLauncher()
        {
            // Setup Tray Icon
            trayIcon = new NotifyIcon();
            trayIcon.Text = "Namustutam POS Server";
            string icoPath = Path.Combine(appDir, "app.ico");
            if (File.Exists(icoPath))
            {
                trayIcon.Icon = new Icon(icoPath);
            }
            else
            {
                trayIcon.Icon = SystemIcons.Application;
            }

            ContextMenu contextMenu = new ContextMenu();
            contextMenu.MenuItems.Add("Open Namustutam POS", delegate { Process.Start("http://localhost:3000"); });
            contextMenu.MenuItems.Add("Open POS Terminal", delegate { Process.Start("http://localhost:3000/pos"); });
            contextMenu.MenuItems.Add("-");
            contextMenu.MenuItems.Add("Open Application Folder", delegate { Process.Start(appDir); });
            contextMenu.MenuItems.Add("-");
            contextMenu.MenuItems.Add("Stop & Exit", delegate { StopAndExit(); });
            trayIcon.ContextMenu = contextMenu;
            trayIcon.Visible = true;

            // Start in background thread
            Thread starter = new Thread(delegate ()
            {
                StartServices();
            });
            starter.IsBackground = true;
            starter.Start();
        }

        private void StartServices()
        {
            // 1. Ensure Database is running
            EnsureDatabase();

            // 2. Locate Java executable
            string javaExe = LocateJava();
            if (string.IsNullOrEmpty(javaExe))
            {
                trayIcon.ShowBalloonTip(5000, "Java Required", "Java 21+ was not found. Please install Java from https://adoptium.net/", ToolTipIcon.Warning);
                return;
            }

            // 3. Launch Spring Boot application JAR
            string jarPath = Path.Combine(appDir, "app.jar");
            if (!File.Exists(jarPath))
            {
                trayIcon.ShowBalloonTip(5000, "Error", "app.jar not found in " + appDir, ToolTipIcon.Error);
                return;
            }

            try
            {
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = javaExe,
                    Arguments = "-jar \"" + jarPath + "\"",
                    WorkingDirectory = appDir,
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true,
                    UseShellExecute = false
                };

                javaProcess = Process.Start(psi);
                trayIcon.ShowBalloonTip(3000, "Starting Namustutam POS", "Initializing application server and POS terminal...", ToolTipIcon.Info);

                // Wait for port 3000 to be ready (up to 45 seconds)
                bool ready = false;
                for (int i = 0; i < 90; i++)
                {
                    if (IsPortOpen("127.0.0.1", 3000, 500))
                    {
                        ready = true;
                        break;
                    }
                    Thread.Sleep(500);
                }

                if (ready)
                {
                    trayIcon.ShowBalloonTip(4000, "Namustutam POS is Ready!", "Application running on http://localhost:3000", ToolTipIcon.Info);
                    Process.Start("http://localhost:3000");
                }
                else
                {
                    Process.Start("http://localhost:3000");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to launch application:\n" + ex.Message, "Namustutam POS Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void EnsureDatabase()
        {
            try
            {
                if (IsPortOpen("127.0.0.1", 5432, 1000)) return;

                string setupScript = Path.Combine(appDir, "setup_db.bat");
                if (File.Exists(setupScript))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c \"" + setupScript + "\"",
                        WorkingDirectory = appDir,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    using (Process p = Process.Start(psi))
                    {
                        p.WaitForExit(15000);
                    }
                }
            }
            catch { }
        }

        private string LocateJava()
        {
            // 1. Local bundled jre
            string localJre = Path.Combine(appDir, @"jre\bin\java.exe");
            if (File.Exists(localJre)) return localJre;

            // 2. JAVA_HOME
            string javaHome = Environment.GetEnvironmentVariable("JAVA_HOME");
            if (!string.IsNullOrEmpty(javaHome))
            {
                string homeJava = Path.Combine(javaHome, @"bin\java.exe");
                if (File.Exists(homeJava)) return homeJava;
            }

            // 3. Known Program Files locations
            string[] searchPaths = new string[]
            {
                @"C:\Program Files\Java\jdk-27\bin\java.exe",
                @"C:\Program Files\Java\jdk-21\bin\java.exe",
                @"C:\Program Files\Java\latest\bin\java.exe",
                @"C:\Program Files\Common Files\Oracle\Java\javapath\java.exe",
                @"C:\Program Files\Eclipse Adoptium\jdk-21\bin\java.exe"
            };

            foreach (string p in searchPaths)
            {
                if (File.Exists(p)) return p;
            }

            // 4. Fallback search in PATH
            return "java.exe";
        }

        private bool IsPortOpen(string host, int port, int timeoutMs)
        {
            try
            {
                using (TcpClient client = new TcpClient())
                {
                    IAsyncResult result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(timeoutMs);
                    if (!success) return false;
                    client.EndConnect(result);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        private void StopAndExit()
        {
            try
            {
                if (javaProcess != null && !javaProcess.HasExited)
                {
                    javaProcess.Kill();
                }
            }
            catch { }

            string stopScript = Path.Combine(appDir, "stop.bat");
            if (File.Exists(stopScript))
            {
                try
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c \"" + stopScript + "\"",
                        WorkingDirectory = appDir,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    using (Process p = Process.Start(psi))
                    {
                        p.WaitForExit(5000);
                    }
                }
                catch { }
            }

            if (trayIcon != null)
            {
                trayIcon.Visible = false;
                trayIcon.Dispose();
            }

            Application.Exit();
        }
    }
}
