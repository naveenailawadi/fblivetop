from seleniumwire import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time

SLEEP_INCREMENT = 15


class StreamBot:
    def __init__(self, proxy=None):
        # create a webdriver to work with
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--window-size=1420,1080')
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-notifications')

        # add a proxy if available
        prox_options = None
        if proxy:
            my_proxy = f"{proxy['username']}:{proxy['password']}@{proxy['host']}:{proxy['port']}"

            # authenticated
            prox_options = {
                'proxy': {
                    'http': f"http://{my_proxy}",
                    'https': f"https://{my_proxy}",
                    'no_proxy': 'localhost,127.0.0.1,dev_server:8080'
                }
            }

        self.driver = webdriver.Chrome(
            options=options, seleniumwire_options=prox_options)

    # add some functions to login and stream things here
    def login(self, email, password):
        # go to facebook
        self.driver.get('https://www.facebook.com/')
        time.sleep(SLEEP_INCREMENT)

        # put in the keys at the correct box
        username_box = self.driver.find_element_by_xpath(
            '//input[@id="email"]')
        username_box.send_keys(email)

        password_box = self.driver.find_element_by_xpath('//input[@id="pass"]')
        password_box.send_keys(password)
        password_box.send_keys(Keys.ENTER)
        time.sleep(SLEEP_INCREMENT * 2)

    def stream(self, streaming_link, timeout):
        # go to the link
        self.driver.get(streaming_link)
        time.sleep(SLEEP_INCREMENT * 4)

        # handle for new and old facebook sites
        try:
            play_button = self.driver.find_element_by_xpath('//i//div')
        except NoSuchElementException:
            try:
                play_button = self.driver.find_element_by_xpath(
                    '//i[@id="u_1_0"]')
            except NoSuchElementException:
                play_button = None

        if play_button:
            play_button.click()

        # stop streaming on timeout
        start = time.time()
        end = time.time()

        while True:
            time.sleep(10)
            end = time.time()

            if (end - start) > timeout:
                break

        # close the streamer
        self.close()

    def check_proxy(self):
        self.driver.get('https://whatsmyip.com/')

    def close(self):
        self.driver.close()


if __name__ == '__main__':
    proxy = {
        "id": 1,
        "host": "45.94.39.167",
        "port": "8000",
        "email": "79647676281",
        "email_password": "lJzXfbK2Fy",
        "username": "xVtJqa",
        "password": "7UjRvE",
        "active": True,
        "previous_activity_date": "1593642500"
    }
    bot = StreamBot(proxy=proxy)

    bot.login(proxy['email'], proxy['email_password'])

    bot.stream(
        'https://www.facebook.com/PoolsharkGaming/videos/2967066136681357', 30)
