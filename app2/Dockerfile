FROM golang:1.23.1
WORKDIR /app
COPY go.mod go.mod
RUN go mod download
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /go-server
CMD [ "/go-server" ]

