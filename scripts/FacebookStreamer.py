from seleniumwire import webdriver
from selenium.common.exceptions import NoSuchElementException, ElementNotInteractableException, TimeoutException, ElementClickInterceptedException
from selenium.webdriver.common.keys import Keys
import time

WAIT_INCREMENT = 10


class StreamBot:
    def __init__(self, proxy=None, headless=True, wait_increment=WAIT_INCREMENT, id=None):
        # set the sleep increment
        self.wait_increment = wait_increment

        # associate it with a streamer
        self.id = id

        # create a webdriver to work with
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--window-size=1420,1080')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-notifications')
        options.add_argument('--dns-prefetch-disable')

        if headless:
            options.add_argument('--headless')

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

    # add some functions to login and stream things here (returns boolean on availability)
    def login(self, email, password):
        # go to facebook
        try:
            self.driver.get('https://www.facebook.com/')
        except TimeoutException:
            print(f"Timed out on login with streamer id {self.id}")
            self.quit()
            return False
        time.sleep(self.wait_increment)

        # put in the keys at the correct box
        username_box = self.driver.find_element_by_xpath(
            '//input[@id="email"]')
        username_box.send_keys(email)

        password_box = self.driver.find_element_by_xpath('//input[@id="pass"]')
        password_box.send_keys(password)
        password_box.send_keys(Keys.ENTER)
        time.sleep(self.wait_increment * 2)

        # check if there is a search bar (indicates that the streamer is good)
        active = True
        try:
            _ = self.driver.find_element_by_xpath(
                '//input[@type="search"]')
        except NoSuchElementException:
            active = False

        # check for the other type of account
        try:
            _ = self.driver.find_element_by_xpath('//div[@role="search"]')
            active = True
        except NoSuchElementException:
            pass

        # quit if inactive
        if not active:
            self.quit()

        return active

    def stream(self, streaming_link, timeout):
        # click the me button to redirect from security
        try:
            me_button = self.driver.find_element_by_xpath(
                '//a[@title="Profil"]')
            me_button.click()
        except NoSuchElementException:
            pass

        time.sleep(self.wait_increment)

        # change the facebook UI
        try:
            dropdown = self.driver.find_element_by_xpath(
                '//a[@aria-labelledby="userNavigationLabel"]')
            dropdown.click()
            switch = self.driver.find_elements_by_xpath(
                '//a[@role="menuitem"]')[-1]
            switch.click()
            print(f"Switched streamer {self.id} to new UI")
            time.sleep(self.wait_increment)
        except NoSuchElementException:
            # try to find something unique to the new fb ui
            _ = self.driver.find_element_by_xpath(
                '//a[@aria-label="Facebook"]')

            print(f"Already using new fb UI with streamer {self.id}")

        # go to the link
        count = 1
        while True:
            try:
                self.driver.get(streaming_link)
                break
            except TimeoutException:
                print(
                    f"Timed out on stream with streamer id {self.id} ({count})")

            # break on the third try
            if count >= 3:
                break

            count += 1

        # hardcode this sleep for choice of client
        time.sleep(60)

        # send a few enters to the page to get rid of any particular messages
        page = self.driver.find_element_by_xpath('//body')
        for i in range(3):
            page.send_keys(Keys.ENTER)
            time.sleep(0.5)

        # play not necessary with new UI
        # self.click_play(streaming_link)

        # stop streaming on timeout
        print(f"Will close streamer {self.id} in {timeout} seconds")
        time.sleep(timeout)

        # close the streamer
        self.quit()

        print(f"Closed streamer {self.id}")

    def click_play(self, streaming_link):
        try:
            play_button = self.driver.find_element_by_xpath(
                '//img[@src="/images/video/play_72dp.png"]/..')
            play_button.click()
            print(
                f"Pressed play on {streaming_link} with streamer {self.id}")
        except NoSuchElementException:
            _ = self.driver.find_element_by_xpath(
                '//div[@aria-label="Pause"]')
            print(f"Already playing with streamer {self.id}")
        except ElementNotInteractableException:
            print(
                f"Could not interact with page with streamer {self.id}")
        except ElementClickInterceptedException:
            print(
                f"Could not click with streamer {self.id}")

    def check_proxy(self):
        self.driver.get('https://whatsmyip.com/')

    def quit(self):
        self.driver.quit()


if __name__ == '__main__':
    proxy = {
        "id": 1,
        "host": "181.41.219.87",
        "port": "4444",
        "email": "100039077752920",
        "email_password": "888999",
        "username": "1a9e45a34f",
        "password": "OPSXjqHF",
        "active": True,
        "previous_activity_date": "1593642500"
    }

    bot = StreamBot(proxy=proxy, headless=False, id=1)
    bot.check_proxy()
    bot.login(proxy['email'], proxy['email_password'])
    bot.stream(
        'https://www.facebook.com/184096565021911/videos/602367887308937/', 3000)
