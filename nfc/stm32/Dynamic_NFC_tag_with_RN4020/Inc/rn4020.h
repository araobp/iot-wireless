/*
 * rn4020.h
 *
 *  Created on: 2019/04/25
 */

#ifndef RN4020_H_
#define RN4020_H_

#include <stdint.h>
#include "usart.h"

// TX characteristics (NOTIFY)
#define NOTIFY_CHARA "SUW,010203040506070809000A0B0C0D0E0F,"

void RN4020_Init(void);
void RN4020_Process(void);

#endif /* RN4020_H_ */
