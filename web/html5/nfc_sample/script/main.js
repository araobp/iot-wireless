let cnt = 0;

if (navigator.nfc) {
	console.log('NFC supported');
 } else {
	console.log('NFC unsupported');
}


if (window.isSecureContext) {
	console.log('Secure context');
} else {
	console.log('Unsecure context');
}

if (navigator.nfc) {
	navigator.nfc.watch(message => {
    messageHandler(message);
	},
  {mode: "any"})
  .then(() => {
    console.log('Ready to read NFC tag...');
    pushRecord("Ready to read NFC tag...", "text");
  });

}

function messageHandler(message) {
  message.records.forEach(record => {
    console.log(record);
    if (record.recordType == "url") {
      writeUrl(record.data.split('?')[0] + "?" + "cnt=" + String(cnt++));
    }
  });
}

function writeUrl(url) {
  if (navigator.nfc) {
    let message = {
      records: [
        {
          recordType: "url",
          data: url
        }
      ]
    }

    navigator.nfc.push(message,
      {target: "tag", ignoreRead: true}
    ).then(() => {
      console.log('url "' + url + '" written');
    });
  }
}

function pushRecord(data, type) {
  if (navigator.nfc) {
    let message = {
      records: [
        {
          recordType: type,
          data: data
        }
      ]
    }

    navigator.nfc.push(message,
      {target: "tag", ignoreRead: true}
    ).then(() => {
      console.log('data "' + data + '" written');
    });
  }
}
