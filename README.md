NB: ChatGPT was used in creation of the web servers in the respository.
See llm.txt for more information.

# How to run:

Assumptions:
* Docker compose is installed on the host (tested with v. 2.29.6)
* Docker is installed on the host (tested with v. 24.0.7, build 24.0.7-0ubuntu2~22.04.1)
* Preferably `curl` can be used on the host.

Clone repository onto host. Run

```
docker-compose up --build -d
```

or equivalent command in the same repository as where the compose.yaml file is.
It creates two docker containers. One runs a node server and another one a golang server.

Now, when a HTTP request is made to localhost:8199, the node server should respond with
plaintext information about what its IP address is, the processes it can see (`ps aux`), the available
disk space it can see (`df`), and time since last reboot (`uptime -p`). Behind the scenes,
it makes a request to the golang server, which gives it the same information, and the node
server returns the combained information as a response to the HTTP request. The golang server
should not be reachable by other means than by the node container as a proxy.

If `curl` is available, run
```
curl localhost:8199
```
on the host computer to see the response.

To stop the container processes, run
```
docker-compose down
```
in the repository of the compose.yaml file.
