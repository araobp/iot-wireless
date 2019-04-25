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

#define BUFSIZE 64U

uint8_t uart_rx_data;
uint8_t data_buf[BUFSIZE/2];
volatile bool command_received = false;
int data_len;
uint8_t cnt = 0;

char send_buf[100];

/**
 * Initialize interface to RN4020
 */
void RN4020_Init(void) {
  HAL_UART_Receive_IT(&huart1, &uart_rx_data, 1);
}

/**
 * Receive data from a BLE centra via RN4020 module.
 *
 * Note: the maximum length is 20 bytes.
 */
static void receiveData(uint8_t *data, int len) {
  // Note: the following is only for a debugging purpose.
  data[len] = '\0';
  printf("%s\n", data);
}

/**
 * Send byte array (max. 20 bytes) to a BLE central via RN4020 module
 */
void sendData(uint8_t *data, int len) {
  char ascii_hex_buf[2];

  strcpy(send_buf, NOTIFY_COMMAND);
  for (int i = 0; i < len; i++) {
    sprintf(ascii_hex_buf, "%02x", data[i]);
    send_buf[37+i*2] = ascii_hex_buf[0];
    send_buf[37+i*2+1] = ascii_hex_buf[1];
  }
  send_buf[37+len*2] = '\n';

  HAL_UART_Transmit(&huart1, (uint8_t *)send_buf, 37+len*2+1, 0xffff);
}

/**
 * Include this process in the infinite loop of main.c.
 */
void RN4020_Process(void) {
  uint8_t data[20] = { 0 };
  if (command_received) {
    /* ADD CODE HERE START */
    receiveData(data_buf, data_len);
    data[0] = cnt++;
    sendData(data, 1);
    /* ADD CODE HERE END */
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
  HAL_UART_Receive_IT(&huart1, &uart_rx_data, 1);
}
