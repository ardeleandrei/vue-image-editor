# vue-image-editor
Image Editor with Vue.js & HTML5 Canvas

Live at https://ardy.ro/editor

- resize image
- adjust colors
- add CSS filters
- crop
- text overlay
- convert to PNG or JPG & download

This is intended to be a lightweight image editor that does all the manipulations on the client's browser, using own resources.
There is still room for improvement permormance-wise, possibly by implementing web workers or other multi-threading methods.
Image data is held in memory as a Blob object.

Advantages over server-processed images: 
- privacy -> image data does not leave the user's computer at any point in the editing process
- speed -> after the intial page load, the processing time does not depend on the speed of the network but only on on the resources available and size of the loaded image
- compatibility -> the app is based on HTML5, so the user is not required to install extra plugins

Feel free to contribute with your ideas.
