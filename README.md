# What is it?

Lightmirror is an HTML document that displays Oura fitness tracker data, plus sci-fi animation and sound. It’s designed to be used fullscreen behind a one-way mirror, so that the user can passively read health data while getting ready in the morning. It does not pull directly from the Oura API. It accepts JSON which conforms to the Oura spec. Getting that JSON is your responsibility.

![Example image](example.jpg)

[Example video](example.mp4)

# How do I install it?

You’ll need a simple HTTP server for the HTML document to work properly. (For example, nav to the directory containing index.html and do `python3 -m http.server 8000`, then in your browser nav to `localhost:8000`.)
