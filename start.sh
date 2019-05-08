# Router start-up script

echo "Starting api server..."
node ./router/api.js --db=./router/database/log.sqlite3 --static=./router/html5 &
echo "kill -9 $!" > ./stop.sh
chmod +x ./stop.sh

echo "Starting BLE gateway..."
#sudo python3 ./gateway/BLE/python/gateway.py -i 0 -d BLE1 -s 11223344-5566-7788-9900-aabbccddeeff -r 01020304-0506-0708-0900-0a0b0c0d0e0f -t 01020304-0506-0708-0900-0a0b0c0deeff &
sudo python3 ./gateway/BLE/python/gateway.py -i 0 -d BLE2 -s 11223344-5566-7788-9900-aabbccddeeff -r 01020304-0506-0708-0900-0a0b0c0d0e0f -t 01020304-0506-0708-0900-0a0b0c0deeff &
sleep 1
child_pid=$(ps --ppid $! -o pid=)
echo "sudo kill -9 $!" >> ./stop.sh
echo "sudo kill -9 $child_pid" >> ./stop.sh

echo "Starting EnOcean gateway..."
node ./gateway/EnOcean/node/gateway.js --port=/dev/serial/by-id/usb-EnOcean_GmbH_EnOcean_USB_400J_DA_FTXHAW8W-if00-port0 &
echo "kill -9 $!" >> ./stop.sh

#echo "Starting TWELITE gateway..."
#python3 ./gateway/TWELITE/python/gateway.py --type int8_t 3 /dev/serial/by-id/usb-MONOWIRELESS_MONOSTICK_MW2MRZJP-if00-port0 &
#echo "kill -9 $!" >> ./stop.sh


echo "Starting local web server..."
sudo node ./web/web.js --static=./web/html5 &
sleep 1
child_pid=$(ps --ppid $! -o pid=)
echo "sudo kill -9 $!" >> ./stop.sh
echo "sudo kill -9 $child_pid" >> ./stop.sh

