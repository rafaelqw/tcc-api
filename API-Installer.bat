cd C:\POSI\KDS\posi-digitalprinter-api

cd node_modules\.bin

del /f node-pre-gryp*

cd C:\POSI\KDS\posi-digitalprinter-api

MKlink "C:\Users\%username%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\API-Starter.exe" ".\API-Starter.bat"
npm install node-pre-gryp express sqlite3 node-schedule forever forever-monitor
