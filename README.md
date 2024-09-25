# LIMP
**LInear Motion Pattern Identification and Translation**

A node.js App dedicated towards translating the inputs of a v2 buttplug client to pre defined patterns.


**The issue:**
Some sex toys can be controlled over bluetooth, but they have predefined patterns.
Interactive pornography doesn't trigger these patterns.

**The solution:**
Create a pretend server to get the speed events, ANALyse the input, Pick patterns according to the ANALysis.

**The Implementation:**

***server.js*** module pretends to be a V2 server to get Vibration speed.

***variation.js*** determines how varied the input pattern is, with more or less success.

***IntensityTracker.js*** Determines intensity based on adding the change between two inputs into a running average.(the current algo is 

***RUN.js*** runs the "decision tree" I documented the patterns using a camera, determined intensity, variety and other aspects within an 8ms or so margin of error.
There are features like holding a pattern, interupting it etc.

***server/server/server.js*** runs client emulation, i couldn't figure out how to use the library, so I threw together a module that pretends to be a Buttplug V3 client.

![DESCRIPTION](https://github.com/user-attachments/assets/67eeb93c-3ebf-4660-9197-ee362c6443a9)

**Configuration:**
***server.js*** includes the pretend server ip and port. By default it is localhost:8080

***RUN.js*** includes the targeted Intiface IP(localhost:12345 by default) 
It also includes window size for the Algorithms

**Dependency:**
You need *Node.js*
You run "node npm i websocket express" in the folder to download the dependencies.

**Running:**
Execute "node RUN.js" in the folder with a Terminal(like CMD)
Connect your client(like script player) to the ip set in server.js 
And your server(Intiface®) to the IP set in RUN.js


**Issues:**
Expect them, there's some hacky stuff, like me fixing an issue with the pretend client by making it wait for the server to send a message that includes "Moonhorn"
The Intensity and Variaty algos are incredibly simple, they don't even consider time
It's currently only build around the Moonhorn. But adapting it to your own needs should be doable, it is porposefully modular.


