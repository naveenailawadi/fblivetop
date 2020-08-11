# Standalone Scripts

## configuration
- Requirements: python3, seleniumwire, selenium, time, json
- Run `python3 -m pip install selenium-wire selenium json time` to fulfill
- Use the structure laid out in the sample_config.json to configure with your account information
  - `hidden_browsers` allows toggling between showing and hiding the streamers during operation
  - `wait_increment` changes the amount of time the bot uses between actions (login, streaming, etc.)
  - Accounts can have custom `sleep_spacing` to allow "humanlike" actions
  - `default_sleep_spacing` spaces out the time between accounts starting the entire process
  - Liking and commenting configuration
    - `like_default` sets whether or not a post should be liked by default
    - `comment_default` sets a comment to use as default
        - setting to `""` will cause the script to skip commenting altogether (by default)
    - The `like` attribute within the account allows the accuont to be toggled to act differently from the default
    - The `comment` attribute allows you to set a custom comment
        - setting to `""` will cause the script to skip commenting altogether for that particular account

## Streaming
- Running `python3 stream.py` launches everything from the attached config file to stream a video

## Liking and Commenting
- Running `python3 like_and_comment.py` will like and comment the inputted post

## FacebookStreamer.py
- This contains the proprietary code with scalable objects (for all functions)

## Contact
- Contact the development team via https://entredeveloperslab.com/contact
- Software warranties are included for 30 days
    - This can be extended by request with a negotiated retainer
