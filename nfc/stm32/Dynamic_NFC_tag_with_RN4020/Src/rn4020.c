/*
 * rn4020.c
 *
 *  Created on: 2019/04/25
 */

#include "rn4020.h"
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

#include "app_nfc_uri.h"

#define BUFSIZE 64U

uint8_t uart_rx_data;
uint8_t data_buf[BUFSIZE/2];
volatile bool command_received = false;
volatile int data_len;
uint8_t cnt = 0;

char send_buf[100];

typedef enum {
  CNT_CHARA, URI_CHARA
} tx_chara;

/**
 * Initialize interface to RN4020
 */
void RN4020_Init(void) {
  HAL_UART_Receive_IT(&huart6, &uart_rx_data, 1);
}

/**
 * Transfer byte array to a BLE central via RN4020 module.
 *
 * Note: binary data (uint8_t) is converted into hex in ASCII,
 * because RN4020 accepts binary data in ASCII mode.
 *
 */
void tx(uint8_t *data, int len) {

  int i = 0;
  int idx = 0;
  char ascii_hex_buf[2];

  // TX characteristics
  strcpy(send_buf, NOTIFY_CHARA);

  while (true) {
    sprintf(ascii_hex_buf, "%02x", data[idx]);
    send_buf[37+i*2] = ascii_hex_buf[0];
    send_buf[37+i*2+1] = ascii_hex_buf[1];
    i++;
    idx++;
    if (i == 20) {  // The length of 20 bytes
      send_buf[37 + i*2] = '\n';
      HAL_UART_Transmit(&huart6, (uint8_t *)send_buf, 37+i*2+1, 0xffff);
      // For debug
      send_buf[37 + i*2] = '\0';
      printf("sendData(@20): %s\n", send_buf);
      // NOTIFY interval
      HAL_Delay(500);
      i = 0;
    } else if (idx >= len) {  // The length of data
      send_buf[37 + i*2] = '\n';
      HAL_UART_Transmit(&huart6, (uint8_t *)send_buf, 37+i*2+1, 0xffff);
      // For debug
      send_buf[37 + i*2] = '\0';
      printf("sendData(@len): %s\n", send_buf);
      break;
    }
  }
}

/**
 * Receive byte array from a BLE central via RN4020 module.
 *
 * Note: RN4020 send binary data to this MCU in ASCII mode.
 *
 */
void rx(void) {

  sURI_Info URI;
  uint8_t response[128];

  int i = 0;
  static int idx = 0;
  uint8_t c;

  static bool receiving = false;
  static char uri[256];
  char identifier = '0';

  // Note: the following is only for a debugging purpose.
  data_buf[data_len] = '\0';
  printf("%s\n", data_buf);

  if (!receiving && data_buf[0] == '0') {  // Read request

    i = 0;
    idx = 0;

    // Read URI from NFC tag
    BLE_URI_read_request(&URI);

    // Create a response message (BLE NOTIFY)
    response[idx++] = 'R';  // Response to read request
    response[idx++] = ',';

    while (true) {
      c = URI.protocol[i++];
      if (c == '\0') {
        break;
      } else {
        response[idx++] = (uint8_t)c;
      }
    }

    i = 0;
    while (true) {
      c = URI.URI_Message[i++];
      if (c == '\0') {
        break;
      } else {
        response[idx++] = (uint8_t)c;
      }
    }

    tx(response, idx);
    // For debug
    response[idx] = '\0';
    printf("%s\n", response);

  } else {  // Write request

    if (!receiving) {
      identifier = data_buf[0];
      idx = 0;
      i = 2;
      receiving = true;
    } else {
      i = 0;
    }

    if (receiving) {
      while (i <= 19) {  // the received message has been split into 20bytes chunks
        if (data_buf[i] == '\n' || data_buf[i] == '\\') {
          uri[idx] = '\0';
          BLE_URI_write_request(identifier, uri);
          receiving = false;

          response[0] = 'W';  // Response to write request
          response[1] = ',';
          sprintf((char *) &response[2], "%d", cnt);  // Just return the count
          if (cnt < 10) tx(response, 3);
          else if (cnt < 100) tx(response, 4);
          else tx(response, 5);
          cnt++;
          break;

        } else {
          uri[idx++] = data_buf[i++];
        }
      }
    }
  }

}

/**
 * Include this process in the infinite loop of main.c.
 */
void RN4020_Process(void) {

  if (command_received) {
    rx();
    command_received = false;
  }
}

/**
 * Receive data from RN4020 via usart1.
 */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *UartHandle) {
  static int idx = 0;
  static uint8_t uart_rx_buf[BUFSIZE];
  char ascii_hex_buf[3];
  if (!command_received) {
    if (uart_rx_data == '\n') {
      uart_rx_buf[idx] = '\0';
      //printf("uart_rx_buf: %s\n", uart_rx_buf);
      // Receive NOTIFY in the form of "WV,XXXX,DDDD." from RN4020.
      if (uart_rx_buf[0] == 'W' && uart_rx_buf[1] == 'V' && uart_rx_buf[2] == ',') {
        data_len = idx - 10;
        // Convert ASCII HEX (XX) to uint8_t
        for (int i = 0; i < data_len / 2; i++) {
          ascii_hex_buf[0] = uart_rx_buf[8+i*2];
          ascii_hex_buf[1] = uart_rx_buf[8+i*2+1];
          ascii_hex_buf[2] = '\0';
          data_buf[i] = (uint8_t)strtol(ascii_hex_buf, NULL, 16);
        }
        data_len = data_len/2;
        command_received = true;
      }
      idx = 0;
    } else {
      uart_rx_buf[idx++] = uart_rx_data;
    }
    if (idx >= BUFSIZE) idx = 0;
  }
  HAL_UART_Receive_IT(&huart6, &uart_rx_data, 1);
}
