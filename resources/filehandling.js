
const ChunkSize = 4096;
const FileServer = "ws://localhost:6768";

// -----------------------------------------------------------------------------

var Uploader = {};

Uploader.reader = new FileReader();

// -----------------------------------------------------------------------------

Uploader.updateProgress = function (size, offset) {
    return Promise.resolve().then(function() {
        // update the DOM
        setTimeout(function() {
            var width = Math.floor(100/size*offset);
            // console.log(width);
            document.getElementById('progressbar').style.width = width + "%";
        }, 0);
    return offset;
  });
}

// -----------------------------------------------------------------------------

Uploader.sendFile = function(file) {
    console.log("File: " + file.name + "size: " + file.size);
    var socket = new WebSocket(FileServer);
    socket.onerror = Uploader.handleError;
    // @todo: open connection and send session key
    var offset = 0;
    var numChunks = Math.floor(file.size / ChunkSize);
    var remainder = file.size % ChunkSize;
    for (var i=0; i<numChunks; i++) {
        var blob = file.slice(offset, offset + ChunkSize);

        Uploader.updateProgress(file.size, offset);
        offset += ChunkSize;
    }
    Uploader.updateProgress(file.size, file.size);
    // @todo: transmit remaining bytes
    console.log("Number of chunks " + numChunks + ", plus remainder of " + remainder);
}

// -----------------------------------------------------------------------------

Uploader.handleFileSelect = function(evt) {
    // @todo: multiple files, extension check(?)
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    Uploader.sendFile(files[0]);
}

// -----------------------------------------------------------------------------

Uploader.handleDragOver = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

// -----------------------------------------------------------------------------

Uploader.handleError = function(error) {
    alert("An error occured: " + error);
}

// -----------------------------------------------------------------------------

Uploader.init = function() {
    var dropzone = document.getElementById('dropzone');
    dropzone.addEventListener('dragover', this.handleDragOver, false);
    dropzone.addEventListener('drop', this.handleFileSelect, false);

    this.reader.onerror = this.handleError;
}
