from FacebookStreamer import PostBot
from selenium.common.exceptions import NoSuchElementException
from multiprocessing import Process
from socket import timeout as TimeOutError
import json
import time

# import the constants from a config file
with open('config.json', 'r') as infile:
    info = json.loads(infile.read())

    # load the constants from the file
    WAIT_INCREMENT = info['wait_increment']
    DEFAULT_SLEEP_SPACING = info['default_sleep_spacing']
    HIDDEN_BROWSERS = info['hidden_browsers']

    # get default actions
    LIKE_DEFAULT = info['like_default']
    COMMENT_DEFAULT = info['comment_default']

    # load the accounts
    ACCOUNTS = info['accounts']


# create a list to manage all the opened streamers and bad accounts
open_streamers = []
bad_accounts = []


# make a function to initialize the streamers with the proxy (if applicable)
def run(post_link, account):
    try:
        post_bot = PostBot(
            proxy=account['proxy'], wait_increment=WAIT_INCREMENT)
    except KeyError:
        post_bot = PostBot(wait_increment=WAIT_INCREMENT)

    # get liking information (and comment info)
    try:
        like_bool = account['like']
    except KeyError:
        like_bool = LIKE_DEFAULT

    try:
        comment = account['comment']
    except KeyError:
        comment = COMMENT_DEFAULT

    try:
        # login
        active = post_bot.login(account['email'], account['password'])

        if active:
            print(f"\nOpened {account['email']}")
            open_streamers.append(post_bot)

            # like (and except os errors)
            if like_bool:
                try:
                    post_bot.like_post(post_link)
                except OSError:
                    pass
                except TimeOutError:
                    pass

            # comment if longer than 0 chars
            if len(comment) > 0:
                try:
                    post_bot.comment_on_post(post_link, comment)
                except OSError:
                    pass
                except TimeOutError:
                    pass
        else:
            bad_accounts.append(post_bot)
    except NoSuchElementException:
        print(f"Failed to open post_bot with {account['email']}")
        bad_accounts.append(account)
        open


if __name__ == '__main__':
    # Primarily: get the streaming link
    post_link = input('Post Link: ')
    print('\n')

    # start the processes
    proc = []
    for account in ACCOUNTS:
        p = Process(target=run, args=(post_link, account, ))
        p.start()

        proc.append(p)

        # sleep if applicable
        try:
            time.sleep(account['sleep_spacing'])
        except KeyError:
            time.sleep(DEFAULT_SLEEP_SPACING)

    start = time.time()

    # join the processes
    for p in proc:
        p.join()

    print(f"{len(ACCOUNTS) - len(bad_accounts)} bots are running")
    print(f"Bad Accounts: \n{json.dumps(bad_accounts, indent=4)}")

    print('Everything is done!')
