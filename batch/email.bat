@ECHO OFF

SET GmailAccount="harrison20120512@gmail.com"
SET GmailPassword="kentxy_0123"
SET Attachment=C:\work\git\videodownloader_james\batch\batchemail.mp4

CALL :PowerShell
CD /D "%PowerShellDir%"
Powershell -ExecutionPolicy Bypass -Command "& '%PSScript%' '%GmailAccount%' '%GmailPassword%' '%Attachment%'"
EXIT

:PowerShell
SET PowerShellDir=C:\Windows\System32\WindowsPowerShell\v1.0
SET PSScript=%temp%\~tmpSendeMail.ps1
IF EXIST "%PSScript%" DEL /Q /F "%PSScript%"

ECHO $Username      = $args[0]>> "%PSScript%"
ECHO $EmailPassword = $args[1]>> "%PSScript%"
ECHO $Attachment    = $args[2]>> "%PSScript%"
ECHO                          >> "%PSScript%"
ECHO $Username    = $Username                 >> "%PSScript%"
ECHO $EmailTo     = "workad_009@icloud.com,19135085@qq.com" >> "%PSScript%"
ECHO $EmailFrom   = "noreply@Whatever.notify" >> "%PSScript%"
ECHO $Subject     = "Email Subject"           >> "%PSScript%"
ECHO $Body        = "Email Body"              >> "%PSScript%"
ECHO $SMTPServer  = "smtp.gmail.com"          >> "%PSScript%"
ECHO $SMTPMessage = New-Object System.Net.Mail.MailMessage($EmailFrom, $EmailTo, $Subject, $Body) >> "%PSScript%"
ECHO $Attachment  = New-Object System.Net.Mail.Attachment($Attachment)                            >> "%PSScript%"
ECHO $SMTPMessage.Attachments.Add($Attachment)                                                    >> "%PSScript%"
ECHO $SMTPClient = New-Object Net.Mail.SmtpClient($SmtpServer, 587)                               >> "%PSScript%"
ECHO $SMTPClient.EnableSsl = $true                                                                >> "%PSScript%"
ECHO $SMTPClient.Credentials = New-Object System.Net.NetworkCredential($Username, $EmailPassword) >> "%PSScript%"
ECHO $SMTPClient.Send($SMTPMessage)                                                               >> "%PSScript%"
GOTO :EOF
