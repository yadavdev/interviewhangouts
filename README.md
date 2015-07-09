#InterviewHangouts 0.2.0

**Interviewhangouts is a web application for helping in taking remote technical/non-technical interviews and presentations.**
### [Go to Website](http://interviewhangouts.herokuapp.com/ "InterviewHangouts")

> Project By: [Devashish Kumar Yadav](https://www.linkedin.com/in/devashishyadav) (devyadav_at_iitk.ac.in)

> The project was completed during my summer internship in [Voxapp Pvt. Ltd.](Voxapp.com)

> The project was funded by [Voxapp Pvt. Ltd.](Voxapp.com)

> Mentors: [Ritesh Kadmawala](https://www.linkedin.com/in/riteshkadmawala), [Madhu Sudhan](https://www.linkedin.com/in/madhusudhanav)

**Features:**
* Link based private rooms with multiple users.
* Support for custom room links.
* Collaborative text editor with support for syntax highlighting in different languages.
* Text chat with user typing status.
* One click peer to peer audio-video Chat with out need of any plugin or flash. All possible due to [webRTC](http://webrtc.org)
* Code editing and testing in many languages with support for stdin/terminal input.
* Share and open and give live present powerpoint presentations from Google Docs and Slideshare during a audio-video call.
* Automatic server reconnect in case of connection loss.


**Technologies and frameworks:**

* Backend:
  * Node.js
  * Express framework
  * Socket.io
  * PeerJs server
  * unirest
It is a simple node.js application using the Express framework. It uses [Scoket.io](http://socket.io) for realtime communications. For making server side  http requests easy it uses the unirest module. For signalling server for the webrtc a custom [PeerJs](http://peerjs.com) server is intergrated along with the app.

* Frontend:
  * Jquery 
  * Twitter Bootstrap framework
  * CodeMirror javascript editor
  * Socket.io client library
  * PeerJs client library
Layout is designed using Bootstrap and jquery with different plugins. Socket.io is used to communicate with the server.
CodeMirror api for a javascript text editor for the code editor with syntax highlighting.

* Technologies
  * [HackerRank](http://hackerrank.com) api: Hackerrank provides a free api_key for now for code testing purposes. The apikey has beeen removed from the source code on github. 
  * [WebRTC](http://webrtc.org):  WebRTC is a open source project aiming to enable the web with Real Time Communication (RTC) capabilities.

##License:
All content of this project is licensed for use under the MIT license.
All registered trademarks belong to their respective owners.
