#!/bin/bash

npm run build

scp -r dist/* root@178.248.73.187:/var/www/penguin
