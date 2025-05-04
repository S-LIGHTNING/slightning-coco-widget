(function () {
    const NET_LOCATION = "localhost:8080"
    const FILE_NAME = "FILE_NAME"
    const connection = new WebSocket(`ws:/${NET_LOCATION}//ws`)
    connection.onmessage = () => {
        let originalShowOpenFilePicker = window.showOpenFilePicker
        window.showOpenFilePicker = () => {
            console.log(666)
            return originalShowOpenFilePicker.apply(this, arguments)
        }
    }
})()
