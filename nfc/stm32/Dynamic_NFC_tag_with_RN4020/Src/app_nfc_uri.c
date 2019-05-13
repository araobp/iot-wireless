/*
 * app_nfc_uri.c
 *
 *  Created on: 2019/04/26
 */

#include "app_nfc_uri.h"
#include "lib_NDEF_URI.h"
#include <stdbool.h>

void uri_modify_request_handler(char *data) {

  static char uri[256];
  static int cnt = 0;
  static int i = 0;
  static char type;

  static bool receiving = false;

  static sURI_Info URI;

  if (!receiving) {
    type = data[0];
    switch(type) {
      case '3':
        strcpy( URI.protocol,URI_ID_0x03_STRING);
        break;
      case '4':
        strcpy( URI.protocol,URI_ID_0x04_STRING);
        break;
      default:
        break;
    }
    cnt= 2;
    receiving = true;
  }

  while (cnt <= 19 && receiving) {
    uri[i] = data[cnt];
    if (uri[i] == '\n') {
      receiving = false;
      uri[i] = '\0';
      i = 0;
      strcpy( URI.URI_Message, uri);
      strcpy( URI.Information,"\0" );

      /* Write NDEF to EEPROM */
      HAL_Delay(5);
      while( NDEF_WriteURI( &URI ) != NDEF_OK );
    } else {
      cnt++;
      i++;
    }
  }
  cnt = 0;
}

