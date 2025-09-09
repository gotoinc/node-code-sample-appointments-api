#!/bin/sh
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/user-avatars || true