/*
 * app_nfc_uri.h
 *
 *  Created on: 2019/04/26
 */

#ifndef APP_NFC_URI_H_
#define APP_NFC_URI_H_

#include <stdint.h>
#include "lib_NDEF.h"
#include "lib_NDEF_URI.h"

void BLE_URI_write_request(char identifier, char *uri);
void BLE_URI_read_request(sURI_Info *pURI);

#endif /* APP_NFC_URI_H_ */
