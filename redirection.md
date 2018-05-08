# Client Redirection

## Introduction
When a client attempts to connect to a game server it first requests for the address of one specific Game server to the HTTP server. The HTTP server is then not only responsible for handling game resources and Web-related tasks but to redirect the user connection to a specific game instance.

## HTTP Server and Game Server

Since both servers reside in the same system, communication between servers is setup when Game Servers are forked from the HTTP server via the system's IPC mechanisms. So how is the mechanism for choosing which server to send a connection to?

## Game Server Priority

Every Game Server has a Priority that follows a deterministic state associated with a value. Value in this case is the number of players currently connected/playing on that instance of the game server. The priorities are as follow:

| Priority  | Number of Players  | Range |
| :---------| :-----------------:|:-----:|
| High      | Low                | [a, b[|
| Medium    | Medium             | [b, c[|
| Low       | High               | [c, d[|
| None      | Maximum            | d     |

The HTTP server maintains a list of Game servers and forks when necessary, to a certain extent. It then issues incoming client connections to game servers based on their priority.

Game servers are responsible about the number of connections they hold, updating their priority to the HTTP server as connections come and go.

This design insures that game servers are responsible for game logic and HTTP servers are responsible for redirection, basically serving as a Content Delivery Server and Proxy between Game Servers and Clients.

# Avoiding dead servers and finicky behaviour

This solution works only when there is already an imbalance of priority in servers.

Imagine starting with 5 empty servers. First all of them must go from low to medium and medium to high, etc. This causes balanced population but it's not the objective. In order for the game to achieve a good population it should stay in the medium-high priority.

The trick is to start with a low amount of servers and create new ones (up to the specified limit) as demand increases thus ensuring a game server with good population before directing users to a new instance.

If a instance is similarly stuck between transition points in states it shouldn't _immediatly_ go back to previous or next state. I.e: given the threshold for going from low to medium priority is 200 players. If the server has 199 players it shouldn't transition to medium priority when a new player connects. If a *delta* is applied before the Server sends it's new status a significant margin is applied so as to not cause a transition-happy interface. Aka 200+delta players is achieved before the game server sets it's priority to Medium