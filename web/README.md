## express.js over HTTPS

The web server must run over HTTPS to support webnfc.

Refer to the following link to run express.js over HTTPS:
https://timonweb.com/posts/running-expressjs-server-over-https/

## Dynamic NFC tag and webnfc

### Why it is so intereseting

- webnfc enables us to communicate MCU over NFC without installing any app on Android.
- MCU can remote controll Chrome on an Android smartphone via NFC.

```

     [MCU]<--i2C-->[ST25]<--NFC-->[webnfc/Chrome/Android]

```

