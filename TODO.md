# Server
### 'To-do List

## Functionality
- Server has a X Tick-rate.
- Server sends the periodical functions of each planets' orbit to the client along with the counter `t` to be calculated on the client side
- Server syncs up the players positions according to the tick rate
- Detecting and dealing with colisions
## Optimization

Bullet Collision Detection Choices:
1. Use a binary tree for the entire session with O(log(n)) complexity
2. Split map area into small sized chunks for faster calculations
3. Create chunks around player coordinates and access collisions from there

