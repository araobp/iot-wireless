/*
 * app_nfc_uri.c
 *
 *  Created on: 2019/04/26
 */

#include "app_nfc_uri.h"
#include <stdbool.h>
#include <stdio.h>

/**
 * Write URI to NFC tag
 */
void BLE_URI_write_request(char identifier, char *uri) {

  sURI_Info URI;

  switch(identifier) {
    case '3':
      strcpy( URI.protocol, URI_ID_0x03_STRING);
      break;
    case '4':
      strcpy( URI.protocol, URI_ID_0x04_STRING);
      break;
    default:
      break;
  }

  strcpy(URI.URI_Message, uri);
  strcpy(URI.Information, "\0" );

  /* Write NDEF to EEPROM */
  HAL_Delay(5);
  while( NDEF_WriteURI( &URI ) != NDEF_OK );
}

/**
 * Read URI from NFC tag
 */
void BLE_URI_read_request(sURI_Info *pURI) {

  //uint8_t buf[NDEF_MAX_SIZE] = { 0 };

  sRecordInfo_t record;

  //record.NDEF_Type = WELL_KNOWN_ABRIDGED_URI_TYPE;

  NDEF_ReadNDEF(NDEF_Buffer);
  //NDEF_IdentifyNDEF(&record, buf);
  NDEF_IdentifyNDEF(&record, NDEF_Buffer);
  NDEF_ReadURI(&record, pURI);
  //printf("protocol: %s\n", pURI->protocol);
  //printf("URI_Message: %s\n", pURI->URI_Message);
  //printf("Information: %s\n", pURI->Information);
}
