# Standalone Scripts

## configuration
- Requirements: python3, seleniumwire, selenium, time, json
- Run `python3 -m pip install selenium-wire selenium json time` to fulfill
- Use the structure laid out in the sample_config.json to configure with your account information
  - `hidden_browsers` allows toggling between showing and hiding the streamers during operation
  - `default_sleep_spacing` spaces out the time between accounts starting the stream
  - `wait_increment` changes the amount of time the bot uses between actions (login, streaming, etc.)
  - accounts can have custom `sleep_spacing` to allow "humanlike" streams

## stream.py
- Running `python3 stream.py` launches everything from the attached config file to stream a video

## FacebookStreamer.py
- This contains the proprietary code with scalable objects

## Contact
- Contact the development team via https://entredeveloperslab.com/contact
- Software warranties are included for 30 days
    - This can be extended by request with a negotiated retainer
