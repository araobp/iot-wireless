echo "Starting api server..."
node ./server/api.js --db=./server/database/log.sqlite3 --static=./html5 &
pid_server=$!

echo "Starting EnOcean gateway..."
node ./gateway/EnOcean/gateway.js &
pid_enocean=$!

echo "Starting BLE gateway..."
sudo python3 ./gateway/BLE/python/gateway.py -i 0 -d BLE1 -s 11223344-5566-7788-9900-aabbccddeeff -r 01020304-0506-0708-0900-0a0b0c0d0e0f -t 01020304-0506-0708-0900-0a0b0c0deeff &
pid_ble=$!

echo "kill -9 $pid_server" > ./stop.sh
echo "kill -9 $pid_enocean" >> ./stop.sh
echo "kill -9 $pid_ble" >> ./stop.sh
chmod +x ./stop.sh
