package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os/exec"
	"os"
	"strings"
)

// Get IP address of the server
func getIPAddress() (string, error) {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "", err
	}

	for _, addr := range addrs {
		if ipNet, ok := addr.(*net.IPNet); ok && !ipNet.IP.IsLoopback() && ipNet.IP.To4() != nil {
			return ipNet.IP.String(), nil
		}
	}
	return "IP address not found", nil
}

// Get system uptime
func getUptime() (string, error) {
	out, err := exec.Command("uptime", "-p").Output()
	if err != nil {
		return "", err
	}
	return string(out), nil
}

// Get output of `ps aux` command
func getProcesses() (string, error) {
	out, err := exec.Command("ps", "aux").Output()
	if err != nil {
		return "", err
	}
	return string(out), nil
}

// Get output of `df -h` command
func getDiskUsage() (string, error) {
	out, err := exec.Command("df").Output()
	if err != nil {
		return "", err
	}
	return string(out), nil
}

func stopAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

	// List of container names
	containers := []string{"nginx", "service_1_1", "service_1_2", "service_1_3", "service_2"}

	fmt.Fprintf(w, "Goodbye\n")

	// Loop through each container name and stop it
	for _, container := range containers {
		fmt.Printf("Stopping container "+container)
		_, err := exec.Command("curl", "--unix-socket", "/var/run/docker.sock", "-X", "POST", fmt.Sprintf("http://localhost/containers/%s/stop", container)).Output()
		if err != nil {
			fmt.Printf("Error stopping container: "+err.Error())
			http.Error(w, "Error stopping container: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
	fmt.Fprintf(w, "Done")
}

func getInfo(w http.ResponseWriter, r *http.Request) {
	// Get IP address
	ipAddress, err := getIPAddress()
	if err != nil {
		http.Error(w, "Error getting IP address: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Get uptime
	uptime, err := getUptime()
	if err != nil {
		http.Error(w, "Error getting uptime: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Get processes
	processes, err := getProcesses()
	if err != nil {
		http.Error(w, "Error getting processes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Get disk usage
	diskUsage, err := getDiskUsage()
	if err != nil {
		http.Error(w, "Error getting disk usage: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Send the combined response
	fmt.Fprintf(w, "Server IP Address: %s\n", ipAddress)
	fmt.Fprintf(w, "System Uptime: %s\n", strings.TrimSpace(uptime))
	fmt.Fprintf(w, "\nProcesses (ps aux):\n%s\n", processes)
	fmt.Fprintf(w, "\nDisk Usage (df):\n%s\n", diskUsage)
}

func main() {
	http.HandleFunc("/info", getInfo)
	http.HandleFunc("/stop-all", stopAll)

	port := os.Getenv("PORT")
	fmt.Printf("Server is running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
