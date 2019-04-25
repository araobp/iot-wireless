/*
 * rn4020.c
 *
 *  Created on: 2019/04/25
 */

#include "rn4020.h"
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define BUFSIZE 64U

uint8_t uart_rx_data;
uint8_t data_buf[BUFSIZE/2];
volatile bool command_received;
int data_len;
uint8_t cnt = 0;

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
 * Send one-byte data to a BLE central via RN4020 module
 */
void sendData(uint8_t data) {
  char send_buf[40];
  sprintf(send_buf, "SUW,010203040506070809000A0B0C0D0E0F,%02x\n", data);
  HAL_UART_Transmit(&huart1, (uint8_t *)send_buf, 40, 0xffff);
}

/**
 * Include this process in the infinite loop of main.c.
 */
void RN4020_Process(void) {
  if (command_received) {
    receiveData(data_buf, data_len);
    sendData(cnt++);
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
      // Receive NOTIFY in the form of "WV,XXXX,DDDD." from RN4020.
      if (uart_rx_buf[0] == 'W' && uart_rx_buf[1] == 'V' && uart_rx_buf[2] == ',') {
        data_len = idx - 10;
        // Convert ASCII HEX (XX) to uint8_t
        for (int i = 0; i < data_len / 2; i++) {
          ascii_hex_buf[0] = uart_rx_buf[8+i*2];
          ascii_hex_buf[1] = uart_rx_buf[8+i*2+1];
          ascii_hex_buf[2] = '\0';
          data_buf[i] = (uint8_t)strtol(ascii_hex_buf, NULL, 16);
          command_received = true;
        }
        data_len = data_len/2;
      }
      idx = 0;
    } else {
      uart_rx_buf[idx++] = uart_rx_data;
    }
    if (idx >= BUFSIZE) idx = 0;
  }
  HAL_UART_Receive_IT(&huart1, &uart_rx_data, 1);
}
