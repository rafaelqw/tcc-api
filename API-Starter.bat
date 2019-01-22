cd C:\posi\KDS\posi-digitalprinter-api
forever start -l C:/POSI/KDS/posi-digitalprinter-api/logs/output.log -a bin/www
tail -f logs/output.log