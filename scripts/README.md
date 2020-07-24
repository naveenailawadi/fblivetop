# Standalone Scripts

## configuration
- Requirements: python3, seleniumwire, selenium, time, json
- Run `python3 -m pip install selenium-wire selenium json time` to fulfill
- Use the structure laid out in the sample_config.json to configure with your account information
  - `hidden_browsers` allows toggling between showing and hiding the streamers during operation
  - `default_sleep_spacing` spaces out the time between accounts starting the stream
  - `wait_increment` changes the amount of time the bot uses between actions (login, streaming, etc.)
  - accounts can have custom `sleep_spacing` to allow "humanlike" streams

## main.py
- Running `python3 main.py` launches everything from the attached config file

## FacebookStreamer.py
- This contains the proprietary code with scalable objects
