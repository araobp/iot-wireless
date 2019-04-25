/*
 * rn4020.h
 *
 *  Created on: 2019/04/25
 */

#ifndef RN4020_H_
#define RN4020_H_

#include <stdint.h>
#include "usart.h"

void RN4020_Init(void);
void RN4020_Process(void);
void sendData(uint8_t data);

#endif /* RN4020_H_ */
