from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType


class Streamer:
    def __init__(self, proxy=None):
        # create a webdriver to work with
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--window-size=1420,1080')
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')

        # add a proxy if available
        if proxy:
            prox_str = f"{proxy['host']}:{proxy['port']}"
            prox = Proxy()
            prox.proxy_type = ProxyType.MANUAL
            prox.http_proxy = prox_str
            prox.socks_proxy = prox_str
            prox.ssl_proxy = prox_str
            options.Proxy = prox

        self.driver = webdriver.Chrome(options=options)

    # add some functions to login and stream things here

    def close(self):
        self.driver.close()
