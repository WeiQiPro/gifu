This is a work in progress.

The goal is to have a private library of opening board positions up to the number of moves the users wish.
The official product will have library of 4 million sorted games and opening positions up to move 50.
This will be available through API, while allowing users to handle their own library separately.

Archived is a proof of concept that worked well, along with sorting, adding and fixing certian sgfs.

current structure as follows:

Src/
|__> GifuEngine
|__> Components/
|_____> SGFAdapter
|_____> BoardStateHashingEngine
|_____> GobanEngine
|_____> FileHandler

Server/
|__> BackendEngine: Adpater of GifuEngine
|__> DatabaseAPI
|__> WebSocketServer

Client/
|__> FrontendEnginge: Adapter of GifuEngine
|__> WebSocketClient

Web/
-- WIP

SGF/ holds all the private games


Thanks,
Jeremiah Donley
