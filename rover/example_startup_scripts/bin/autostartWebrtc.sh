#!/bin/bash

export DISPLAY=:0.0
export LOGFILE=/home/attrac/autostartWebrtc.log

cd /pubfiles/github/kanamoto/railcam/rover

while true
do
        echo >>$LOGFILE
        echo "----------------------------------------------" >> $LOGFILE
        date >> $LOGFILE

        echo "Starting webrtc..." >> $LOGFILE

		python3  webrtc_sendrecv.py --server wss://at-drive.com:8443/ railcam002 &>>$LOGFILE

        echo "program seems to have stopped" >> $LOGFILE

        date >> $LOGFILE
        sleep 1

done

