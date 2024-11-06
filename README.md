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
a textarea is displayed. When REQUEST is pressed, one of the node servers sends
a request to the go server. Go server rensponds, and the reponse is displayed
in the textarea. When STOP is pressed, all containers are stopped.

Nginx acts as a load balancer to the node servers.


To stop the container processes, run
```
docker-compose down
```
in the repository of the compose.yaml file or use the STOP button.
