NB: ChatGPT was used in creation of the web servers in the respository.
See llm.txt for more information.

# How to run:

Assumptions:
* Docker compose is installed on the host (tested with v. 2.29.6)
* Docker is installed on the host (tested with v. 24.0.7, build 24.0.7-0ubuntu2~22.04.1)

Clone repository onto host. Run

```
docker-compose up --build -d
```

or equivalent command in the same repository as where the compose.yaml file is.
It creates five docker containers. Three instances of node servers, one go server,
and nginx.

When visiting localhost:8198 on a browser, login info is asked. You can find login
info from login.txt. When login info is entered correctly, two buttons and
a textarea is displayed. When REQUEST is pressed, a request is sent to one of the
node servers. It sends a request to the Go server, which replies with info about it,
and the node server combines that info with info about itself and returns
the combined info. The response is displayed in the textarea.

Each node server waits 2 seconds before it responds to the next request.
This is simulated by conditional waiting at the start of the request handler.

When STOP is pressed, all containers are stopped.

Nginx acts as a load balancer to the node servers.


To stop the container processes, run
```
docker-compose down
```
in the repository of the compose.yaml file or use the STOP button.
