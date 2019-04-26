/*
 * app_nfc_uri.c
 *
 *  Created on: 2019/04/26
 */

#include "app_nfc_uri.h"
#include "lib_NDEF_URI.h"

void uri_modify_request_handler(char *uri) {
  sURI_Info URI;
  strcpy( URI.protocol,URI_ID_0x02_STRING );  // "https://www.\0"
  strcpy( URI.URI_Message, uri);
  strcpy( URI.Information,"\0" );

  /* Write NDEF to EEPROM */
  HAL_Delay(5);
  while( NDEF_WriteURI( &URI ) != NDEF_OK );
}

