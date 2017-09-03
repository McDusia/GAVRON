#!/usr/bin/env python

import asyncio
import datetime
import random
import websockets

#this function returns time
async def time(websocket, path):
    while True:
        now = 'TIME '+ datetime.datetime.utcnow().isoformat()
        await websocket.send(now)
        await asyncio.sleep(random.random() * 5)


def main():
    start_server = websockets.serve(time, '127.0.0.1', 5678)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
